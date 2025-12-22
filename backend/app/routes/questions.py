"""
Question and Answer Routes
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import List, Optional
import httpx
import os
import logging

from ..database import get_db
from ..models import Question, Answer, User, QuestionStatus
from ..schemas import (
    QuestionCreate, 
    QuestionResponse, 
    QuestionUpdate,
    AnswerCreate,
    AnswerResponse
)
from ..auth import get_current_user, require_admin
from ..websocket import manager
from ..ai_assistant import get_ai_suggestion

router = APIRouter(prefix="/questions", tags=["Questions"])
logger = logging.getLogger(__name__)


@router.post("", response_model=QuestionResponse, status_code=status.HTTP_201_CREATED)
async def create_question(
    question_data: QuestionCreate,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user)
):
    """
    Submit a new question (guests and authenticated users)
    
    - **message**: Question text (required, 1-1000 characters)
    - **username**: Display name (optional, defaults to "Guest")
    """
    # Create question
    new_question = Question(
        user_id=current_user.user_id if current_user else None,
        username=current_user.username if current_user else question_data.username,
        message=question_data.message,
        status=QuestionStatus.PENDING
    )
    
    db.add(new_question)
    db.commit()
    db.refresh(new_question)
    
    # Broadcast new question to all clients
    await manager.broadcast({
        "type": "new_question",
        "data": {
            "question_id": new_question.question_id,
            "username": new_question.username,
            "message": new_question.message,
            "status": new_question.status.value,
            "timestamp": new_question.timestamp.isoformat(),
            "updated_at": new_question.updated_at.isoformat(),
            "answers": []
        }
    })
    
    # Notify admins about new question
    await manager.notify_admins({
        "type": "admin_notification",
        "data": {
            "message": f"New question from {new_question.username}",
            "question_id": new_question.question_id
        }
    })
    
    # AI Auto-Suggest Answer (Bonus Feature)
    ai_suggestion = get_ai_suggestion(question_data.message)
    if ai_suggestion and ai_suggestion.get("confidence", 0) > 0.75:
        # Auto-create AI-suggested answer for high-confidence suggestions
        ai_answer = Answer(
            question_id=new_question.question_id,
            user_id=None,  # System-generated
            username=ai_suggestion.get("suggested_by", "AI Assistant"),
            message=f"🤖 **AI-Suggested Answer** (Confidence: {int(ai_suggestion['confidence'] * 100)}%)\n\n{ai_suggestion['answer']}"
        )
        db.add(ai_answer)
        db.commit()
        db.refresh(ai_answer)
        
        # Broadcast AI answer
        await manager.broadcast({
            "type": "new_answer",
            "data": {
                "question_id": new_question.question_id,
                "answer_id": ai_answer.answer_id,
                "username": ai_answer.username,
                "message": ai_answer.message,
                "timestamp": ai_answer.timestamp.isoformat()
            }
        })
        
        logger.info(f"AI suggested answer for question {new_question.question_id} (confidence: {ai_suggestion['confidence']})")
    
    return new_question


@router.get("", response_model=List[QuestionResponse])
async def get_questions(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """
    Get all questions, ordered by status (Escalated first) then timestamp
    
    - Escalated questions appear at the top
    - Within each status, newest questions first
    """
    # Custom ordering: Escalated first, then by timestamp descending
    questions = db.query(Question).order_by(
        # Escalated = 0, Pending = 1, Answered = 2 (for sorting)
        Question.status == QuestionStatus.ANSWERED,
        Question.status == QuestionStatus.PENDING,
        desc(Question.timestamp)
    ).offset(skip).limit(limit).all()
    
    return questions


@router.get("/{question_id}", response_model=QuestionResponse)
async def get_question(question_id: int, db: Session = Depends(get_db)):
    """Get a specific question by ID"""
    question = db.query(Question).filter(Question.question_id == question_id).first()
    
    if not question:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Question not found"
        )
    
    return question


@router.patch("/{question_id}/status", response_model=QuestionResponse)
async def update_question_status(
    question_id: int,
    status_update: QuestionUpdate,
    db: Session = Depends(get_db),
    admin_user: User = Depends(require_admin)
):
    """
    Update question status (Admin only)
    
    - **status**: "Pending", "Escalated", or "Answered"
    """
    question = db.query(Question).filter(Question.question_id == question_id).first()
    
    if not question:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Question not found"
        )
    
    old_status = question.status
    question.status = status_update.status
    db.commit()
    db.refresh(question)
    
    # Broadcast status update
    await manager.broadcast({
        "type": "question_updated",
        "data": {
            "question_id": question.question_id,
            "username": question.username,
            "message": question.message,
            "status": question.status.value,
            "timestamp": question.timestamp.isoformat(),
            "updated_at": question.updated_at.isoformat(),
            "answers": [
                {
                    "answer_id": a.answer_id,
                    "question_id": a.question_id,
                    "username": a.username,
                    "message": a.message,
                    "timestamp": a.timestamp.isoformat()
                }
                for a in question.answers
            ]
        }
    })
    
    # Trigger webhook if question is answered
    if status_update.status == QuestionStatus.ANSWERED and old_status != QuestionStatus.ANSWERED:
        await trigger_webhook(question)
    
    return question


@router.post("/{question_id}/answers", response_model=AnswerResponse, status_code=status.HTTP_201_CREATED)
async def create_answer(
    question_id: int,
    answer_data: AnswerCreate,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user)
):
    """
    Submit an answer to a question (guests and authenticated users)
    
    - **message**: Answer text (required, 1-1000 characters)
    - **username**: Display name (optional, defaults to "Guest")
    """
    # Verify question exists
    question = db.query(Question).filter(Question.question_id == question_id).first()
    if not question:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Question not found"
        )
    
    # Create answer
    new_answer = Answer(
        question_id=question_id,
        user_id=current_user.user_id if current_user else None,
        username=current_user.username if current_user else answer_data.username,
        message=answer_data.message
    )
    
    db.add(new_answer)
    db.commit()
    db.refresh(new_answer)
    
    # Broadcast new answer
    await manager.broadcast({
        "type": "new_answer",
        "data": {
            "answer_id": new_answer.answer_id,
            "question_id": question_id,
            "username": new_answer.username,
            "message": new_answer.message,
            "timestamp": new_answer.timestamp.isoformat()
        }
    })
    
    return new_answer


async def trigger_webhook(question: Question):
    """
    Trigger webhook when question is answered (Optional feature)
    """
    webhook_url = os.getenv("WEBHOOK_URL")
    
    if not webhook_url:
        return
    
    try:
        async with httpx.AsyncClient() as client:
            await client.post(
                webhook_url,
                json={
                    "event": "question_answered",
                    "question_id": question.question_id,
                    "username": question.username,
                    "message": question.message,
                    "status": question.status.value,
                    "timestamp": question.timestamp.isoformat()
                },
                timeout=5.0
            )
    except Exception as e:
        print(f"Webhook error: {e}")

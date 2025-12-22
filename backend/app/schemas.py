"""
Pydantic schemas for request/response validation
"""
from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional, List
from datetime import datetime
from enum import Enum


class QuestionStatus(str, Enum):
    PENDING = "Pending"
    ESCALATED = "Escalated"
    ANSWERED = "Answered"


# User Schemas
class UserCreate(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=6)


class UserLogin(BaseModel):
    username: str
    password: str


class UserResponse(BaseModel):
    user_id: int
    username: str
    email: str
    is_admin: int
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: Optional[str] = None
    is_admin: bool = False


# Question Schemas
class QuestionCreate(BaseModel):
    message: str = Field(..., min_length=1, max_length=1000)
    username: Optional[str] = Field(default="Guest", max_length=50)

    @validator('message')
    def message_not_blank(cls, v):
        if not v or not v.strip():
            raise ValueError('Question cannot be blank')
        return v.strip()


class QuestionUpdate(BaseModel):
    status: QuestionStatus


class AnswerCreate(BaseModel):
    message: str = Field(..., min_length=1, max_length=1000)
    username: Optional[str] = Field(default="Guest", max_length=50)

    @validator('message')
    def message_not_blank(cls, v):
        if not v or not v.strip():
            raise ValueError('Answer cannot be blank')
        return v.strip()


class AnswerResponse(BaseModel):
    answer_id: int
    question_id: int
    username: str
    message: str
    timestamp: datetime

    class Config:
        from_attributes = True


class QuestionResponse(BaseModel):
    question_id: int
    username: str
    message: str
    status: QuestionStatus
    timestamp: datetime
    updated_at: datetime
    answers: List[AnswerResponse] = []

    class Config:
        from_attributes = True


# WebSocket Messages
class WSMessage(BaseModel):
    type: str  # "new_question", "question_updated", "new_answer"
    data: dict

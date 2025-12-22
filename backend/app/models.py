"""
SQLAlchemy Database Models
"""
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum, Text
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from .database import Base


class QuestionStatus(str, enum.Enum):
    PENDING = "Pending"
    ESCALATED = "Escalated"
    ANSWERED = "Answered"


class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    password = Column(String(255), nullable=False)  # Hashed password
    is_admin = Column(Integer, default=0)  # 0 = guest, 1 = admin
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    questions = relationship("Question", back_populates="user")
    answers = relationship("Answer", back_populates="user")


class Question(Base):
    __tablename__ = "questions"

    question_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=True)  # Nullable for guests
    username = Column(String(50), nullable=False)  # Store username for guests
    message = Column(Text, nullable=False)
    status = Column(Enum(QuestionStatus), default=QuestionStatus.PENDING)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="questions")
    answers = relationship("Answer", back_populates="question", cascade="all, delete-orphan")


class Answer(Base):
    __tablename__ = "answers"

    answer_id = Column(Integer, primary_key=True, index=True)
    question_id = Column(Integer, ForeignKey("questions.question_id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=True)  # Nullable for guests
    username = Column(String(50), nullable=False)
    message = Column(Text, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)

    # Relationships
    question = relationship("Question", back_populates="answers")
    user = relationship("User", back_populates="answers")

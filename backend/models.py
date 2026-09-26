from datetime import datetime

from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
)
from sqlalchemy.orm import relationship

from database import Base


class Creator(Base):
    __tablename__ = "creators"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)

    forms = relationship("Form", back_populates="creator")


class Form(Base):
    __tablename__ = "forms"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)

    # draft / published
    status = Column(String, default="draft")

    # Used for public URL
    slug = Column(String, unique=True, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )

    creator_id = Column(Integer, ForeignKey("creators.id"))

    creator = relationship(
        "Creator",
        back_populates="forms"
    )

    questions = relationship(
        "Question",
        back_populates="form",
        cascade="all, delete-orphan"
    )

    responses = relationship(
        "Response",
        back_populates="form",
        cascade="all, delete-orphan"
    )


class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)

    form_id = Column(
        Integer,
        ForeignKey("forms.id")
    )

    type = Column(String, nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)

    required = Column(Boolean, default=False)

    # Question ordering
    position = Column(Integer, nullable=False)

    # Options/settings stored as JSON text
    settings = Column(Text, nullable=True)

    form = relationship(
        "Form",
        back_populates="questions"
    )

    answers = relationship(
        "Answer",
        back_populates="question"
    )


class Response(Base):
    __tablename__ = "responses"

    id = Column(Integer, primary_key=True, index=True)

    form_id = Column(
        Integer,
        ForeignKey("forms.id")
    )

    submitted_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    form = relationship(
        "Form",
        back_populates="responses"
    )

    answers = relationship(
        "Answer",
        back_populates="response",
        cascade="all, delete-orphan"
    )


class Answer(Base):
    __tablename__ = "answers"

    id = Column(Integer, primary_key=True, index=True)

    response_id = Column(
        Integer,
        ForeignKey("responses.id")
    )

    question_id = Column(
        Integer,
        ForeignKey("questions.id")
    )

    value = Column(Text, nullable=True)

    response = relationship(
        "Response",
        back_populates="answers"
    )

    question = relationship(
        "Question",
        back_populates="answers"
    )
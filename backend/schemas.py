from typing import Optional
from pydantic import BaseModel


# -----------------------------
# FORM SCHEMAS
# -----------------------------

class FormCreate(BaseModel):
    title: str
    description: Optional[str] = None


class FormUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None


# -----------------------------
# QUESTION SCHEMAS
# -----------------------------

class QuestionCreate(BaseModel):
    type: str
    title: str
    description: Optional[str] = None
    required: bool = False
    position: int
    settings: Optional[str] = None


class QuestionUpdate(BaseModel):
    type: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None
    required: Optional[bool] = None
    position: Optional[int] = None
    settings: Optional[str] = None


class ReorderQuestions(BaseModel):
    question_ids: list[int]


# -----------------------------
# RESPONSE SCHEMAS
# -----------------------------

class AnswerCreate(BaseModel):
    question_id: int
    value: Optional[str] = None


class ResponseCreate(BaseModel):
    answers: list[AnswerCreate]
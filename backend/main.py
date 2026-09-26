from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel

from ai.generator import generate_form_from_prompt, AIForm

from database import Base, engine, get_db
import models
import schemas
import crud


# =========================================================
# APP
# =========================================================

app = FastAPI(
    title="Typeform Clone API",
    version="1.0.0"
)


# =========================================================
# CORS
# =========================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://typeform-clone-frontend-qnxqagsdb-crips1.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================================================
# DATABASE
# =========================================================

Base.metadata.create_all(
    bind=engine
)


# =========================================================
# BASIC ROUTES
# =========================================================

@app.get("/")
def root():
    return {
        "message": "Typeform Clone API is running"
    }


@app.get("/health")
def health():
    return {
        "status": "ok"
    }


# =========================================================
# FORM ROUTES
# =========================================================

@app.post("/forms")
def create_form(
    form_data: schemas.FormCreate,
    db: Session = Depends(get_db)
):
    return crud.create_form(
        db,
        form_data
    )


@app.get("/forms")
def get_forms(
    db: Session = Depends(get_db)
):
    return crud.get_forms(db)


@app.get("/forms/{form_id}")
def get_form(
    form_id: int,
    db: Session = Depends(get_db)
):
    form = crud.get_form(
        db,
        form_id
    )

    if not form:
        raise HTTPException(
            status_code=404,
            detail="Form not found"
        )

    return form


@app.put("/forms/{form_id}")
def update_form(
    form_id: int,
    form_data: schemas.FormUpdate,
    db: Session = Depends(get_db)
):
    form = crud.update_form(
        db,
        form_id,
        form_data
    )

    if not form:
        raise HTTPException(
            status_code=404,
            detail="Form not found"
        )

    return form


@app.delete("/forms/{form_id}")
def delete_form(
    form_id: int,
    db: Session = Depends(get_db)
):
    form = crud.delete_form(
        db,
        form_id
    )

    if not form:
        raise HTTPException(
            status_code=404,
            detail="Form not found"
        )

    return {
        "message": "Form deleted successfully"
    }
@app.post("/forms/{form_id}/duplicate")
def duplicate_form(
    form_id: int,
    db: Session = Depends(get_db)
):
    form = crud.duplicate_form(db, form_id)

    if not form:
        raise HTTPException(
            status_code=404,
            detail="Form not found"
        )

    return form

# =========================================================
# PUBLISH / UNPUBLISH
# =========================================================

@app.post("/forms/{form_id}/publish")
def publish_form(
    form_id: int,
    db: Session = Depends(get_db)
):
    form = crud.publish_form(
        db,
        form_id
    )

    if not form:
        raise HTTPException(
            status_code=404,
            detail="Form not found"
        )

    return {
        "message": "Form published successfully",
        "id": form.id,
        "status": form.status,
        "slug": form.slug
    }


@app.post("/forms/{form_id}/unpublish")
def unpublish_form(
    form_id: int,
    db: Session = Depends(get_db)
):
    form = crud.unpublish_form(
        db,
        form_id
    )

    if not form:
        raise HTTPException(
            status_code=404,
            detail="Form not found"
        )

    return {
        "message": "Form unpublished successfully",
        "id": form.id,
        "status": form.status
    }


# =========================================================
# QUESTION ROUTES
# =========================================================

@app.post(
    "/forms/{form_id}/questions"
)
def create_question(
    form_id: int,
    question_data: schemas.QuestionCreate,
    db: Session = Depends(get_db)
):

    form = crud.get_form(
        db,
        form_id
    )

    if not form:
        raise HTTPException(
            status_code=404,
            detail="Form not found"
        )

    return crud.create_question(
        db,
        form_id,
        question_data
    )


@app.get(
    "/forms/{form_id}/questions"
)
def get_questions(
    form_id: int,
    db: Session = Depends(get_db)
):

    form = crud.get_form(
        db,
        form_id
    )

    if not form:
        raise HTTPException(
            status_code=404,
            detail="Form not found"
        )

    return crud.get_questions(
        db,
        form_id
    )


@app.put(
    "/questions/{question_id}"
)
def update_question(
    question_id: int,
    question_data: schemas.QuestionUpdate,
    db: Session = Depends(get_db)
):

    question = crud.update_question(
        db,
        question_id,
        question_data
    )

    if not question:
        raise HTTPException(
            status_code=404,
            detail="Question not found"
        )

    return question


@app.delete(
    "/questions/{question_id}"
)
def delete_question(
    question_id: int,
    db: Session = Depends(get_db)
):

    question = crud.delete_question(
        db,
        question_id
    )

    if not question:
        raise HTTPException(
            status_code=404,
            detail="Question not found"
        )

    return {
        "message": "Question deleted successfully"
    }


@app.put(
    "/forms/{form_id}/questions/reorder"
)
def reorder_questions(
    form_id: int,
    data: schemas.ReorderQuestions,
    db: Session = Depends(get_db)
):

    form = crud.get_form(
        db,
        form_id
    )

    if not form:
        raise HTTPException(
            status_code=404,
            detail="Form not found"
        )

    return crud.reorder_questions(
        db,
        form_id,
        data.question_ids
    )


# =========================================================
# RESPONSE ROUTES
# =========================================================

@app.post(
    "/forms/{form_id}/responses"
)
def create_response(
    form_id: int,
    response_data: schemas.ResponseCreate,
    db: Session = Depends(get_db)
):

    form = crud.get_form(
        db,
        form_id
    )

    if not form:
        raise HTTPException(
            status_code=404,
            detail="Form not found"
        )

    if form.status != "published":
        raise HTTPException(
            status_code=400,
            detail="Form is not published"
        )

    return crud.create_response(
        db,
        form_id,
        response_data
    )


@app.get(
    "/forms/{form_id}/responses"
)
def get_responses(
    form_id: int,
    db: Session = Depends(get_db)
):

    form = crud.get_form(
        db,
        form_id
    )

    if not form:
        raise HTTPException(
            status_code=404,
            detail="Form not found"
        )

    return crud.get_responses(
        db,
        form_id
    )


# =========================================================
# PUBLIC FORM
# =========================================================

@app.get(
    "/public/forms/{slug}"
)
def get_public_form(
    slug: str,
    db: Session = Depends(get_db)
):

    form = (
        db.query(models.Form)
        .filter(
            models.Form.slug == slug,
            models.Form.status == "published"
        )
        .first()
    )

    if not form:
        raise HTTPException(
            status_code=404,
            detail="Published form not found"
        )

    questions = crud.get_questions(
        db,
        form.id
    )

    return {
        "id": form.id,
        "title": form.title,
        "description": form.description,
        "slug": form.slug,
        "status": form.status,
        "questions": questions
    }


# =========================================================
# AI FORM GENERATION
# =========================================================

class AIGenerateFormRequest(BaseModel):
    prompt: str


@app.post(
    "/ai/generate-form",
    response_model=AIForm
)
def generate_ai_form(
    payload: AIGenerateFormRequest
):

    if not payload.prompt.strip():
        raise HTTPException(
            status_code=400,
            detail="Prompt cannot be empty"
        )

    try:

        form = generate_form_from_prompt(
            payload.prompt
        )

        return form

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=str(error)
        )
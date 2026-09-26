from sqlalchemy.orm import Session

import models
import schemas


# =========================================================
# FORM CRUD
# =========================================================

def create_form(
    db: Session,
    form_data: schemas.FormCreate
):
    form = models.Form(
        title=form_data.title,
        description=form_data.description,
        status="draft",
        creator_id=1
    )

    db.add(form)
    db.commit()
    db.refresh(form)

    return form


def get_forms(db: Session):
    return (
        db.query(models.Form)
        .order_by(models.Form.created_at.desc())
        .all()
    )


def get_form(
    db: Session,
    form_id: int
):
    return (
        db.query(models.Form)
        .filter(models.Form.id == form_id)
        .first()
    )


def update_form(
    db: Session,
    form_id: int,
    form_data: schemas.FormUpdate
):
    form = get_form(db, form_id)

    if not form:
        return None

    if form_data.title is not None:
        form.title = form_data.title

    if form_data.description is not None:
        form.description = form_data.description

    db.commit()
    db.refresh(form)

    return form


def delete_form(
    db: Session,
    form_id: int
):
    form = get_form(db, form_id)

    if not form:
        return None

    db.delete(form)
    db.commit()

    return form


# =========================================================
# QUESTION CRUD
# =========================================================

def create_question(
    db: Session,
    form_id: int,
    question_data: schemas.QuestionCreate
):
    question = models.Question(
        form_id=form_id,
        type=question_data.type,
        title=question_data.title,
        description=question_data.description,
        required=question_data.required,
        position=question_data.position,
        settings=question_data.settings
    )

    db.add(question)
    db.commit()
    db.refresh(question)

    return question


def get_questions(
    db: Session,
    form_id: int
):
    return (
        db.query(models.Question)
        .filter(models.Question.form_id == form_id)
        .order_by(models.Question.position)
        .all()
    )


def get_question(
    db: Session,
    question_id: int
):
    return (
        db.query(models.Question)
        .filter(models.Question.id == question_id)
        .first()
    )


def update_question(
    db: Session,
    question_id: int,
    question_data: schemas.QuestionUpdate
):
    question = get_question(db, question_id)

    if not question:
        return None

    if question_data.type is not None:
        question.type = question_data.type

    if question_data.title is not None:
        question.title = question_data.title

    if question_data.description is not None:
        question.description = question_data.description

    if question_data.required is not None:
        question.required = question_data.required

    if question_data.position is not None:
        question.position = question_data.position

    if question_data.settings is not None:
        question.settings = question_data.settings

    db.commit()
    db.refresh(question)

    return question


def delete_question(
    db: Session,
    question_id: int
):
    question = get_question(db, question_id)

    if not question:
        return None

    db.delete(question)
    db.commit()

    return question


def reorder_questions(
    db: Session,
    form_id: int,
    question_ids: list[int]
):
    questions = (
        db.query(models.Question)
        .filter(models.Question.form_id == form_id)
        .all()
    )

    question_map = {
        question.id: question
        for question in questions
    }

    for position, question_id in enumerate(
        question_ids,
        start=1
    ):
        if question_id in question_map:
            question_map[question_id].position = position

    db.commit()

    return get_questions(db, form_id)


# =========================================================
# PUBLISH / UNPUBLISH
# =========================================================

def publish_form(
    db: Session,
    form_id: int
):
    form = get_form(db, form_id)

    if not form:
        return None

    # Create a simple public slug
    if not form.slug:
        form.slug = f"form-{form.id}"

    form.status = "published"

    db.commit()
    db.refresh(form)

    return form


def unpublish_form(
    db: Session,
    form_id: int
):
    form = get_form(db, form_id)

    if not form:
        return None

    form.status = "draft"

    db.commit()
    db.refresh(form)

    return form


# =========================================================
# RESPONSES
# =========================================================

def create_response(
    db: Session,
    form_id: int,
    response_data: schemas.ResponseCreate
):
    response = models.Response(
        form_id=form_id
    )

    db.add(response)
    db.flush()

    for answer_data in response_data.answers:

        answer = models.Answer(
            response_id=response.id,
            question_id=answer_data.question_id,
            value=answer_data.value
        )

        db.add(answer)

    db.commit()
    db.refresh(response)

    return response


def get_responses(
    db: Session,
    form_id: int
):
    return (
        db.query(models.Response)
        .filter(
            models.Response.form_id == form_id
        )
        .order_by(
            models.Response.submitted_at.desc()
        )
        .all()
    )
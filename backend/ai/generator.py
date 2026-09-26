from typing import List, Optional
import os
import json

from dotenv import load_dotenv
from pydantic import BaseModel
from google import genai


# =========================================================
# LOAD ENVIRONMENT VARIABLES
# =========================================================

load_dotenv()


# =========================================================
# GEMINI CLIENT
# =========================================================

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)


# =========================================================
# AI QUESTION STRUCTURE
# =========================================================

class AIQuestion(BaseModel):
    type: str
    title: str
    description: Optional[str] = None
    required: bool
    settings: str


# =========================================================
# AI FORM STRUCTURE
# =========================================================

class AIForm(BaseModel):
    title: str
    description: Optional[str] = None
    questions: List[AIQuestion]


# =========================================================
# ALLOWED QUESTION TYPES
# =========================================================

ALLOWED_TYPES = {
    "short_text",
    "long_text",
    "email",
    "phone",
    "number",
    "multiple_choice",
    "dropdown",
    "picture_choice",
    "yes_no",
    "checkbox",
    "legal",
    "rating",
    "nps",
    "opinion_scale",
    "ranking",
    "matrix",
    "date",
    "website",
}


# =========================================================
# GENERATE FORM FROM PROMPT
# =========================================================

def generate_form_from_prompt(user_prompt: str) -> AIForm:

    system_prompt = """
You are an AI form builder.

Convert the user's natural language request into a useful
online form.

Generate:

1. A clear form title.
2. A short form description.
3. Between 3 and 10 relevant questions.
4. An appropriate question type for every question.
5. Whether each question is required.
6. Appropriate settings for each question.

Allowed question types:

- short_text
- long_text
- email
- phone
- number
- multiple_choice
- dropdown
- picture_choice
- yes_no
- checkbox
- legal
- rating
- nps
- opinion_scale
- ranking
- matrix
- date
- website


IMPORTANT:

The "settings" field MUST be a JSON STRING.

Examples:

For short_text:

"{\"placeholder\": \"Enter your answer\"}"

For long_text:

"{\"placeholder\": \"Write your answer\"}"

For email:

"{\"placeholder\": \"name@example.com\"}"

For rating:

"{\"scale\": 5}"

For nps:

"{\"scale\": 10}"

For opinion_scale:

"{\"scale\": 5}"

For multiple_choice:

"{\"options\": [\"Option 1\", \"Option 2\", \"Option 3\"]}"

For dropdown:

"{\"options\": [\"Option 1\", \"Option 2\", \"Option 3\"]}"

For yes_no:

"{\"yes_label\": \"Yes\", \"no_label\": \"No\"}"

For ranking:

"{\"options\": [\"Option 1\", \"Option 2\", \"Option 3\"]}"

For matrix:

"{\"rows\": [\"Row 1\", \"Row 2\"], \"columns\": [\"Poor\", \"Average\", \"Good\"]}"


Keep question wording concise and natural.

Do not create unnecessary questions.

Return only the requested form structure.
"""

    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=f"""
{system_prompt}

USER REQUEST:
{user_prompt}
""",
        config={
            "response_mime_type": "application/json",
            "response_schema": AIForm,
        },
    )

    if not response.text:
        raise ValueError("Gemini did not return a valid response.")

    # Convert Gemini JSON response into our Pydantic model
    form_data = json.loads(response.text)

    form = AIForm.model_validate(form_data)

    # =====================================================
    # VALIDATE QUESTION TYPES AND SETTINGS
    # =====================================================

    for question in form.questions:

        if question.type not in ALLOWED_TYPES:
            raise ValueError(
                f"Unsupported question type: {question.type}"
            )

        # Make sure settings contains valid JSON
        try:
            json.loads(question.settings)
        except json.JSONDecodeError:
            raise ValueError(
                f"Invalid settings JSON for question: {question.title}"
            )

    return form
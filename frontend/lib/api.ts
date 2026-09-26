
const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// ======================================================
// FORMS
// ======================================================

export async function getForms() {
  const response = await fetch(`${API_URL}/forms`);

  if (!response.ok) {
    throw new Error("Failed to fetch forms");
  }

  return response.json();
}

export async function createForm(
  title: string,
  description: string
) {
  const response = await fetch(`${API_URL}/forms`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title,
      description,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to create form");
  }

  return response.json();
}

export async function getForm(formId: number) {
  const response = await fetch(
    `${API_URL}/forms/${formId}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch form");
  }

  return response.json();
}

export async function updateForm(
  formId: number,
  data: {
    title?: string;
    description?: string;
  }
) 

{
  const response = await fetch(
    `${API_URL}/forms/${formId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    throw new Error(
      error?.detail || "Failed to update form"
    );
  }

  return response.json();
}

export async function duplicateForm(formId: number) {
  const response = await fetch(
    `${API_URL}/forms/${formId}/duplicate`,
    {
      method: "POST",
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    throw new Error(
      error?.detail || "Failed to duplicate form"
    );
  }

  return response.json();
}

// ======================================================
// QUESTIONS
// ======================================================

export async function getQuestions(
  formId: number
) {
  const response = await fetch(
    `${API_URL}/forms/${formId}/questions`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch questions");
  }

  return response.json();
}

export async function createQuestion(
  formId: number,
  data: {
    type: string;
    title: string;
    description?: string;
    required?: boolean;
    position: number;
    settings?: string;
  }
) {
  const response = await fetch(
    `${API_URL}/forms/${formId}/questions`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to create question");
  }

  return response.json();
}

export async function updateQuestion(
  questionId: number,
  data: {
    type?: string;
    title?: string;
    description?: string;
    required?: boolean;
    position?: number;
    settings?: string;
  }
) {
  const response = await fetch(
    `${API_URL}/questions/${questionId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update question");
  }

  return response.json();
}

export async function deleteQuestion(
  questionId: number
) {
  const response = await fetch(
    `${API_URL}/questions/${questionId}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete question");
  }

  return response.json();
}

export async function reorderQuestions(
  formId: number,
  questionIds: number[]
) {
  const response = await fetch(
    `${API_URL}/forms/${formId}/questions/reorder`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question_ids: questionIds,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to reorder questions");
  }

  return response.json();
}

// ======================================================
// PUBLISH
// ======================================================

export async function publishForm(
  formId: number
) {
  const response = await fetch(
    `${API_URL}/forms/${formId}/publish`,
    {
      method: "POST",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to publish form");
  }

  return response.json();
}

export async function unpublishForm(
  formId: number
) {
  const response = await fetch(
    `${API_URL}/forms/${formId}/unpublish`,
    {
      method: "POST",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to unpublish form");
  }

  return response.json();
}

// ======================================================
// AI FORM GENERATION
// ======================================================

export async function generateFormWithAI(
  prompt: string
) {
  const response = await fetch(
    `${API_URL}/ai/generate-form`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
      }),
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    throw new Error(
      error?.detail ||
        "AI form generation failed"
    );
  }

  return response.json();
}

// ======================================================
// RESPONSES
// ======================================================

export async function submitResponse(
  formId: number,
  answers: {
    question_id: number;
    value: string;
  }[]
) {
  const response = await fetch(
    `${API_URL}/forms/${formId}/responses`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        answers,
      }),
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    throw new Error(
      error?.detail ||
        "Failed to submit response"
    );
  }

  return response.json();
}
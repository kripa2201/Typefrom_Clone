"use client";

import { useEffect, useState } from "react";
import {
  getQuestions,
  submitResponse,
} from "@/lib/api";

interface Form {
  id: number;
  title: string;
  description?: string | null;
  status: string;
  slug?: string | null;
}

interface Question {
  id: number;
  form_id: number;
  type: string;
  title: string;
  description?: string | null;
  required: boolean;
  position: number;
  settings?: string | null;
}

function parseSettings(settings?: string | null) {
  if (!settings) return {};

  try {
    return JSON.parse(settings);
  } catch {
    return {};
  }
}

export default function PublicForm({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [form, setForm] = useState<Form | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const [slug, setSlug] = useState("");

  useEffect(() => {
    async function loadForm() {
      try {
        const { slug: currentSlug } = await params;

        setSlug(currentSlug);

        const formData = await getFormBySlug(currentSlug);

        const questionData = await getQuestions(formData.id);

        setForm(formData);
        setQuestions(
          [...questionData].sort(
            (a, b) => a.position - b.position
          )
        );
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadForm();
  }, [params]);

 async function getFormBySlug(currentSlug: string) {
  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const response = await fetch(
    `${API_URL}/public/forms/${currentSlug}`
  );

    if (!response.ok) {
      throw new Error("Form not found");
    }

    return response.json();
  }

  function updateAnswer(
    questionId: number,
    value: any
  ) {
    setAnswers((previous) => ({
      ...previous,
      [questionId]: value,
    }));
  }

async function nextQuestion() {
  const question = questions[currentQuestion];

  if (
    question.required &&
    !answers[question.id]
  ) {
    alert("Please answer this question.");
    return;
  }

  if (
    currentQuestion <
    questions.length - 1
  ) {
    setCurrentQuestion(
      (previous) => previous + 1
    );
    return;
  }

  try {
    await submitResponse(
      form!.id,
      questions.map((question) => ({
        question_id: question.id,
        value: String(
          answers[question.id] ?? ""
        ),
      }))
    );

    setSubmitted(true);
  } catch (error) {
    console.error(error);
    alert(
      error instanceof Error
        ? error.message
        : "Failed to submit response"
    );
  }
}

  function previousQuestion() {
    if (currentQuestion > 0) {
      setCurrentQuestion(
        (previous) => previous - 1
      );
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f7f8]">
        <p className="text-sm text-gray-500">
          Loading form...
        </p>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="text-center">
          <h1 className="text-3xl font-semibold">
            404
          </h1>

          <p className="mt-2 text-gray-400">
            This form could not be found.
          </p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#302733] px-6 text-white">
        <div className="w-full max-w-2xl text-center">
          <div className="mb-8 text-6xl">
            ✓
          </div>

          <h1 className="text-4xl font-semibold">
            Thank you!
          </h1>

          <p className="mt-4 text-lg text-white/70">
            Your response has been submitted.
          </p>
        </div>
      </div>
    );
  }

  const question =
    questions[currentQuestion];

  if (!question) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>No questions in this form.</p>
      </div>
    );
  }

  const settings = parseSettings(
    question.settings
  );

  return (
    <main className="min-h-screen bg-white text-[#2d2d2d] flex flex-col">
      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-8 py-10">

        {/* HEADER */}

        <div className="mb-16">
          <h1 className="text-xl font-semibold">
            {form.title}
          </h1>

          {form.description && (
            <p className="mt-2 max-w-2xl text-sm text-gray-500">
              {form.description}
            </p>
          )}
        </div>

        {/* PROGRESS */}

        <div className="mb-10">
          <div className="mb-2 flex justify-between text-xs text-gray-400">
            <span>
              Question {currentQuestion + 1}
            </span>

            <span>
              {questions.length}
            </span>
          </div>

          <div className="h-1 overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full bg-[#302733] transition-all"
              style={{
                width: `${
                  ((currentQuestion + 1) /
                    questions.length) *
                  100
                }%`,
              }}
            />
          </div>
        </div>

        {/* QUESTION */}

       <div className="flex flex-1 items-center justify-center px-6">
         <div className="w-full max-w-3xl">

            <div className="mb-8 flex items-start gap-4">

             <div className="mt-2 flex shrink-0 items-center gap-2">
  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#302733] text-sm text-white">
    {currentQuestion + 1}
  </span>

  <span className="text-xs text-gray-400">
    / {questions.length}
  </span>
</div>

              <div>
                <h2 className="text-3xl font-medium">
                  {question.title}
                  {question.required && (
                    <span className="ml-1 text-red-500">
                      *
                    </span>
                  )}
                </h2>

                {question.description && (
                  <p className="mt-3 text-gray-500">
                    {question.description}
                  </p>
                )}
              </div>

            </div>

            {/* SHORT / LONG TEXT */}

            {(question.type ===
              "short_text" ||
              question.type ===
                "long_text" ||
              question.type ===
                "email" ||
              question.type ===
                "phone" ||
              question.type ===
                "number" ||
              question.type ===
                "website") && (
              <input
                type={
                  question.type === "email"
                    ? "email"
                    : question.type === "number"
                    ? "number"
                    : "text"
                }
                value={
                  answers[question.id] || ""
                }
                onChange={(event) =>
                  updateAnswer(
                    question.id,
                    event.target.value
                  )
                }
                placeholder={
                  settings.placeholder ||
                  "Type your answer here..."
                }
                className="w-full border-b-2 border-gray-300 bg-transparent py-5 text-3xl outline-none transition placeholder:text-gray-300 focus:border-[#302733]"
              />
            )}

            {/* MULTIPLE CHOICE */}

            {question.type ===
              "multiple_choice" && (
              <div className="space-y-3">

                {(settings.choices || [
                  "choice",
                ]).map(
                  (
                    choice: string,
                    index: number
                  ) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() =>
                        updateAnswer(
                          question.id,
                          choice
                        )
                      }
                        className={`flex w-full max-w-2xl items-center gap-5 rounded-xl border px-6 py-5 text-left text-lg transition ${                        answers[question.id] ===
                        choice
                          ? "border-[#302733] bg-gray-100"
                          : "border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg border text-sm">
                        {String.fromCharCode(
                          65 + index
                        )}
                      </span>

                      <span>
                        {choice}
                      </span>
                    </button>
                  )
                )}

              </div>
            )}

            {/* YES / NO */}

            {question.type ===
              "yes_no" && (
              <div className="flex gap-4">

                {["Yes", "No"].map(
                  (choice) => (
                    <button
                      key={choice}
                      type="button"
                      onClick={() =>
                        updateAnswer(
                          question.id,
                          choice
                        )
                      }
                      className={`rounded-xl border px-8 py-4 ${
                        answers[question.id] ===
                        choice
                          ? "border-[#302733] bg-gray-100"
                          : "border-gray-300"
                      }`}
                    >
                      {choice}
                    </button>
                  )
                )}

              </div>
            )}

            {/* RATING */}

            {question.type ===
              "rating" && (
              <div className="flex gap-6">

                {Array.from({
                  length:
                    settings.scale || 5,
                }).map((_, index) => {
                  const value = index + 1;

                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() =>
                        updateAnswer(
                          question.id,
                          value
                        )
                      }
                      className={`text-center ${
                        answers[question.id] ===
                        value
                          ? "text-[#302733]"
                          : "text-gray-400"
                      }`}
                    >
                      <div className="text-5xl">
                        ★
                      </div>

                      <div className="mt-1 text-sm">
                        {value}
                      </div>
                    </button>
                  );
                })}

              </div>
            )}

            {/* DATE */}

            {question.type ===
              "date" && (
              <input
                type="date"
                value={
                  answers[question.id] || ""
                }
                onChange={(event) =>
                  updateAnswer(
                    question.id,
                    event.target.value
                  )
                }
                className="rounded-xl border border-gray-300 px-4 py-3 outline-none"
              />
            )}

            {/* CHECKBOX */}

            {question.type ===
              "checkbox" && (
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={
                    answers[question.id] ||
                    false
                  }
                  onChange={(event) =>
                    updateAnswer(
                      question.id,
                      event.target.checked
                    )
                  }
                  className="h-5 w-5"
                />

                <span>
                  {settings.choices?.[0] ||
                    "I agree"}
                </span>
              </label>
            )}

            {/* NAVIGATION */}

            <div className="mt-16 flex items-center gap-4">
              {currentQuestion > 0 && (
                <button
                  type="button"
                  onClick={
                    previousQuestion
                  }
                  className="rounded-xl border border-gray-300 px-7 py-3.5 text-sm transition hover:bg-gray-50"
                >
                  Back
                </button>
              )}

              <button
                type="button"
                onClick={nextQuestion}
                className="rounded-xl bg-[#302733] px-8 py-3.5 text-sm font-medium text-white transition hover:bg-black hover:-translate-y-0.5"
              >
                {currentQuestion ===
                questions.length - 1
                  ? "Submit"
                  : "OK →"}
              </button>

            </div>

            <p className="mt-5 text-xs text-gray-400">
              Press Enter ↵
            </p>

          </div>
        </div>

        {/* FOOTER */}

        <div className="pt-10 text-xs text-gray-400">
          {slug}
        </div>

      </div>
    </main>
  );
}
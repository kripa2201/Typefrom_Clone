"use client";

import { useState } from "react";

interface Question {
  id: number;
  type: string;
  title: string;
  description?: string | null;
  required?: boolean;
  settings?: string | null;
}

interface Form {
  id: number;
  title: string;
  description?: string | null;
}

interface PreviewModalProps {
  form: Form;
  questions: Question[];
  onClose: () => void;
}

export default function PreviewModal({
  form,
  questions,
  onClose,
}: PreviewModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const currentQuestion = questions[currentIndex];

  const updateAnswer = (value: string) => {
    if (!currentQuestion) return;

    setAnswers((previous) => ({
      ...previous,
      [currentQuestion.id]: value,
    }));
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((previous) => previous + 1);
    }
  };

  const previousQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex((previous) => previous - 1);
    }
  };

  const renderInput = () => {
    if (!currentQuestion) return null;

    const value = answers[currentQuestion.id] || "";

    switch (currentQuestion.type) {
      case "email":
        return (
          <input
            type="email"
            value={value}
            onChange={(e) => updateAnswer(e.target.value)}
            placeholder="name@example.com"
            className="w-full max-w-xl border-b-2 border-gray-300 bg-transparent px-0 py-3 text-2xl outline-none focus:border-[#302733]"
          />
        );

      case "rating":
        return (
          <div className="flex gap-3">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                onClick={() => updateAnswer(String(rating))}
                className={`flex h-14 w-14 items-center justify-center rounded-xl border text-lg ${
                  value === String(rating)
                    ? "border-[#302733] bg-[#302733] text-white"
                    : "border-gray-300 bg-white hover:border-gray-500"
                }`}
              >
                {rating}
              </button>
            ))}
          </div>
        );

      case "long_text":
        return (
          <textarea
            value={value}
            onChange={(e) => updateAnswer(e.target.value)}
            placeholder="Type your answer here..."
            rows={4}
            className="w-full max-w-xl resize-none rounded-xl border border-gray-300 px-5 py-4 text-xl outline-none focus:border-[#302733]"
          />
        );

      default:
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => updateAnswer(e.target.value)}
            placeholder="Type your answer here..."
            className="w-full max-w-xl border-b-2 border-gray-300 bg-transparent px-0 py-3 text-2xl outline-none focus:border-[#302733]"
          />
        );
    }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-[#f7f5f2]">
      {/* Top bar */}
      <div className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
        <div className="text-sm font-medium text-gray-600">
          Preview
        </div>

        <button
          onClick={onClose}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
        >
          Close preview
        </button>
      </div>

      {/* Preview area */}
      <div className="flex h-[calc(100vh-64px)] items-center justify-center px-6">
        <div className="w-full max-w-3xl">
          {questions.length === 0 ? (
            <div className="text-center">
              <h1 className="text-3xl font-semibold text-[#302733]">
                {form.title}
              </h1>

              <p className="mt-3 text-gray-500">
                Add some questions to preview this form.
              </p>
            </div>
          ) : (
            <>
              {/* Form title on first question */}
              {currentIndex === 0 && (
                <div className="mb-10">
                  <h1 className="text-4xl font-semibold tracking-tight text-[#302733]">
                    {form.title}
                  </h1>

                  {form.description && (
                    <p className="mt-3 text-lg text-gray-500">
                      {form.description}
                    </p>
                  )}
                </div>
              )}

              {/* Question */}
              <div>
                <div className="mb-3 flex items-start gap-2">
                  <span className="text-lg font-medium text-gray-500">
                    {currentIndex + 1}.
                  </span>

                  <h2 className="text-3xl font-semibold leading-tight text-[#302733]">
                    {currentQuestion.title}
                    {currentQuestion.required && (
                      <span className="ml-1 text-red-500">*</span>
                    )}
                  </h2>
                </div>

                {currentQuestion.description && (
                  <p className="mb-6 ml-7 text-base text-gray-500">
                    {currentQuestion.description}
                  </p>
                )}

                <div className="ml-7 mt-6">
                  {renderInput()}
                </div>
              </div>

              {/* Navigation */}
              <div className="mt-12 flex items-center gap-3">
                <button
                  onClick={previousQuestion}
                  disabled={currentIndex === 0}
                  className="rounded-xl border border-gray-300 px-5 py-3 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Back
                </button>

                {currentIndex < questions.length - 1 ? (
                  <button
                    onClick={nextQuestion}
                    className="rounded-xl bg-[#302733] px-6 py-3 text-sm font-medium text-white hover:bg-black"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    onClick={() =>
                      alert("Preview complete. Response submission will be added next.")
                    }
                    className="rounded-xl bg-[#302733] px-6 py-3 text-sm font-medium text-white hover:bg-black"
                  >
                    Submit
                  </button>
                )}
              </div>

              {/* Progress */}
              <div className="mt-10 h-1 w-full overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full bg-[#302733] transition-all"
                  style={{
                    width: `${((currentIndex + 1) / questions.length) * 100}%`,
                  }}
                />
              </div>

              <p className="mt-3 text-xs text-gray-400">
                Question {currentIndex + 1} of {questions.length}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
"use client";

import { useState } from "react";
import AIFormPreview from "./AIFormPreview";
import {
  generateFormWithAI,
  createForm,
  createQuestion,
} from "@/lib/api";

interface AIFormModalProps {
  onClose: () => void;
}

interface AIForm {
  title: string;
  description: string;
  questions: {
    type: string;
    title: string;
    description?: string;
    required: boolean;
    settings: string;
  }[];
}

export default function AIFormModal({
  onClose,
}: AIFormModalProps) {
  const [prompt, setPrompt] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [generatedForm, setGeneratedForm] =
    useState<AIForm | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const examplePrompts = [
    "Create a customer feedback form",
    "Create a job application form",
    "Create a restaurant reservation form",
    "Create a student registration form",
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setError("");

    try {
      const form = await generateFormWithAI(prompt);

      setGeneratedForm(form);
      setShowPreview(true);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to generate form"
      );
    } finally {
      setLoading(false);
    }
  };

  if (showPreview && generatedForm) {
    return (
      <AIFormPreview
        form={generatedForm}
        onBack={() => setShowPreview(false)}
        onCreate={async (form) => {
  try {
    const createdForm = await createForm(
      form.title,
      form.description || ""
    );

    for (let i = 0; i < form.questions.length; i++) {
      const question = form.questions[i];

      await createQuestion(createdForm.id, {
        type: question.type,
        title: question.title,
        description: question.description || "",
        required: question.required,
        position: i,
        settings: question.settings,
      });
    }

    window.location.href = `/builder/${createdForm.id}`;
  } catch (error) {
    console.error("Failed to create AI form:", error);

    alert(
      error instanceof Error
        ? error.message
        : "Failed to create form"
    );
  }
}}
      />
    );
  }

  return (
    <div
    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-6"
    onClick={(event) => event.stopPropagation()}
    >
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold text-[#302733]">
              Create with AI
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Describe the form you want to create.
            </p>
          </div>

          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-xl text-gray-500 hover:bg-gray-100 hover:text-gray-800"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6">

          <label className="mb-2 block text-sm font-medium text-[#302733]">
            What do you want to create?
          </label>

          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="For example: Create a customer feedback form for a restaurant..."
            className="min-h-[150px] w-full resize-none rounded-xl border border-gray-300 p-4 text-sm outline-none transition focus:border-[#302733] focus:ring-2 focus:ring-[#302733]/10"
          />

          {/* Examples */}
          <div className="mt-5">
            <p className="mb-3 text-xs font-medium uppercase tracking-wide text-gray-500">
              Try an example
            </p>

            <div className="grid grid-cols-2 gap-3">
              {examplePrompts.map((example) => (
                <button
                  key={example}
                  onClick={() => setPrompt(example)}
                  className="rounded-xl border border-gray-200 p-3 text-left text-sm text-gray-700 transition hover:border-gray-400 hover:bg-gray-50"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Generate */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleGenerate}
              disabled={!prompt.trim() || loading}
              className="rounded-xl bg-[#302733] px-6 py-3 text-sm font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-40"
            >
              {loading ? "Generating..." : "Generate form"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
"use client";

interface AIQuestion {
  type: string;
  title: string;
  description?: string | null;
  required: boolean;
  settings: string;
}

interface AIForm {
  title: string;
  description?: string | null;
  questions: AIQuestion[];
}

interface AIFormPreviewProps {
  form: AIForm;
  onBack: () => void;
  onCreate: (form: AIForm) => void;
}

export default function AIFormPreview({
  form,
  onBack,
  onCreate,
}: AIFormPreviewProps) {
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/40 p-6">
      <div className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">

        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold text-[#302733]">
              Review your form
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Review the questions before creating your form.
            </p>
          </div>

          <button
            onClick={onBack}
            className="flex h-9 w-9 items-center justify-center rounded-full text-xl text-gray-500 hover:bg-gray-100"
          >
            ×
          </button>
        </div>

        {/* FORM PREVIEW */}
        <div className="flex-1 overflow-y-auto bg-[#fafafa] p-8">
          <div className="mx-auto max-w-2xl">

            {/* FORM INTRO */}
            <div className="mb-6 rounded-2xl bg-white p-8 shadow-sm">
              <h1 className="text-2xl font-semibold text-[#302733]">
                {form.title}
              </h1>

              {form.description && (
                <p className="mt-3 text-sm leading-6 text-gray-500">
                  {form.description}
                </p>
              )}
            </div>

            {/* QUESTIONS */}
            <div className="space-y-4">
              {form.questions.map((question, index) => (
                <div
                  key={index}
                  className="rounded-2xl bg-white p-6 shadow-sm"
                >
                  <div className="mb-4">
                    <p className="text-base font-medium text-[#302733]">
                      {index + 1}. {question.title}

                      {question.required && (
                        <span className="ml-1 text-red-500">
                          *
                        </span>
                      )}
                    </p>

                    {question.description && (
                      <p className="mt-1 text-sm text-gray-500">
                        {question.description}
                      </p>
                    )}
                  </div>

                  <PreviewInput question={question} />
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* FOOTER */}
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-6 py-4">

          <button
            onClick={onBack}
            className="rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-medium text-[#302733] hover:bg-gray-50"
          >
            Back
          </button>

          <button
            onClick={() => onCreate(form)}
            className="rounded-xl bg-[#302733] px-6 py-2.5 text-sm font-semibold text-white hover:bg-black"
          >
            Create form
          </button>

        </div>
      </div>
    </div>
  );
}


// =========================================================
// PREVIEW INPUT
// =========================================================

function PreviewInput({
  question,
}: {
  question: AIQuestion;
}) {
  let settings: Record<string, any> = {};

  try {
    settings = JSON.parse(question.settings || "{}");
  } catch {
    settings = {};
  }

  switch (question.type) {

    case "long_text":
      return (
        <textarea
          disabled
          placeholder={
            settings.placeholder || "Write your answer..."
          }
          className="min-h-[110px] w-full resize-none rounded-xl border border-gray-300 bg-white p-4 text-sm"
        />
      );

    case "email":
      return (
        <input
          disabled
          type="email"
          placeholder={
            settings.placeholder || "name@example.com"
          }
          className="w-full rounded-xl border border-gray-300 bg-white p-4 text-sm"
        />
      );

    case "number":
      return (
        <input
          disabled
          type="number"
          placeholder={
            settings.placeholder || "Enter a number"
          }
          className="w-full rounded-xl border border-gray-300 bg-white p-4 text-sm"
        />
      );

    case "phone":
      return (
        <input
          disabled
          type="tel"
          placeholder={
            settings.placeholder || "Enter phone number"
          }
          className="w-full rounded-xl border border-gray-300 bg-white p-4 text-sm"
        />
      );

    case "date":
      return (
        <input
          disabled
          type="date"
          className="rounded-xl border border-gray-300 bg-white p-4 text-sm"
        />
      );

    case "multiple_choice":
    case "checkbox":
    case "dropdown":
      return (
        <div className="space-y-2">
          {(settings.options || [
            "Option 1",
            "Option 2",
            "Option 3",
          ]).map(
            (option: string, index: number) => (
              <label
                key={index}
                className="flex items-center gap-3 rounded-xl border border-gray-200 p-3"
              >
                <input
                  disabled
                  type={
                    question.type === "checkbox"
                      ? "checkbox"
                      : "radio"
                  }
                />

                <span className="text-sm text-gray-700">
                  {option}
                </span>
              </label>
            )
          )}
        </div>
      );

    case "yes_no":
      return (
        <div className="flex gap-3">
          <button
            disabled
            className="rounded-xl border border-gray-300 px-5 py-3 text-sm"
          >
            {settings.yes_label || "Yes"}
          </button>

          <button
            disabled
            className="rounded-xl border border-gray-300 px-5 py-3 text-sm"
          >
            {settings.no_label || "No"}
          </button>
        </div>
      );

    case "rating":
    case "opinion_scale":
      return (
        <div className="flex gap-2">
          {Array.from(
            {
              length: settings.scale || 5,
            },
            (_, index) => (
              <button
                key={index}
                disabled
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 text-sm"
              >
                {index + 1}
              </button>
            )
          )}
        </div>
      );

    case "nps":
      return (
        <div className="flex flex-wrap gap-2">
          {Array.from(
            {
              length: (settings.scale || 10) + 1,
            },
            (_, index) => (
              <button
                key={index}
                disabled
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 text-sm"
              >
                {index}
              </button>
            )
          )}
        </div>
      );

    default:
      return (
        <input
          disabled
          placeholder={
            settings.placeholder ||
            "Enter your answer..."
          }
          className="w-full rounded-xl border border-gray-300 bg-white p-4 text-sm"
        />
      );
  }
}
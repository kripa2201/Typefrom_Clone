"use client";

import {
  use,
  useEffect,
  useState,
} from "react";

import {
  getForm,
  getQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  reorderQuestions,
  publishForm,
  updateForm,
} from "@/lib/api";
import AddContentModal from "../components/AddContentModal";
import PreviewModal from "../components/PreviewModal";
import SettingsModal from "../components/SettingsModal";

// ======================================================
// TYPES
// ======================================================

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


// ======================================================
// QUESTION TYPES
// ======================================================

const questionTypes = [
  // Contact info
  {
    type: "email",
    title: "Email",
    category: "Contact info",
    icon: "✉",
    color: "bg-pink-100",
  },
  {
    type: "phone",
    title: "Phone Number",
    category: "Contact info",
    icon: "☎",
    color: "bg-pink-100",
  },
  {
    type: "address",
    title: "Address",
    category: "Contact info",
    icon: "⌖",
    color: "bg-pink-100",
  },
  {
    type: "website",
    title: "Website",
    category: "Contact info",
    icon: "↗",
    color: "bg-pink-100",
  },

  // Choice
  {
    type: "multiple_choice",
    title: "Multiple Choice",
    category: "Choice",
    icon: "A B",
    color: "bg-purple-100",
  },
  {
    type: "dropdown",
    title: "Dropdown",
    category: "Choice",
    icon: "⌄",
    color: "bg-purple-100",
  },
  {
    type: "picture_choice",
    title: "Picture Choice",
    category: "Choice",
    icon: "▧",
    color: "bg-purple-100",
  },
  {
    type: "yes_no",
    title: "Yes/No",
    category: "Choice",
    icon: "⊘",
    color: "bg-purple-100",
  },
  {
    type: "legal",
    title: "Legal",
    category: "Choice",
    icon: "⚖",
    color: "bg-purple-100",
  },
  {
    type: "checkbox",
    title: "Checkbox",
    category: "Choice",
    icon: "☑",
    color: "bg-purple-100",
  },

  // Rating
  {
    type: "nps",
    title: "Net Promoter Score®",
    category: "Rating & ranking",
    icon: "↗",
    color: "bg-green-100",
  },
  {
    type: "opinion_scale",
    title: "Opinion Scale",
    category: "Rating & ranking",
    icon: "▥",
    color: "bg-green-100",
  },
  {
    type: "rating",
    title: "Rating",
    category: "Rating & ranking",
    icon: "☆",
    color: "bg-green-100",
  },
  {
    type: "ranking",
    title: "Ranking",
    category: "Rating & ranking",
    icon: "1 2",
    color: "bg-green-100",
  },
  {
    type: "matrix",
    title: "Matrix",
    category: "Rating & ranking",
    icon: "☷",
    color: "bg-green-100",
  },

  // Text
  {
    type: "long_text",
    title: "Long Text",
    category: "Text & Video",
    icon: "☰",
    color: "bg-blue-100",
  },
  {
    type: "short_text",
    title: "Short Text",
    category: "Text & Video",
    icon: "—",
    color: "bg-blue-100",
  },
  {
    type: "video",
    title: "Video and Audio",
    category: "Text & Video",
    icon: "▶",
    color: "bg-blue-100",
    premium: true,
  },

  // Other
  {
    type: "number",
    title: "Number",
    category: "Other",
    icon: "#",
    color: "bg-yellow-100",
  },
  {
    type: "date",
    title: "Date",
    category: "Other",
    icon: "▣",
    color: "bg-yellow-100",
  },
  {
    type: "signature",
    title: "Signature",
    category: "Other",
    icon: "⌁",
    color: "bg-yellow-100",
    premium: true,
  },
  {
    type: "file_upload",
    title: "File Upload",
    category: "Other",
    icon: "↑",
    color: "bg-yellow-100",
    premium: true,
  },
  {
    type: "scheduler",
    title: "Scheduler",
    category: "Other",
    icon: "▣",
    color: "bg-yellow-100",
    premium: true,
  },

  // Special
  {
    type: "welcome_screen",
    title: "Welcome Screen",
    category: "Special",
    icon: "▣",
    color: "bg-gray-200",
  },
  {
    type: "statement",
    title: "Statement",
    category: "Special",
    icon: "❝",
    color: "bg-gray-200",
  },
  {
    type: "question_group",
    title: "Question Group",
    category: "Special",
    icon: "▤",
    color: "bg-gray-200",
  },
  {
    type: "end_screen",
    title: "End Screen",
    category: "Special",
    icon: "▣",
    color: "bg-gray-200",
  },
  {
    type: "redirect",
    title: "Redirect to URL",
    category: "Special",
    icon: "↪",
    color: "bg-gray-200",
  },
];


// ======================================================
// DEFAULT SETTINGS
// ======================================================

function getDefaultSettings(type: string) {
  if (
    type === "multiple_choice" ||
    type === "dropdown" ||
    type === "picture_choice"
  ) {
    return JSON.stringify({
      choices: ["choice"],
      multiple: false,
      randomize: false,
      other: false,
      none: false,
    });
  }

  if (type === "rating") {
    return JSON.stringify({
      scale: 5,
      icon: "star",
    });
  }

  if (type === "nps") {
    return JSON.stringify({
      scale: 10,
      leftLabel: "Not likely",
      rightLabel: "Extremely likely",
    });
  }

  if (type === "opinion_scale") {
    return JSON.stringify({
      scale: 10,
      leftLabel: "Disagree",
      rightLabel: "Agree",
    });
  }

  if (type === "ranking") {
    return JSON.stringify({
      choices: ["Option 1", "Option 2", "Option 3"],
    });
  }

  if (type === "matrix") {
    return JSON.stringify({
      rows: ["Row 1", "Row 2"],
      columns: ["Yes", "Maybe", "No"],
    });
  }

  if (
    type === "short_text" ||
    type === "long_text"
  ) {
    return JSON.stringify({
      placeholder: "Type your answer here...",
    });
  }

  if (type === "email") {
    return JSON.stringify({
      placeholder: "name@example.com",
    });
  }

  if (type === "phone") {
    return JSON.stringify({
      placeholder: "(201) 555-0123",
    });
  }

  if (type === "number") {
    return JSON.stringify({
      placeholder: "Type a number...",
    });
  }

  if (type === "website") {
    return JSON.stringify({
      placeholder: "https://example.com",
    });
  }

  if (type === "date") {
    return JSON.stringify({});
  }

  if (type === "yes_no") {
    return JSON.stringify({
      choices: ["Yes", "No"],
    });
  }

  if (type === "checkbox") {
    return JSON.stringify({
      choices: ["I agree"],
    });
  }

  if (type === "legal") {
    return JSON.stringify({
      text: "I agree to the terms and conditions.",
    });
  }

  return JSON.stringify({});
}

// ======================================================
// SAFE SETTINGS PARSER
// ======================================================

function parseSettings(
  settings?: string | null
) {
  if (!settings) {
    return {};
  }

  try {
    return JSON.parse(settings);
  } catch {
    return {};
  }
}


// ======================================================
// PAGE
// ======================================================

export default function Builder({
  params,
}: {
  params: Promise<{ formId: string }>;
}) {



  const { formId: formIdString } = use(params);

  const formId = Number(formIdString);


  // ----------------------------------------------------
  // STATE
  // ----------------------------------------------------

  const [form, setForm] =
    useState<Form | null>(null);

  const [questions, setQuestions] =
    useState<Question[]>([]);

  const [selectedQuestionId, setSelectedQuestionId] =
    useState<number | null>(null);

  const [loading, setLoading] =
    useState(true);
    
  const [mobileView, setMobileView] = useState(false);

  const [showAddModal, setShowAddModal] =
    useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showPreview, setShowPreview] =
  useState(false);

  const [saving, setSaving] =
    useState(false);

  const [message, setMessage] =
    useState("");
  const [showSettings, setShowSettings] = useState(false);


  // ----------------------------------------------------
  // SELECTED QUESTION
  // ----------------------------------------------------

  const selectedQuestion =
    questions.find(
      (question) =>
        question.id === selectedQuestionId
    );


  // ----------------------------------------------------
  // LOAD
  // ----------------------------------------------------

  async function loadBuilder() {
    try {
      setLoading(true);

      const formData =
        await getForm(formId);

      const questionData =
        await getQuestions(formId);

      setForm(formData);

      setQuestions(questionData);

      if (questionData.length > 0) {
        setSelectedQuestionId(
          questionData[0].id
        );
      }

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }
  }


  useEffect(() => {
    loadBuilder();
  }, [formId]);


  // ====================================================
  // LOCAL QUESTION UPDATE
  // ====================================================

  function updateLocalQuestion(
    changes: Partial<Question>
  ) {

    if (!selectedQuestion) {
      return;
    }

    setQuestions((previous) =>
      previous.map((question) =>
        question.id === selectedQuestion.id
          ? {
              ...question,
              ...changes,
            }
          : question
      )
    );
  }


  // ====================================================
  // SAVE QUESTION
  // ====================================================

  async function handleSaveQuestion() {

    if (!selectedQuestion) {
      return;
    }

    try {

      setSaving(true);

      await updateQuestion(
        selectedQuestion.id,
        {
          type: selectedQuestion.type,
          title: selectedQuestion.title,
          description:
            selectedQuestion.description || "",
          required:
            selectedQuestion.required,
          position:
            selectedQuestion.position,
          settings:
            selectedQuestion.settings || "{}",
        }
      );

      setMessage("Saved");

      setTimeout(() => {
        setMessage("");
      }, 1500);

    } catch (error) {

      console.error(error);

      setMessage("Failed to save");

    } finally {

      setSaving(false);

    }
  }


  // ====================================================
  // ADD QUESTION
  // ====================================================

  async function handleAddQuestion(
    type: string
  ) {

    try {

      const newQuestion =
        await createQuestion(
          formId,
          {
            type,
            title: "Your question here",
            description: "",
            required: false,
            position:
              questions.length + 1,
            settings:
              getDefaultSettings(type),
          }
        );

      setQuestions((previous) => [
        ...previous,
        newQuestion,
      ]);

      setSelectedQuestionId(
        newQuestion.id
      );

      setShowAddModal(false);

    } catch (error) {

      console.error(error);

      alert("Failed to add question");
    }
  }


  // ====================================================
  // DELETE QUESTION
  // ====================================================

  async function handleDeleteQuestion() {

    if (!selectedQuestion) {
      return;
    }

    const confirmed =
      window.confirm(
        "Delete this question?"
      );

    if (!confirmed) {
      return;
    }

    try {

      await deleteQuestion(
        selectedQuestion.id
      );

      const remaining =
        questions.filter(
          (question) =>
            question.id !==
            selectedQuestion.id
        );

      setQuestions(remaining);

      if (remaining.length > 0) {
        setSelectedQuestionId(
          remaining[0].id
        );
      } else {
        setSelectedQuestionId(null);
      }

    } catch (error) {

      console.error(error);

      alert(
        "Failed to delete question"
      );
    }
  }


  // ====================================================
  // MOVE QUESTION
  // ====================================================

  async function moveQuestion(
    direction: "up" | "down"
  ) {

    if (!selectedQuestion) {
      return;
    }

    const index =
      questions.findIndex(
        (question) =>
          question.id ===
          selectedQuestion.id
      );

    if (index === -1) {
      return;
    }

    const newIndex =
      direction === "up"
        ? index - 1
        : index + 1;

    if (
      newIndex < 0 ||
      newIndex >= questions.length
    ) {
      return;
    }

    const updated =
      [...questions];

    const temp =
      updated[index];

    updated[index] =
      updated[newIndex];

    updated[newIndex] =
      temp;

    const ids =
      updated.map(
        (question) =>
          question.id
      );

    try {

      const result =
        await reorderQuestions(
          formId,
          ids
        );

      setQuestions(result);

    } catch (error) {

      console.error(error);

      alert(
        "Failed to reorder questions"
      );
    }
  }


  // ====================================================
  // PUBLISH
  // ====================================================

  async function handlePublish() {

    try {

      const result =
        await publishForm(formId);

      setForm((previous) =>
        previous
          ? {
              ...previous,
              status:
                result.status,
              slug:
                result.slug,
            }
          : previous
      );

      alert(
  `Form published!\n\nPublic link:\n${window.location.origin}/forms/${result.slug}`
);

    } catch (error) {

      console.error(error);

      alert(
        "Failed to publish form"
      );
    }
  }


  // ====================================================
  // LOADING
  // ====================================================

  if (loading) {

    return (
      <div className="flex h-screen items-center justify-center bg-[#f7f7f8]">
        <p className="text-sm text-gray-500">
          Loading builder...
        </p>
      </div>
    );
  }



  // ====================================================
  // NOT FOUND
  // ====================================================

  if (!form) {

    return (
      <div className="flex h-screen items-center justify-center">
        <p>Form not found.</p>
      </div>
    );
  }


  // ====================================================
  // SETTINGS
  // ====================================================

  const settings =
    selectedQuestion
      ? parseSettings(
          selectedQuestion.settings
        )
      : {};


  // ====================================================
  // UPDATE CHOICES
  // ====================================================

  function updateChoices(
    choices: string[]
  ) {

    if (!selectedQuestion) {
      return;
    }

    const current =
      parseSettings(
        selectedQuestion.settings
      );

    updateLocalQuestion({
      settings: JSON.stringify({
        ...current,
        choices,
      }),
    });
  }


  // ====================================================
  // RENDER
  // ====================================================

  return (
    <div className="h-screen overflow-hidden bg-white text-[#2f2633]">

      {/* ==================================================
          TOP HEADER
      ================================================== */}

      <header className="h-[58px] border-b border-[#e8e5e8] flex items-center justify-between px-5">

        <div className="flex items-center gap-3">

          <button
            onClick={() =>
              window.history.back()
            }
            className="text-xl"
          >
            ←
          </button>

          <span className="text-sm text-gray-500">
            Forms
          </span>

          <span className="text-gray-300">
            ›
          </span>

          <span className="text-sm font-medium">
            {form.title}
          </span>

        </div>


        <div className="flex items-center gap-3">

<button
  onClick={() => {
    if (!form?.slug) {
      alert("Please publish the form first.");
      return;
    }

    setShowShareModal(true);
  }}
  className="rounded-xl border border-gray-300 px-5 py-2 text-sm hover:bg-gray-50"
>
  Share
</button>

         <button
  onClick={handlePublish}
  className="rounded-xl bg-[#2f2633] px-5 py-2 text-sm font-medium text-white hover:bg-black"
>
  {form.status === "published" ? "Unpublish" : "Publish"}
</button>

          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f8c9d5] text-xs">
            KK
          </div>

        </div>

      </header>


      {/* ==================================================
          TOOLBAR
      ================================================== */}

      <div className="h-[64px] border-b border-[#e8e5e8] flex items-center px-5 gap-5">

        <button
          onClick={() =>
            setShowAddModal(true)
          }
          className="rounded-xl bg-[#302733] px-5 py-3 text-sm font-semibold text-white"
        >
          + Add content
        </button>


        <button className="text-sm">
          ◉ Design
        </button>

        <span className="text-gray-300">
          |
        </span>

        {/* View Toggle */}
        <button
          onClick={() => setMobileView((previous) => !previous)}
          className={`relative text-2xl transition-colors ${
            mobileView
              ? "text-[#302733]"
              : "text-gray-600"
          } hover:text-[#302733]`}
          title={mobileView ? "Desktop view" : "Mobile view"}
        >
          {mobileView ? "▱" : "▯"}
        </button>

        <button className="text-lg"  onClick={() => setShowPreview(true)}>
          ▷
        </button>


        <button
          onClick={() => setShowSettings(true)}
          className="text-2xl text-gray-600 hover:text-[#302733]"
          title="Settings"
        >
          ⚙
        </button>
      </div>


      {/* ==================================================
          MAIN LAYOUT
      ================================================== */}

      <div className="flex h-[calc(100vh-122px)]">


        {/* ==================================================
            LEFT SIDEBAR
        ================================================== */}

        <aside className="w-[225px] shrink-0 border-r border-[#e8e5e8] bg-[#fafafa] p-4 overflow-y-auto">

          <button className="mb-5 flex w-full items-center justify-between rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm">

            <span>
              ▱ Universal mode
            </span>

            <span>
             ⌄
            </span>

          </button>


          <p className="mb-3 text-sm font-medium">
            Pages
          </p>


          {/* FORM START */}

          <div className="mb-3 rounded-xl bg-white px-4 py-4 shadow-sm">

            <div className="flex items-center gap-3">

              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-100 text-xs">
                ▣
              </span>

              <span className="text-sm font-medium">
                {form.title}
              </span>

            </div>

          </div>


          {/* QUESTIONS */}

          <div className="space-y-2">

            {questions.map(
              (question, index) => {

                const active =
                  question.id ===
                  selectedQuestionId;

                return (

                  <button
                    key={question.id}
                    onClick={() =>
                      setSelectedQuestionId(
                        question.id
                      )
                    }
                    className={`w-full rounded-xl border p-3 text-left transition ${
                      active
                        ? "border-[#3c3140] bg-white shadow-sm"
                        : "border-transparent hover:bg-white"
                    }`}
                  >

                    <div className="flex items-center gap-3">

                      <span
                        className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs ${
                          question.type ===
                          "rating"
                            ? "bg-green-100"
                            : question.type ===
                              "email"
                            ? "bg-pink-100"
                            : question.type ===
                              "multiple_choice"
                            ? "bg-purple-100"
                            : "bg-blue-100"
                        }`}
                      >
                        {index + 1}
                      </span>


                      <div className="min-w-0">

                        <p className="truncate text-sm">
                          {question.title}
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          {question.type}
                        </p>

                      </div>

                    </div>

                  </button>
                );
              }
            )}

          </div>


          {/* ADD CONTENT */}

          <button
            onClick={() =>
              setShowAddModal(true)
            }
            className="mt-3 w-full rounded-xl border border-dashed border-gray-400 py-3 text-sm hover:bg-white"
          >
            + Add content
          </button>


          {/* ENDINGS */}

          <div className="mt-5 rounded-xl border border-gray-200 bg-white p-4">

            <div className="flex items-center justify-between">

              <span className="text-sm">
                Endings
              </span>

              <button className="flex h-7 w-7 items-center justify-center rounded-lg border">
                +
              </button>

            </div>

          </div>

        </aside>


        {/* ==================================================
            CENTER
        ================================================== */}

        <main className="flex-1 overflow-y-auto bg-white">

          <div className="flex min-h-full justify-center px-8 py-8">

            <div
              className={`transition-all duration-300 ${
                mobileView
                  ? "w-[390px] max-w-[390px]"
                  : "w-full max-w-[900px]"
              }`}
            >

              <p className="mb-5 text-center text-xs text-gray-500">
                Question Editor
              </p>


              {selectedQuestion ? (

                <div className="rounded-2xl border border-gray-200 bg-white p-10 shadow-sm">


                  {/* QUESTION */}

                  <div className="flex items-start gap-3">

                    <span className="mt-1 flex h-6 w-6 items-center justify-center rounded bg-[#302733] text-xs text-white">
                      {
                        questions.findIndex(
                          (q) =>
                            q.id ===
                            selectedQuestion.id
                        ) + 1
                      }
                    </span>


                    <div className="flex-1">

                      <input
                        value={
                          selectedQuestion.title
                        }
                        onChange={(event) =>
                          updateLocalQuestion({
                            title:
                              event.target.value,
                          })
                        }
                        className="w-full border-none bg-transparent text-2xl italic outline-none"
                        placeholder="Your question here"
                      />


                      <textarea
                        value={
                          selectedQuestion.description ||
                          ""
                        }
                        onChange={(event) =>
                          updateLocalQuestion({
                            description:
                              event.target.value,
                          })
                        }
                        className="mt-2 w-full resize-none border-none bg-transparent text-sm italic text-gray-400 outline-none"
                        placeholder="Description (optional)"
                      />


                      {/* QUESTION PREVIEW */}

                      <div className="mt-8">

                        {selectedQuestion.type ===
                          "multiple_choice" && (

                          <div className="space-y-3">

                            {(
                              settings.choices ||
                              ["choice"]
                            ).map(
                              (
                                choice: string,
                                index: number
                              ) => (

                                <div
                                  key={index}
                                  className="flex max-w-[500px] items-center gap-3 rounded-lg border border-gray-300 px-3 py-2"
                                >

                                  <span className="flex h-6 w-6 items-center justify-center rounded border text-xs">
                                    {String.fromCharCode(
                                      65 + index
                                    )}
                                  </span>

                                  <span className="text-sm">
                                    {choice}
                                  </span>

                                </div>
                              )
                            )}

                            <button
                              onClick={() =>
                                updateChoices([
                                  ...(settings.choices ||
                                    ["choice"]),
                                  "new choice",
                                ])
                              }
                              className="text-sm underline"
                            >
                              + Add choice
                            </button>

                          </div>

                        )}


                        {selectedQuestion.type ===
                          "rating" && (

                          <div className="flex gap-5">

                            {Array.from({
                              length:
                                settings.scale ||
                                5,
                            }).map(
                              (_, index) => (

                                <div
                                  key={index}
                                  className="text-center"
                                >

                                  <div className="text-4xl text-gray-500">
                                    ☆
                                  </div>

                                  <div className="text-xs">
                                    {index + 1}
                                  </div>

                                </div>

                              )
                            )}

                          </div>

                        )}


                        {selectedQuestion.type ===
                          "yes_no" && (

                          <div className="flex gap-3">

                            <button className="rounded-lg border px-5 py-3">
                              Yes
                            </button>

                            <button className="rounded-lg border px-5 py-3">
                              No
                            </button>

                          </div>

                        )}


                        {selectedQuestion.type !==
                          "multiple_choice" &&
                          selectedQuestion.type !==
                            "rating" &&
                          selectedQuestion.type !==
                            "yes_no" && (

                          <input
                            disabled
                            placeholder={
                              settings.placeholder ||
                              "Type your answer here..."
                            }
                            className="w-full max-w-[650px] border-b border-gray-400 bg-transparent py-4 text-xl outline-none"
                          />

                        )}

                      </div>

                    </div>

                  </div>


                  {/* DELETE / MOVE */}

                  <div className="mt-10 flex items-center gap-3 border-t pt-5">

                    <button
                      onClick={() =>
                        moveQuestion("up")
                      }
                      className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50"
                    >
                      ↑ Move up
                    </button>

                    <button
                      onClick={() =>
                        moveQuestion("down")
                      }
                      className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50"
                    >
                      ↓ Move down
                    </button>

                    <button
                      onClick={
                        handleDeleteQuestion
                      }
                      className="ml-auto rounded-lg border border-red-300 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      Delete
                    </button>

                  </div>

                </div>

              ) : (

                <div className="flex min-h-[500px] items-center justify-center rounded-2xl border border-dashed">

                  <button
                    onClick={() =>
                      setShowAddModal(true)
                    }
                    className="rounded-xl bg-[#302733] px-6 py-3 text-white"
                  >
                    + Add your first question
                  </button>

                </div>

              )}

            </div>

          </div>

        </main>


        {/* ==================================================
            RIGHT SIDEBAR
        ================================================== */}

        <aside className="w-[290px] shrink-0 overflow-y-auto border-l border-[#e8e5e8] bg-[#fafafa] p-4">

          {selectedQuestion && (

            <>

              <div className="rounded-2xl bg-white p-5 shadow-sm">

                <p className="mb-4 text-sm font-semibold">
                  Question
                </p>


                {/* TEXT / VIDEO */}

                <div className="mb-5 flex rounded-xl bg-gray-100 p-1">

                  <button className="flex-1 rounded-lg bg-white py-2 text-sm shadow-sm">
                    ─ Text
                  </button>

                  <button className="flex-1 py-2 text-sm text-gray-500">
                    ▣ Video
                  </button>

                </div>


                <p className="mb-2 text-sm">
                  Answer
                </p>


                <select
                  value={
                    selectedQuestion.type
                  }
                  onChange={(event) =>
                    updateLocalQuestion({
                      type:
                        event.target.value,
                      settings:
                        getDefaultSettings(
                          event.target.value
                        ),
                    })
                  }
                  className="w-full rounded-xl border border-gray-300 bg-white px-3 py-3 text-sm outline-none"
                >

                  {questionTypes.map(
                    (item) => (

                      <option
                        key={item.type}
                        value={item.type}
                      >
                        {item.title}
                      </option>

                    )
                  )}

                </select>


                {/* REQUIRED */}

                <div className="mt-5 flex items-center justify-between border-t pt-4">

                  <span className="text-sm">
                    Required
                  </span>

                  <button
                    onClick={() =>
                      updateLocalQuestion({
                        required:
                          !selectedQuestion.required,
                      })
                    }
                    className={`relative h-6 w-11 rounded-full transition ${
                      selectedQuestion.required
                        ? "bg-[#302733]"
                        : "bg-gray-200"
                    }`}
                  >

                    <span
                      className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                        selectedQuestion.required
                          ? "left-6"
                          : "left-1"
                      }`}
                    />

                  </button>

                </div>


                {/* MULTIPLE CHOICE SETTINGS */}

                {selectedQuestion.type ===
                  "multiple_choice" && (

                  <div className="mt-5 border-t pt-5">

                    <p className="mb-3 text-sm font-semibold">
                      Choices
                    </p>


                    {(
                      settings.choices ||
                      ["choice"]
                    ).map(
                      (
                        choice: string,
                        index: number
                      ) => (

                        <div
                          key={index}
                          className="mb-2 flex items-center gap-2"
                        >

                          <span className="flex h-7 w-7 items-center justify-center rounded bg-purple-100 text-xs">
                            {String.fromCharCode(
                              65 + index
                            )}
                          </span>


                          <input
                            value={choice}
                            onChange={(event) => {

                              const choices =
                                [
                                  ...(settings.choices ||
                                    ["choice"]),
                                ];

                              choices[index] =
                                event.target.value;

                              updateChoices(
                                choices
                              );
                            }}
                            className="min-w-0 flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none"
                          />


                          {(
                            settings.choices ||
                            ["choice"]
                          ).length > 1 && (

                            <button
                              onClick={() => {

                                const choices =
                                  [
                                    ...(settings.choices ||
                                      []),
                                  ];

                                choices.splice(
                                  index,
                                  1
                                );

                                updateChoices(
                                  choices
                                );

                              }}
                              className="text-gray-400 hover:text-red-500"
                            >
                              ×
                            </button>

                          )}

                        </div>

                      )
                    )}


                    <button
                      onClick={() =>
                        updateChoices([
                          ...(settings.choices ||
                            []),
                          "choice",
                        ])
                      }
                      className="mt-2 text-sm underline"
                    >
                      + Add choice
                    </button>


                    <SettingToggle
                      label="Multiple selection"
                      checked={
                        settings.multiple ||
                        false
                      }
                      onChange={(value) =>
                        updateLocalQuestion({
                          settings:
                            JSON.stringify({
                              ...settings,
                              multiple:
                                value,
                            }),
                        })
                      }
                    />


                    <SettingToggle
                      label="Randomize"
                      checked={
                        settings.randomize ||
                        false
                      }
                      onChange={(value) =>
                        updateLocalQuestion({
                          settings:
                            JSON.stringify({
                              ...settings,
                              randomize:
                                value,
                            }),
                        })
                      }
                    />


                    <SettingToggle
                      label='"Other" option'
                      checked={
                        settings.other ||
                        false
                      }
                      onChange={(value) =>
                        updateLocalQuestion({
                          settings:
                            JSON.stringify({
                              ...settings,
                              other:
                                value,
                            }),
                        })
                      }
                    />


                    <SettingToggle
                      label='"None" option'
                      checked={
                        settings.none ||
                        false
                      }
                      onChange={(value) =>
                        updateLocalQuestion({
                          settings:
                            JSON.stringify({
                              ...settings,
                              none:
                                value,
                            }),
                        })
                      }
                    />

                  </div>

                )}


                {/* RATING SETTINGS */}

                {selectedQuestion.type ===
                  "rating" && (

                  <div className="mt-5 border-t pt-5">

                    <p className="mb-2 text-sm">
                      Rating scale
                    </p>

                    <select
                      value={
                        settings.scale ||
                        5
                      }
                      onChange={(event) =>
                        updateLocalQuestion({
                          settings:
                            JSON.stringify({
                              ...settings,
                              scale:
                                Number(
                                  event.target.value
                                ),
                            }),
                        })
                      }
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2"
                    >

                      <option value="3">
                        3
                      </option>

                      <option value="5">
                        5
                      </option>

                      <option value="7">
                        7
                      </option>

                      <option value="10">
                        10
                      </option>

                    </select>

                  </div>

                )}


                {/* SAVE */}

                <button
                  onClick={
                    handleSaveQuestion
                  }
                  disabled={saving}
                  className="mt-6 w-full rounded-xl bg-[#302733] py-3 text-sm font-semibold text-white disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : "Save changes"}
                </button>


                {message && (

                  <p className="mt-3 text-center text-xs text-gray-500">
                    {message}
                  </p>

                )}

              </div>


              {/* IMAGE */}

              <div className="mt-3 rounded-2xl bg-white p-5">

                <div className="flex items-center justify-between">

                  <span className="text-sm">
                    Image or video
                  </span>

                  <button className="flex h-8 w-8 items-center justify-center rounded-lg border">
                    +
                  </button>

                </div>

              </div>


              {/* LOGIC */}

              <div className="mt-3 rounded-2xl bg-white p-5">

                <div className="flex items-center justify-between">

                  <span className="text-sm">
                    Logic
                  </span>

                  <button className="flex h-8 w-8 items-center justify-center rounded-lg border">
                    +
                  </button>

                </div>

              </div>


              {/* COMMENTS */}

              <div className="mt-3 rounded-2xl bg-white p-5">

                <span className="text-sm">
                  Comments
                </span>

              </div>

            </>

          )}

        </aside>

      </div>

 {/* ADD CONTENT MODAL */}
      {showAddModal && (
        <AddContentModal
          onClose={() => setShowAddModal(false)}
          onAddQuestion={handleAddQuestion}
        />
      )}
      {showShareModal && (
  <div
    className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 p-6"
    onClick={() => setShowShareModal(false)}
  >
    <div
      className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
      onClick={(event) => event.stopPropagation()}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[#302733]">
          Share your form
        </h2>

        <button
          onClick={() => setShowShareModal(false)}
          className="text-xl text-gray-400 hover:text-gray-700"
        >
          ×
        </button>
      </div>

      <p className="mt-2 text-sm text-gray-500">
        Share this link with people to collect responses.
      </p>

      <div className="mt-5 flex gap-2">
        <input
          readOnly
          value={
            form?.slug
              ? `${window.location.origin}/forms/${form.slug}`
              : ""
          }
          className="min-w-0 flex-1 rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm outline-none"
        />

        <button
          onClick={() => {
            if (!form?.slug) return;

            const url =
              `${window.location.origin}/forms/${form.slug}`;

            navigator.clipboard.writeText(url);

            setShowShareModal(false);
          }}
          className="rounded-xl bg-[#302733] px-4 py-3 text-sm font-medium text-white hover:bg-black"
        >
          Copy
        </button>
      </div>
    </div>
  </div>
)}

{showPreview && form && (
  <PreviewModal
    form={form}
    questions={questions}
    onClose={() => setShowPreview(false)}
  />
)}
{showSettings && (
  <SettingsModal
    title={form.title}
    description={form.description || ""}
    onClose={() => setShowSettings(false)}
    onSave={async (title, description) => {

  try {
    const updatedForm = await updateForm(formId, {
      title,
      description,
    });


    setForm(updatedForm);
    setShowSettings(false);
  } catch (error) {
  }
}}
  />
)}
 

    </div>
  );
}


// ======================================================
// TOGGLE COMPONENT
// ======================================================

function SettingToggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
})



{

  return (

    <div className="mt-5 flex items-center justify-between">

      <span className="text-sm">
        {label}
      </span>

      <button
        onClick={() =>
          onChange(!checked)
        }
        className={`relative h-6 w-11 rounded-full transition ${
          checked
            ? "bg-[#302733]"
            : "bg-gray-200"
        }`}
      >

        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
            checked
              ? "left-6"
              : "left-1"
          }`}
        />

      </button>

    </div>
  );
}
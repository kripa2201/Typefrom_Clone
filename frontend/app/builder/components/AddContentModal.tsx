"use client";

import { useEffect, useMemo, useState } from "react";
import AIFormModal from "./AIFormModal";
interface AddContentModalProps {
  onClose: () => void;
  onAddQuestion: (type: string) => void;
}

interface ElementItem {
  type: string;
  title: string;
  icon: string;
  color: string;
  category: string;
  premium?: boolean;
}

interface ModalElementProps {
  item: ElementItem;
  onClick?: () => void;
}

const ELEMENTS: ElementItem[] = [
  // Recommended
  {
    type: "short_text",
    title: "Short Text",
    icon: "T",
    color: "bg-[#e7f0ff]",
    category: "Recommended",
  },
  {
    type: "multiple_choice",
    title: "Multiple Choice",
    icon: "A B",
    color: "bg-[#eee8ff]",
    category: "Recommended",
  },
  {
    type: "email",
    title: "Email",
    icon: "✉",
    color: "bg-[#ffe8ef]",
    category: "Recommended",
  },

  // Contact info
  {
    type: "email",
    title: "Email",
    icon: "✉",
    color: "bg-[#ffe8ef]",
    category: "Contact info",
  },
  {
    type: "phone",
    title: "Phone Number",
    icon: "☎",
    color: "bg-[#ffe8ef]",
    category: "Contact info",
  },
  {
    type: "address",
    title: "Address",
    icon: "⌖",
    color: "bg-[#ffe8ef]",
    category: "Contact info",
  },
  {
    type: "website",
    title: "Website",
    icon: "↗",
    color: "bg-[#ffe8ef]",
    category: "Contact info",
  },

  // Choice
  {
    type: "multiple_choice",
    title: "Multiple Choice",
    icon: "A B",
    color: "bg-[#eee8ff]",
    category: "Choice",
  },
  {
    type: "dropdown",
    title: "Dropdown",
    icon: "⌄",
    color: "bg-[#eee8ff]",
    category: "Choice",
  },
  {
    type: "picture_choice",
    title: "Picture Choice",
    icon: "▧",
    color: "bg-[#eee8ff]",
    category: "Choice",
  },
  {
    type: "yes_no",
    title: "Yes/No",
    icon: "✓",
    color: "bg-[#eee8ff]",
    category: "Choice",
  },
  {
    type: "legal",
    title: "Legal",
    icon: "⚖",
    color: "bg-[#eee8ff]",
    category: "Choice",
  },
  {
    type: "checkbox",
    title: "Checkbox",
    icon: "☑",
    color: "bg-[#eee8ff]",
    category: "Choice",
  },

  // Rating
  {
    type: "nps",
    title: "Net Promoter Score®",
    icon: "↗",
    color: "bg-[#e4f7ed]",
    category: "Rating & ranking",
  },
  {
    type: "opinion_scale",
    title: "Opinion Scale",
    icon: "▥",
    color: "bg-[#e4f7ed]",
    category: "Rating & ranking",
  },
  {
    type: "rating",
    title: "Rating",
    icon: "☆",
    color: "bg-[#e4f7ed]",
    category: "Rating & ranking",
  },
  {
    type: "ranking",
    title: "Ranking",
    icon: "1 2",
    color: "bg-[#e4f7ed]",
    category: "Rating & ranking",
  },
  {
    type: "matrix",
    title: "Matrix",
    icon: "☷",
    color: "bg-[#e4f7ed]",
    category: "Rating & ranking",
  },

  // Text & Video
  {
    type: "long_text",
    title: "Long Text",
    icon: "≡",
    color: "bg-[#e7f0ff]",
    category: "Text & Video",
  },
  {
    type: "short_text",
    title: "Short Text",
    icon: "T",
    color: "bg-[#e7f0ff]",
    category: "Text & Video",
  },
  {
    type: "video",
    title: "Video and Audio",
    icon: "▶",
    color: "bg-[#e7f0ff]",
    category: "Text & Video",
    premium: true,
  },
  {
    type: "clarify_ai",
    title: "Clarify with AI",
    icon: "✦",
    color: "bg-[#e7f0ff]",
    category: "Text & Video",
    premium: true,
  },
  {
    type: "faq_ai",
    title: "FAQ with AI",
    icon: "✦",
    color: "bg-[#e7f0ff]",
    category: "Text & Video",
    premium: true,
  },

  // Other
  {
    type: "number",
    title: "Number",
    icon: "#",
    color: "bg-[#fff3cf]",
    category: "Other",
  },
  {
    type: "date",
    title: "Date",
    icon: "▣",
    color: "bg-[#fff3cf]",
    category: "Other",
  },
  {
    type: "signature",
    title: "Signature",
    icon: "⌁",
    color: "bg-[#fff3cf]",
    category: "Other",
    premium: true,
  },
  {
    type: "payment",
    title: "Payment",
    icon: "$",
    color: "bg-[#fff3cf]",
    category: "Other",
    premium: true,
  },
  {
    type: "file_upload",
    title: "File Upload",
    icon: "↑",
    color: "bg-[#fff3cf]",
    category: "Other",
    premium: true,
  },
  {
    type: "scheduler",
    title: "Scheduler",
    icon: "▣",
    color: "bg-[#fff3cf]",
    category: "Other",
    premium: true,
  },

  // Special
  {
    type: "welcome_screen",
    title: "Welcome Screen",
    icon: "▣",
    color: "bg-[#eeeeee]",
    category: "Special",
  },
  {
    type: "statement",
    title: "Statement",
    icon: "❝",
    color: "bg-[#eeeeee]",
    category: "Special",
  },
  {
    type: "question_group",
    title: "Question Group",
    icon: "▤",
    color: "bg-[#eeeeee]",
    category: "Special",
  },
  {
    type: "end_screen",
    title: "End Screen",
    icon: "▣",
    color: "bg-[#eeeeee]",
    category: "Special",
  },
  {
    type: "redirect",
    title: "Redirect to URL",
    icon: "↪",
    color: "bg-[#eeeeee]",
    category: "Special",
    premium: true,
  },
];

function ModalSectionTitle({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <h3 className="mb-3 text-[13px] font-semibold tracking-wide text-[#625a63]">
      {children}
    </h3>
  );
}

function ModalElement({
  item,
  onClick,
}: ModalElementProps) {
  const disabled = !onClick;

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`group flex w-full items-center gap-3 rounded-[10px] px-2 py-[7px] text-left transition-all duration-150 ${
        disabled
          ? "cursor-default"
          : "cursor-pointer hover:bg-[#f6f5f6]"
      }`}
    >
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[9px] text-[11px] font-semibold text-[#443a46] ${item.color}`}
      >
        {item.icon}
      </span>

      <span
        className={`text-[13px] ${
          disabled
            ? "text-[#aaa5aa]"
            : "text-[#494249] group-hover:text-[#211c22]"
        }`}
      >
        {item.title}
      </span>

      {item.premium && (
        <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full border border-[#d8eadf] px-1 text-[9px] font-medium text-[#5e9b76]">
          ◇
        </span>
      )}
    </button>
  );
}

export default function AddContentModal({
  onClose,
  onAddQuestion,
}: AddContentModalProps) {
  const [search, setSearch] = useState("");
  const [showAIModal, setShowAIModal] = useState(false);
  const [activeTab, setActiveTab] =
    useState<"elements" | "import" | "ai">(
      "elements"
    );

  const [closing, setClosing] =
    useState(false);

  // --------------------------------------------------
  // CLOSE ANIMATION
  // --------------------------------------------------

  function closeModal() {
    setClosing(true);

    setTimeout(() => {
      onClose();
    }, 160);
  }

  // --------------------------------------------------
  // ESCAPE KEY
  // --------------------------------------------------

  useEffect(() => {
    function handleKeyDown(
      event: KeyboardEvent
    ) {
      if (event.key === "Escape") {
        closeModal();
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, []);

  // --------------------------------------------------
  // SEARCH
  // --------------------------------------------------

  const filteredElements = useMemo(() => {
    const value =
      search.trim().toLowerCase();

    if (!value) {
      return ELEMENTS;
    }

    return ELEMENTS.filter((element) =>
      element.title
        .toLowerCase()
        .includes(value)
    );
  }, [search]);

  function getElements(
    category: string
  ) {
    return filteredElements.filter(
      (element) =>
        element.category === category
    );
  }

  // --------------------------------------------------
  // ADD
  // --------------------------------------------------

  function handleElementClick(
    item: ElementItem
  ) {
    if (item.premium) {
      return;
    }

    onAddQuestion(item.type);
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-[2px] transition-opacity duration-150 ${
        closing
          ? "opacity-0"
          : "animate-[fadeIn_150ms_ease-out]"
      }`}
      onClick={closeModal}
    >
      <div
        className={`flex max-h-[90vh] w-[1080px] max-w-full flex-col overflow-hidden rounded-[20px] bg-white shadow-[0_24px_80px_rgba(0,0,0,0.18)] transition-all duration-150 ${
          closing
            ? "scale-[0.98] opacity-0"
            : "scale-100 opacity-100"
        }`}
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        {/* =================================================
            HEADER
        ================================================= */}

        <div className="shrink-0 border-b border-[#ebe9eb] px-8">

          <div className="flex h-[68px] items-center">

            <div className="flex h-full items-center gap-8">

              <button
                type="button"
                onClick={() =>
                  setActiveTab("elements")
                }
                className={`relative h-full text-[13px] font-medium ${
                  activeTab === "elements"
                    ? "text-[#302733]"
                    : "text-[#8b858b]"
                }`}
              >
                Add form elements

                {activeTab ===
                  "elements" && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full bg-[#302733]" />
                )}
              </button>

              <button
                type="button"
                onClick={() =>
                  setActiveTab("import")
                }
                className={`relative h-full text-[13px] font-medium ${
                  activeTab === "import"
                    ? "text-[#302733]"
                    : "text-[#8b858b]"
                }`}
              >
                Import questions

                {activeTab ===
                  "import" && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full bg-[#302733]" />
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                    setActiveTab("ai");
                    setShowAIModal(true);
}}
                className={`relative h-full text-[13px] font-medium ${
                  activeTab === "ai"
                    ? "text-[#302733]"
                    : "text-[#8b858b]"
                }`}
              >
                Create with AI

                {activeTab === "ai" && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full bg-[#302733]" />
                )}
              </button>

            </div>

            <button
              type="button"
              onClick={closeModal}
              className="ml-auto flex h-9 w-9 items-center justify-center rounded-full text-xl text-[#777177] transition hover:bg-[#f2f1f2] hover:text-[#302733]"
            >
              ×
            </button>

          </div>

        </div>


        {/* =================================================
            CONTENT
        ================================================= */}

        <div className="min-h-0 flex-1 overflow-y-auto">

          {/* -----------------------------------------------
              IMPORT
          ----------------------------------------------- */}

          {activeTab === "import" && (
            <div className="flex min-h-[580px] items-center justify-center px-8">

              <div className="max-w-[420px] text-center">

                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f0edf2] text-2xl">
                  ↑
                </div>

                <h2 className="text-xl font-semibold text-[#302733]">
                  Import questions
                </h2>

                <p className="mt-2 text-sm leading-6 text-[#817981]">
                  Import questions from another form
                  or supported source.
                </p>

                <button
                  type="button"
                  className="mt-6 rounded-xl bg-[#302733] px-5 py-3 text-sm font-medium text-white"
                >
                  Choose file
                </button>

              </div>

            </div>
          )}


          {/* -----------------------------------------------
              AI
          ----------------------------------------------- */}

          {activeTab === "ai" && (
            <div className="flex min-h-[580px] items-center justify-center px-8">

              <div className="max-w-[460px] text-center">

                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#eee8ff] text-2xl">
                  ✦
                </div>

                <h2 className="text-xl font-semibold text-[#302733]">
                  Create with AI
                </h2>

                <p className="mt-2 text-sm leading-6 text-[#817981]">
                  Describe the form you want to
                  create and generate questions.
                </p>

                <div className="mt-6 rounded-xl border border-[#ddd9de] p-3 text-left">
                  <textarea
                    placeholder="Describe your form..."
                    className="h-24 w-full resize-none border-none text-sm outline-none"
                  />
                </div>

                <button
                  type="button"
                  className="mt-4 rounded-xl bg-[#302733] px-5 py-3 text-sm font-medium text-white"
                >
                  Generate form
                </button>

              </div>

            </div>
          )}


          {/* -----------------------------------------------
              ELEMENTS
          ----------------------------------------------- */}

          {activeTab === "elements" && (
            <div className="px-8 py-7">

              {/* SEARCH */}

              <div className="mb-8">

                <div className="relative max-w-[300px]">

                  <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[17px] text-[#817981]">
                    ⌕
                  </span>

                  <input
                    autoFocus
                    value={search}
                    onChange={(event) =>
                      setSearch(
                        event.target.value
                      )
                    }
                    placeholder="Search form elements"
                    className="h-11 w-full rounded-[10px] border border-[#d9d5d9] bg-white pl-10 pr-4 text-[13px] text-[#302733] outline-none transition focus:border-[#817981] focus:ring-2 focus:ring-[#302733]/5"
                  />

                </div>

              </div>


              {/* SEARCH RESULTS */}

              {search.trim() ? (
                <div>

                  <p className="mb-4 text-[13px] font-semibold text-[#625a63]">
                    Search results
                  </p>

                  {filteredElements.length ===
                  0 ? (
                    <div className="py-20 text-center text-sm text-[#8b858b]">
                      No form elements found.
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-x-12">

                      {filteredElements.map(
                        (item, index) => (
                          <ModalElement
                            key={`${item.type}-${index}`}
                            item={item}
                            onClick={
                              item.premium
                                ? undefined
                                : () =>
                                    handleElementClick(
                                      item
                                    )
                            }
                          />
                        )
                      )}

                    </div>
                  )}

                </div>
              ) : (

                <>
                  {/* =================================================
                      THREE COLUMNS
                  ================================================= */}

                  <div className="grid grid-cols-3 gap-x-12">

                    {/* COLUMN 1 */}

                    <div>

                      <ModalSectionTitle>
                        Recommended
                      </ModalSectionTitle>

                      {getElements(
                        "Recommended"
                      ).map((item, index) => (
                        <ModalElement
                          key={`${item.type}-${index}`}
                          item={item}
                          onClick={
                            item.premium
                              ? undefined
                              : () =>
                                  handleElementClick(
                                    item
                                  )
                          }
                        />
                      ))}


                      <ModalSectionTitle>
                        Connect to apps
                      </ModalSectionTitle>

                      <button
                        type="button"
                        className="mb-2 flex w-full items-center gap-3 rounded-[10px] px-2 py-[7px] text-left hover:bg-[#f6f5f6]"
                      >
                        <span className="flex h-9 w-9 items-center justify-center rounded-[9px] bg-[#fff0e3] text-sm text-[#ef8b32]">
                          ⬡
                        </span>

                        <span className="text-[13px] text-[#494249]">
                          HubSpot
                        </span>
                      </button>

                      <button
                        type="button"
                        className="mb-2 flex w-full items-center gap-3 rounded-[10px] px-2 py-[7px] text-left hover:bg-[#f6f5f6]"
                      >
                        <span className="flex h-9 w-9 items-center justify-center rounded-[9px] bg-[#e8f0ff] text-sm text-[#4e7cd8]">
                          ☁
                        </span>

                        <span className="text-[13px] text-[#494249]">
                          Salesforce
                        </span>

                        <span className="ml-auto text-[10px] text-[#62a17b]">
                          ◇
                        </span>
                      </button>

                      <button
                        type="button"
                        className="mt-1 flex w-full items-center gap-3 rounded-[10px] px-2 py-[7px] text-left hover:bg-[#f6f5f6]"
                      >
                        <span className="flex h-9 w-9 items-center justify-center rounded-[9px] border border-[#e1dde1] text-sm">
                          +
                        </span>

                        <span className="text-[13px] text-[#494249]">
                          Browse all apps
                        </span>
                      </button>

                    </div>


                    {/* COLUMN 2 */}

                    <div>

                      <ModalSectionTitle>
                        Contact info
                      </ModalSectionTitle>

                      {getElements(
                        "Contact info"
                      ).map((item, index) => (
                        <ModalElement
                          key={`${item.type}-${index}`}
                          item={item}
                          onClick={() =>
                            handleElementClick(
                              item
                            )
                          }
                        />
                      ))}


                      <div className="mt-7">

                        <ModalSectionTitle>
                          Text & Video
                        </ModalSectionTitle>

                        {getElements(
                          "Text & Video"
                        ).map(
                          (item, index) => (
                            <ModalElement
                              key={`${item.type}-${index}`}
                              item={item}
                              onClick={
                                item.premium
                                  ? undefined
                                  : () =>
                                      handleElementClick(
                                        item
                                      )
                              }
                            />
                          )
                        )}

                      </div>

                    </div>


                    {/* COLUMN 3 */}

                    <div>

                      <ModalSectionTitle>
                        Choice
                      </ModalSectionTitle>

                      {getElements("Choice").map(
                        (item, index) => (
                          <ModalElement
                            key={`${item.type}-${index}`}
                            item={item}
                            onClick={() =>
                              handleElementClick(
                                item
                              )
                            }
                          />
                        )
                      )}


                      <div className="mt-7">

                        <ModalSectionTitle>
                          Rating & ranking
                        </ModalSectionTitle>

                        {getElements(
                          "Rating & ranking"
                        ).map(
                          (item, index) => (
                            <ModalElement
                              key={`${item.type}-${index}`}
                              item={item}
                              onClick={() =>
                                handleElementClick(
                                  item
                                )
                              }
                            />
                          )
                        )}

                      </div>

                    </div>

                  </div>


                  {/* =================================================
                      LOWER SECTION
                  ================================================= */}

                  <div className="mt-8 grid grid-cols-3 gap-x-12">

                    <div />

                    <div>

                      <ModalSectionTitle>
                        Other
                      </ModalSectionTitle>

                      {getElements("Other").map(
                        (item, index) => (
                          <ModalElement
                            key={`${item.type}-${index}`}
                            item={item}
                            onClick={
                              item.premium
                                ? undefined
                                : () =>
                                    handleElementClick(
                                      item
                                    )
                            }
                          />
                        )
                      )}

                    </div>


                    <div>

                      <ModalSectionTitle>
                        Special
                      </ModalSectionTitle>

                      {getElements("Special").map(
                        (item, index) => (
                          <ModalElement
                            key={`${item.type}-${index}`}
                            item={item}
                            onClick={
                              item.premium
                                ? undefined
                                : () =>
                                    handleElementClick(
                                      item
                                    )
                            }
                          />
                        )
                      )}

                    </div>

                  </div>

                </>
              )}

            </div>
          )}

        </div>

      </div>
{showAIModal && (
  <AIFormModal
    onClose={() => setShowAIModal(false)}
  />
)}
    </div>
    
  );
}
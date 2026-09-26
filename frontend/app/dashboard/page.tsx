"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UserButton, useUser } from "@clerk/nextjs";
import {
  getForms,
  createForm,
  createQuestion,
  generateFormWithAI,
} from "@/lib/api";

interface Form {
  id: number;
  title: string;
  description: string | null;
  status: string;
  slug: string | null;
  created_at: string;
  updated_at: string;
  creator_id: number;
}

export default function Home() {
  const router = useRouter();
  const { user } = useUser();

  const [showAIModal, setShowAIModal] = useState(false);
const [aiPrompt, setAiPrompt] = useState("");
const [aiLoading, setAiLoading] = useState(false);
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);


  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState("");

  async function loadForms() {
    try {
      const data = await getForms();
      setForms(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadForms();
  }, []);

  async function handleCreate() {
    if (!title.trim()) return;

    try {
      await createForm(title, "A new Typeform-style form");

      setTitle("");
      setShowCreate(false);

      await loadForms();
    } catch (error) {
      console.error(error);
    }
  }

  const userName =
    user?.username ||
    user?.firstName ||
    user?.primaryEmailAddress?.emailAddress ||
    "User";

  return (
    <main className="min-h-screen bg-[#f8f8f7] text-[#302733]">

      {/* TOP HEADER */}

      <header className="h-16 border-b border-[#e5e2e5] bg-white">
        <div className="flex h-full items-center justify-between px-5">

          <div className="flex items-center gap-3">

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#e15b55] text-sm font-semibold text-white">
              {user?.firstName?.charAt(0)?.toUpperCase() || "K"}
            </div>

            <span className="text-sm font-medium">
              {userName}
            </span>

            <span className="text-gray-500">
              ˅
            </span>

          </div>


          <div className="flex items-center gap-7">

            <button className="text-sm text-[#4d4650] hover:text-black">
              ⊞ Integrations
            </button>

            <button className="text-sm text-[#4d4650] hover:text-black">
              ♧ Brand kit
            </button>

            <button className="text-lg text-[#5c5660]">
              ?
            </button>

            <UserButton />

          </div>

        </div>
      </header>


      {/* RESPONSE BANNER */}

      <div className="mx-3 mt-3 flex h-16 items-center justify-center rounded-xl border border-[#9bd9d2] bg-[#f7fffd]">

        <div className="flex items-center gap-4 text-sm">

          <span className="text-xl text-[#168577]">
            ◇
          </span>

          <span>
            You can collect{" "}
            <strong>10 form responses</strong>{" "}
            this month for free.
          </span>

          <button className="rounded-lg bg-[#167c6d] px-3 py-2 text-sm font-semibold text-white">
            Get more responses
          </button>

          <button className="ml-8 text-xl text-gray-500">
            ×
          </button>

        </div>

      </div>


      {/* NAVIGATION */}

      <nav className="mt-3 flex h-16 items-center gap-8 border-b border-[#dedade] bg-white px-8">

        <button className="relative flex h-full items-center gap-2 border-b-4 border-[#493d4b] px-2 text-sm font-medium">
          ▣ Forms
        </button>

        <button className="flex items-center gap-2 text-sm text-[#5c5660]">
          ♧ Contacts
        </button>

        <button className="flex items-center gap-2 text-sm text-[#5c5660]">
          ♧ Automations
        </button>

        <button className="flex items-center gap-2 text-sm text-[#5c5660]">
          ╱ Insights
        </button>

        <button className="flex items-center gap-2 text-sm text-[#5c5660]">
          ▣ Pages
          <span className="rounded-md border border-blue-300 px-2 py-0.5 text-xs text-blue-600">
            Beta
          </span>
        </button>

        <div className="h-7 w-px bg-gray-300" />

        <button className="flex items-center gap-2 text-sm text-[#5c5660]">
          ◉ Research Flow
        </button>

      </nav>


      <div className="flex min-h-[calc(100vh-145px)]">

        {/* SIDEBAR */}

        <aside className="flex w-[300px] shrink-0 flex-col border-r border-[#dedade] bg-white">

          <div className="border-b border-[#dedade] p-5">

            <button
              onClick={() => setShowCreate(true)}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#403542] py-3 text-sm font-semibold text-white transition hover:bg-[#302733]"
            >
              <span className="text-xl leading-none">+</span>
              Create form
            </button>

          </div>


          <div className="border-b border-[#dedade] px-5 py-5">

            <div className="flex items-center gap-3 text-sm text-[#625c64]">
              <span className="text-xl">
                ⌕
              </span>

              <span>
                Search
              </span>
            </div>

          </div>


          <div className="px-5 py-6">

            <div className="flex items-center justify-between">

              <div className="flex items-center gap-3 text-sm font-medium">
                <span className="text-lg">
                  ▦
                </span>

                Workspaces
              </div>

              <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 text-xl hover:bg-gray-50">
                +
              </button>

            </div>


            <div className="mt-7">

              <div className="mb-3 flex items-center justify-between text-xs text-gray-500">
                <span>
                  Private
                </span>

                <span>
                  ⌃
                </span>
              </div>


              <button className="flex w-full items-center justify-between rounded-lg bg-[#f1eff1] px-4 py-3 text-left text-sm font-medium">

                <span>
                  My workspace
                </span>

                <span className="text-xs text-gray-500">
                  {forms.length}
                </span>

              </button>

            </div>

          </div>


          <div className="mt-auto border-t border-[#dedade] p-5">

            <div className="text-sm font-medium">
              Responses collected
            </div>

            <div className="mt-3 h-1 rounded-full bg-gray-200">
              <div className="h-1 w-0 rounded-full bg-[#403542]" />
            </div>

            <div className="mt-3 text-sm text-gray-500">
              0 / 10
            </div>

            <button className="mt-4 rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium hover:bg-gray-50">
              Increase response limit
            </button>


            <div className="mt-5 flex items-center gap-2 rounded-xl border border-purple-200 bg-white p-2 shadow-sm">

              <span className="px-2 text-lg text-gray-500">
                ♫
              </span>

              <input
                placeholder="Ask Typeform AI"
                className="min-w-0 flex-1 text-sm outline-none placeholder:text-gray-400"
              />

              <button className="text-lg text-gray-400">
                ▷
              </button>

            </div>

          </div>

        </aside>


        {/* MAIN CONTENT */}

        <section className="min-w-0 flex-1 px-12 py-8">

          {/* Workspace heading */}

          <div className="flex items-center justify-between border-b border-[#dedade] pb-6">

            <div className="flex items-center gap-4">

              <h1 className="text-3xl font-normal">
                My workspace
              </h1>

              <span className="text-xl text-gray-500">
                ...
              </span>

              <button className="flex items-center gap-2 text-sm text-gray-600">
                ♧ Invite
              </button>

              <span className="text-lg text-[#168577]">
                ◇
              </span>

            </div>


            <div className="flex items-center gap-3">

              <button className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-600">
                ▣ &nbsp; Date created &nbsp;⌄
              </button>

              <div className="flex overflow-hidden rounded-xl border border-gray-300 bg-white">

                <button className="bg-gray-100 px-4 py-2.5 text-sm">
                  ☷ List
                </button>

                <button className="px-4 py-2.5 text-sm text-gray-600">
                  ▦ Grid
                </button>

              </div>

            </div>

          </div>


          {/* AI SUGGESTIONS */}

          <div className="mt-8 grid grid-cols-2 gap-5">

            <div className="rounded-xl bg-white p-5">

              <div className="flex gap-4">

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                  ✨
                </div>

                <div className="flex-1">

                  <p className="text-sm leading-6">
                    Collect and prioritize incoming requests efficiently for better workflow management.
                  </p>

                  <button
                    onClick={() => setShowCreate(true)}
                    className="mt-4 rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium"
                  >
                    Create form
                  </button>

                </div>

                <button className="text-xl text-gray-500">
                  ×
                </button>

              </div>

            </div>


            <div className="rounded-xl bg-white p-5">

              <div className="flex gap-4">

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                  ✨
                </div>

                <div className="flex-1">

                  <p className="text-sm leading-6">
                    Monitor project milestones and team updates to ensure timely completion.
                  </p>

                  <button
                    onClick={() => setShowCreate(true)}
                    className="mt-4 rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium"
                  >
                    Create form
                  </button>

                </div>

                <button className="text-xl text-gray-500">
                  ×
                </button>

              </div>

            </div>

          </div>


          {/* TABLE HEADER */}

          <div className="mt-10 grid grid-cols-[1fr_110px_110px_130px_100px] items-center px-4 text-sm text-gray-500">

            <div />

            <div>
              Responses
            </div>

            <div>
              Completed
            </div>

            <div>
              Updated
            </div>

            <div>
              Integrations
            </div>

          </div>


          {/* FORMS */}

          <div className="mt-3 space-y-2">

            {loading && (
              <div className="rounded-xl bg-white p-8 text-center text-sm text-gray-500">
                Loading forms...
              </div>
            )}


            {!loading && forms.length === 0 && (
              <div className="rounded-xl bg-white p-10 text-center">

                <h3 className="font-semibold">
                  No forms yet
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  Create your first form to get started.
                </p>

              </div>
            )}


            {!loading &&
              forms.map((form) => (

                <button
                  key={form.id}
                  onClick={() => router.push(`/builder/${form.id}`)}
                  className="group grid w-full grid-cols-[1fr_110px_110px_130px_100px] items-center rounded-xl border border-gray-200 bg-white px-4 py-3 text-left transition hover:border-gray-300 hover:shadow-sm"
                >

                  <div className="flex items-center gap-4">

                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#e05d56] text-white">
                      F
                    </div>

                    <div>

                      <div className="font-medium">
                        {form.title}
                      </div>

                      {form.description && (
                        <div className="mt-1 text-xs text-gray-400">
                          {form.description}
                        </div>
                      )}

                    </div>

                  </div>


                  <div className="text-sm text-gray-400">
                    -
                  </div>


                  <div className="text-sm text-gray-400">
                    -
                  </div>


                  <div className="text-sm text-gray-600">
                    {new Date(form.updated_at).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      }
                    )}
                  </div>


                  <div className="text-lg text-gray-500">
                    ⊞
                  </div>

                </button>

              ))}

          </div>

        </section>

      </div>


      {/* CREATE MODAL */}

      {showCreate && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

          <div className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-2xl">

            <h2 className="text-2xl font-semibold">
              Create a new form
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Choose how you want to create your form.
            </p>


            <div className="mt-7 grid gap-4">

              <button
  onClick={async () => {
    setTitle("Untitled form");
    setShowCreate(false);

    try {
      const form = await createForm(
        "Untitled form",
        "A new Typeform-style form"
      );

      router.push(`/builder/${form.id}`);
    } catch (error) {
      console.error(error);
      alert("Failed to create form");
    }
  }}
  className="rounded-2xl border border-gray-200 p-5 text-left transition hover:border-black hover:shadow-md"
>

                <div className="flex items-center gap-4">

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-black text-xl text-white">
                    +
                  </div>

                  <div>

                    <h3 className="font-semibold">
                      Start from scratch
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      Create a blank form and add your questions yourself.
                    </p>

                  </div>

                </div>

              </button>


              <button
                onClick={() => {
                 setShowAIModal(true);
                }}
                className="rounded-2xl border border-gray-200 p-5 text-left transition hover:border-black hover:shadow-md"
              >

                <div className="flex items-center gap-4">

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#302733] text-xl text-white">
                    ✨
                  </div>

                  <div>

                    <h3 className="font-semibold">
                      Create with AI
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      Describe what you need and let AI generate your form.
                    </p>

                  </div>

                </div>

              </button>

            </div>


            <div className="mt-7">

              <label className="text-sm font-medium">
                Form name
              </label>

              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleCreate();
                  }
                }}
                autoFocus
                placeholder="e.g. Customer Feedback"
                className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
              />

            </div>


            <div className="mt-6 flex justify-end gap-3">

              <button
                onClick={() => setShowCreate(false)}
                className="rounded-full px-5 py-2.5 text-sm font-medium hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                onClick={handleCreate}
                className="rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
              >
                Create
              </button>

            </div>

          </div>

        </div>

      )}
    {showAIModal && (
  <div
    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-6"
    onClick={() => {
      if (!aiLoading) {
        setShowAIModal(false);
      }
    }}
  >
    <div
      className="w-full max-w-lg rounded-3xl bg-white p-7 shadow-2xl"
      onClick={(event) => event.stopPropagation()}
    >
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-[#302733]">
            Create with AI
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Describe the form you want and AI will create it for you.
          </p>
        </div>

        <button
          onClick={() => setShowAIModal(false)}
          disabled={aiLoading}
          className="text-2xl text-gray-400 hover:text-gray-700"
        >
          ×
        </button>
      </div>

      <div className="mt-6">
        <textarea
          value={aiPrompt}
          onChange={(event) =>
            setAiPrompt(event.target.value)
          }
          placeholder="Example: Create a customer feedback form with questions about satisfaction, product quality, and suggestions."
          rows={6}
          className="w-full resize-none rounded-2xl border border-gray-300 p-4 text-sm outline-none transition focus:border-[#302733] focus:ring-2 focus:ring-[#302733]/10"
        />
      </div>

      <button
  disabled={!aiPrompt.trim() || aiLoading}
  onClick={async () => {
  try {
    setAiLoading(true);

    // Generate form using Gemini
    const result = await generateFormWithAI(
      aiPrompt.trim()
    );

    console.log("AI GENERATED FORM:", result);

    // Create the form in the database
    const form = await createForm(
      result.title,
      result.description || ""
    );

    // Create all generated questions
    for (let i = 0; i < result.questions.length; i++) {
      const question = result.questions[i];

      await createQuestion(form.id, {
        type: question.type,
        title: question.title,
        description: question.description || "",
        required: question.required,
        position: i,
        settings: question.settings,
      });
    }

    // Close modal
    setShowAIModal(false);
    setAiPrompt("");

    // Open generated form
    router.push(`/builder/${form.id}`);

  } catch (error) {
    console.error(error);

    alert(
      error instanceof Error
        ? error.message
        : "Failed to generate form"
    );
  } finally {
    setAiLoading(false);
  }
}}
  className="mt-5 w-full rounded-2xl bg-[#302733] py-3.5 text-sm font-medium text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-40"
>
  {aiLoading ? "Generating..." : "Generate form"}
</button>
    </div>
  </div>
)}
    </main>
  );
  
}
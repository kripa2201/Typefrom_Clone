"use client";

import { SignInButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
    const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.replace("/dashboard");
    }
  }, [isLoaded, isSignedIn, router]);
  return (
    <main className="min-h-screen bg-[#281f2a] text-white">

      {/* Header */}

      <header className="flex items-center justify-between px-8 py-6">

        <div className="flex items-center gap-3">

          <div className="flex gap-1">
            <div className="h-7 w-2 rounded-full bg-white" />
            <div className="h-7 w-7 rounded-md bg-white" />
          </div>

          <span className="text-2xl font-semibold tracking-tight">
            Typeform
          </span>

        </div>


       <div className="flex items-center gap-3">

  <SignInButton
    mode="modal"
    forceRedirectUrl="/dashboard"
  >
    <button className="rounded-xl bg-white px-6 py-3 text-sm font-medium text-[#281f2a] transition hover:bg-gray-100">
      Sign in
    </button>
  </SignInButton>

 

</div>

      </header>


      {/* Hero */}

      <section className="px-6 pt-16 text-center">

        <p className="text-sm font-semibold tracking-wide text-[#d9a9e8]">
          AI FORMS & WORKFLOWS
        </p>


        <h1 className="mx-auto mt-7 max-w-4xl text-6xl font-normal leading-[0.98] tracking-[-0.04em] md:text-7xl">
          The form is only
          <br />
          the beginning
        </h1>


        <p className="mx-auto mt-8 max-w-2xl text-lg leading-7 text-white/90">
          Collect, analyze, and act on customer data
          <br />
          with the complete platform for AI forms & workflows.
        </p>


        <SignInButton
          mode="modal"
          forceRedirectUrl="/dashboard"
        >
          <button className="mt-8 rounded-xl bg-white px-7 py-4 text-base font-medium text-[#281f2a] transition hover:-translate-y-0.5 hover:bg-gray-100">
            Get started—it's free
          </button>
        </SignInButton>

      </section>


      {/* Preview Cards */}

      <section className="mx-auto mt-20 grid max-w-[1650px] grid-cols-1 gap-8 px-8 pb-16 md:grid-cols-3">

        {/* Card 1 */}

        <div className="relative min-h-[340px] overflow-hidden rounded-2xl border border-white/20 bg-[#211b23] p-8">

          <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-purple-600/50 blur-3xl" />

          <div className="relative mt-24 rounded-xl bg-white/10 p-6 text-left backdrop-blur">

            <p className="text-lg leading-7 text-white">
              Build a lead generation form for my business, FitCo
            </p>

            <span className="mt-2 inline-block h-5 w-0.5 animate-pulse bg-white" />

          </div>

        </div>


        {/* Card 2 */}

        <div className="relative min-h-[340px] overflow-hidden rounded-2xl border border-white/20 bg-[#211b23] p-8">

          <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-purple-600/50 blur-3xl" />

          <div className="relative mt-10 overflow-hidden rounded-xl bg-[#75601a]">

            <div className="p-6">

              <p className="text-sm font-medium">
                FitCo
              </p>

              <h3 className="mt-12 text-2xl font-semibold">
                Try similar
                <br />
                HIIT classes:
              </h3>

              <div className="mt-5 space-y-2">

                <div className="rounded border border-lime-300/60 px-3 py-2 text-sm">
                  Power Hour
                </div>

                <div className="rounded border border-lime-300/60 px-3 py-2 text-sm">
                  Total Tone
                </div>

              </div>

            </div>

          </div>

        </div>


        {/* Card 3 */}

        <div className="relative min-h-[340px] overflow-hidden rounded-2xl border border-white/20 bg-[#211b23] p-8">

          <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-purple-600/50 blur-3xl" />

          <div className="relative mt-10 rounded-xl bg-[#75601a] p-6">

            <p className="text-sm font-medium">
              FitCo
            </p>

            <h3 className="mt-12 text-xl font-semibold">
              Sign to confirm you're in good health
            </h3>

            <div className="mt-8 rounded-lg bg-white/80 p-4 text-sm text-gray-700">
              Robin Smith
            </div>

          </div>

        </div>

      </section>

    </main>
  );
}
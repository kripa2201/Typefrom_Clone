"use client";

import { useState } from "react";

interface SettingsModalProps {
  title: string;
  description: string;
  onClose: () => void;
  onSave: (title: string, description: string) => Promise<void>;
}

export default function SettingsModal({
  title,
  description,
  onClose,
  onSave,
}: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState("General");

  const [formTitle, setFormTitle] = useState(title);
  const [formDescription, setFormDescription] = useState(description);

  const [saving, setSaving] = useState(false);

  const tabs = [
    "General",
    "Access & Scheduling",
    "Language",
    "Block references",
  ];

  return (
    <div
      className="fixed inset-0 z-[150] flex items-center justify-center bg-black/50 p-5"
      onClick={onClose}
    >
      <div
        className="flex h-[720px] w-full max-w-[1200px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="px-9 pt-7">
          <h2 className="text-2xl font-medium text-[#302733]">
            Form settings
          </h2>
        </div>

        {/* Main content */}
        <div className="flex min-h-0 flex-1 gap-8 px-5 pb-5 pt-6">

          {/* Left navigation */}
          <div className="w-[290px] shrink-0 px-4">
            <div className="space-y-2">
              {tabs.map((tab) => {
                const disabled = tab === "Block references";

                return (
                  <button
                    key={tab}
                    disabled={disabled}
                    onClick={() => setActiveTab(tab)}
                    className={`w-full rounded-xl px-4 py-3 text-left text-sm ${
                      disabled
                        ? "cursor-not-allowed text-gray-300"
                        : activeTab === tab
                          ? "bg-gray-100 text-[#302733]"
                          : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Settings content */}
          <div className="min-h-0 flex-1 overflow-y-auto rounded-2xl bg-[#fafafa] p-8">

            {/* GENERAL */}
            {activeTab === "General" && (
              <div>
                <h3 className="mb-6 text-lg font-medium text-[#302733]">
                  General
                </h3>

                <div className="space-y-5">

                  {/* Form title */}
                  <div>
                    <label className="text-sm text-gray-600">
                      Form title
                    </label>

                    <input
                      value={formTitle}
                      onChange={(event) =>
                        setFormTitle(event.target.value)
                      }
                      placeholder="Enter form title"
                      className="mt-2 w-full max-w-xl rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-[#302733]"
                    />
                  </div>

                  {/* Form description */}
                  <div>
                    <label className="text-sm text-gray-600">
                      Form description
                    </label>

                    <input
                      value={formDescription}
                      onChange={(event) =>
                        setFormDescription(event.target.value)
                      }
                      placeholder="Enter form description"
                      className="mt-2 w-full max-w-xl rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-[#302733]"
                    />
                  </div>

                </div>
              </div>
            )}

            {/* ACCESS & SCHEDULING */}
            {activeTab === "Access & Scheduling" && (
              <div>
                <h3 className="mb-6 text-lg font-medium text-[#302733]">
                  Access & Scheduling
                </h3>

                <div className="space-y-6">
                  <SettingRow
                    title="Accept responses"
                    description="Allow respondents to submit this form."
                  />

                  <SettingRow
                    title="Limit responses"
                    description="Set a maximum number of submissions."
                  />

                  <SettingRow
                    title="Schedule form"
                    description="Choose when the form becomes available."
                  />
                </div>
              </div>
            )}

            {/* LANGUAGE */}
            {activeTab === "Language" && (
              <div>
                <h3 className="mb-6 text-lg font-medium text-[#302733]">
                  Language
                </h3>

                <label className="text-sm text-gray-600">
                  Form language
                </label>

                <select className="mt-2 w-full max-w-md rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none">
                  <option>English</option>
                  <option>Hindi</option>
                </select>
              </div>
            )}

          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-gray-200 px-7 py-5">

          <button
            onClick={onClose}
            className="rounded-xl px-5 py-3 text-sm font-medium text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
  type="button"
  onClick={async () => {
  try {
    setSaving(true);
    await onSave(formTitle, formDescription);
  } finally {
    setSaving(false);
  }
}}
  disabled={saving}
  className="rounded-xl bg-[#302733] px-6 py-3 text-sm font-medium text-white hover:bg-black disabled:opacity-50"
>
  {saving ? "Saving..." : "Save"}
</button>

        </div>
      </div>
    </div>
  );
}

function SettingRow({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-center justify-between border-b border-gray-200 pb-5">
      <div>
        <p className="text-sm font-medium text-[#302733]">
          {title}
        </p>

        <p className="mt-1 text-xs text-gray-500">
          {description}
        </p>
      </div>

      <button className="relative h-6 w-11 rounded-full bg-gray-200">
        <span className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white" />
      </button>
    </div>
  );
}
"use client";

import { useState } from "react";
import TextChat from "@/components/TextChat";
import LiveChat from "@/components/LiveChat";
import Settings from "@/components/Settings";

const tabs = ["Text Chat", "Live Chat", "Settings"] as const;
type Tab = (typeof tabs)[number];

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("Text Chat");

  return (
    <div className="flex min-h-screen flex-col bg-[#0a0a0a] text-[#ededed]">
      <header className="border-b border-white/10 px-4 py-4">
        <h1 className="text-center text-xl font-semibold tracking-tight">
          Gemini API Tester
        </h1>
        <nav className="mt-3 flex justify-center gap-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? "bg-white/10 text-white"
                  : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col p-4">
        {activeTab === "Text Chat" && <TextChat />}
        {activeTab === "Live Chat" && <LiveChat />}
        {activeTab === "Settings" && <Settings />}
      </main>
    </div>
  );
}

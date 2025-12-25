"use client";

import { useState } from "react";
import LandingPage from "@/components/LandingPage";
import WorkoutView from "@/components/WorkoutView";

export default function Home() {
  const [view, setView] = useState<"landing" | "workout">("landing");
  const [mode, setMode] = useState<"voice" | "webcam">("voice");

  const handleStart = (selectedMode: "voice" | "webcam") => {
    setMode(selectedMode);
    setView("workout");
  };

  const handleStop = () => {
    setView("landing");
  };

  return (
    <main className="bg-black text-white selection:bg-primary selection:text-black">
      {view === "landing" ? (
        <LandingPage onStart={handleStart} />
      ) : (
        <WorkoutView mode={mode} onStop={handleStop} />
      )}
    </main>
  );
}

"use client";

import { useState, useRef } from "react";
import { Mic, Video, VideoOff, Play, Square, Trophy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePoseEstimation } from "@/hooks/usePoseEstimation";

export default function LandingPage({ onStart }: { onStart: (mode: "voice" | "webcam") => void }) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <h1 className="text-6xl font-bold mb-4 gradient-text">Spotter AI</h1>
                <p className="text-xl text-gray-400 mb-12 max-w-2xl">
                    Your voice-first personal coach. Hands-free workouts guided by AI.
                    No screen-watching required.
                </p>

                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                    <button
                        onClick={() => onStart("voice")}
                        className="px-8 py-4 bg-secondary border border-primary/20 rounded-2xl flex items-center gap-3 hover:bg-primary/10 transition-all group"
                    >
                        <Mic className="text-primary group-hover:scale-110 transition-transform" />
                        <div className="text-left">
                            <div className="font-bold">Voice Only</div>
                            <div className="text-xs text-gray-500">Standard mode</div>
                        </div>
                    </button>

                    <button
                        onClick={() => onStart("webcam")}
                        className="px-8 py-4 bg-primary text-black rounded-2xl flex items-center gap-3 hover:scale-105 transition-all glow"
                    >
                        <Video className="group-hover:scale-110 transition-transform" />
                        <div className="text-left">
                            <div className="font-bold">Voice + Webcam</div>
                            <div className="text-xs text-black/70">Form correction</div>
                        </div>
                    </button>
                </div>
            </motion.div>

            <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl">
                {[
                    { icon: Mic, title: "Voice-First", desc: "Interact entirely via speech. No need to touch your phone." },
                    { icon: Trophy, title: "Pro Coaching", desc: "Concise, motivational cues powered by Gemini AI." },
                    { icon: Video, title: "Form Check", desc: "Optional real-time posture correction using computer vision." },
                ].map((feature, i) => (
                    <div key={i} className="p-6 glass rounded-2xl text-left">
                        <feature.icon className="text-primary mb-4" size={32} />
                        <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                        <p className="text-gray-400 text-sm">{feature.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

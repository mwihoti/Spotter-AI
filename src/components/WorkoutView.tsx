"use client";

import { useState, useRef, useEffect } from "react";
import { Mic, Video, VideoOff, Square, Volume2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePoseEstimation } from "@/hooks/usePoseEstimation";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { workoutDatabase, Exercise } from "@/lib/workoutData";

interface WorkoutViewProps {
    mode: "voice" | "webcam";
    onStop: () => void;
}

export default function WorkoutView({ mode, onStop }: WorkoutViewProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [exerciseIndex, setExerciseIndex] = useState(0);
    const [currentExercise, setCurrentExercise] = useState<Exercise>(workoutDatabase[0]);
    const [isWebcamEnabled, setIsWebcamEnabled] = useState(mode === "webcam");
    const [workoutStarted, setWorkoutStarted] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const lastCueTime = useRef(0);

    const { poseResults, startPose, stopPose, isPoseActive } = usePoseEstimation(videoRef as React.RefObject<HTMLVideoElement>, canvasRef as React.RefObject<HTMLCanvasElement>);
    const { transcript, startListening, stopListening } = useSpeechRecognition();

    const speak = async (text: string) => {
        setIsSpeaking(true);
        setError(null);
        try {
            const response = await fetch("/api/tts", {
                method: "POST",
                body: JSON.stringify({ text }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Failed to generate speech");
            }

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const audio = new Audio(url);
            audio.onended = () => setIsSpeaking(false);
            await audio.play();
        } catch (error: any) {
            console.error("TTS Error:", error);
            setError(error.message);
            setIsSpeaking(false);
        }
    };

    useEffect(() => {
        if (!workoutStarted) {
            setWorkoutStarted(true);
            speak(`Welcome to Spotter AI. Let's start with ${workoutDatabase[0].name}. Ready?`);
            startListening();
        }
    }, []);

    useEffect(() => {
        if (transcript.toLowerCase().includes("next exercise") || transcript.toLowerCase().includes("done")) {
            const nextIndex = exerciseIndex + 1;
            if (nextIndex < workoutDatabase.length) {
                setExerciseIndex(nextIndex);
                setCurrentExercise(workoutDatabase[nextIndex]);
                speak(`Great job. Next is ${workoutDatabase[nextIndex].name}.`);
            } else {
                speak("Workout complete! You did amazing today.");
                setTimeout(onStop, 5000);
            }
        }
    }, [transcript]);

    // Form Correction Logic
    useEffect(() => {
        if (!poseResults?.poseLandmarks || isSpeaking) return;

        const now = Date.now();
        if (now - lastCueTime.current < 5000) return; // Don't spam cues

        const landmarks = poseResults.poseLandmarks;

        if (currentExercise.id === "squats") {
            const leftHip = landmarks[23];
            const leftKnee = landmarks[25];
            const leftAnkle = landmarks[27];

            // Simple angle check for squat depth (very rough)
            if (leftHip && leftKnee && leftAnkle) {
                const dy = leftKnee.y - leftHip.y;
                if (dy < 0.1) { // Hip not low enough
                    speak("Go a bit lower on those squats.");
                    lastCueTime.current = now;
                }
            }
        }
    }, [poseResults, currentExercise, isSpeaking]);

    useEffect(() => {
        if (isWebcamEnabled) {
            navigator.mediaDevices.getUserMedia({ video: true })
                .then((stream) => {
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                        startPose();
                    }
                })
                .catch((err) => {
                    console.error("Webcam Error:", err);
                    setError("Webcam not found or access denied. Switching to voice-only.");
                    setIsWebcamEnabled(false);
                });
        } else {
            stopPose();
            if (videoRef.current?.srcObject) {
                const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
                tracks.forEach(track => track.stop());
            }
        }
    }, [isWebcamEnabled]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-between p-6 bg-black">
            {/* Error Message */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-6 py-3 bg-red-500 text-white rounded-full shadow-lg text-sm font-medium"
                    >
                        {error}
                    </motion.div>
                )}
            </AnimatePresence>
            {/* Header */}
            <div className="w-full flex justify-between items-center max-w-4xl">
                <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${isSpeaking ? "bg-primary animate-pulse" : "bg-gray-600"}`} />
                    <span className="text-sm font-medium text-gray-400">Coach is {isSpeaking ? "speaking" : "listening"}</span>
                </div>
                <button onClick={onStop} className="p-3 glass rounded-full hover:bg-red-500/20 transition-colors">
                    <Square size={20} className="text-red-500" />
                </button>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center justify-center w-full max-w-4xl">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentExercise.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.1 }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-5xl font-bold mb-2">{currentExercise.name}</h2>
                        <div className="text-primary text-xl font-medium">
                            {currentExercise.reps ? `${currentExercise.reps} Reps` : `${currentExercise.duration} Seconds`}
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Visualizer / Webcam */}
                <div className="relative w-full aspect-video max-w-2xl glass rounded-3xl overflow-hidden shadow-2xl">
                    {isWebcamEnabled ? (
                        <>
                            <video ref={videoRef} autoPlay playsInline muted className="hidden" />
                            <canvas ref={canvasRef} className="w-full h-full object-cover" />
                        </>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-secondary/50">
                            <div className="flex gap-1 items-end h-20">
                                {[...Array(12)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        animate={{ height: isSpeaking ? [20, 60, 20] : 10 }}
                                        transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.05 }}
                                        className="w-2 bg-primary rounded-full"
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer Controls */}
            <div className="w-full max-w-4xl flex justify-center gap-6 pb-8">
                <button
                    onClick={() => setIsWebcamEnabled(!isWebcamEnabled)}
                    className={`p-4 rounded-2xl transition-all ${isWebcamEnabled ? "bg-primary text-black" : "glass text-white"}`}
                >
                    {isWebcamEnabled ? <Video size={24} /> : <VideoOff size={24} />}
                </button>
                <div className="flex items-center gap-4 px-6 glass rounded-2xl">
                    <Volume2 className="text-primary" />
                    <div className="w-32 h-1 bg-gray-700 rounded-full overflow-hidden">
                        <div className="w-2/3 h-full bg-primary" />
                    </div>
                </div>
            </div>
        </div>
    );
}

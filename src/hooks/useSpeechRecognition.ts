"use client";

import { useState, useEffect, useCallback } from "react";

export function useSpeechRecognition() {
    const [transcript, setTranscript] = useState("");
    const [isListening, setIsListening] = useState(false);
    const [recognition, setRecognition] = useState<any>(null);

    useEffect(() => {
        if (typeof window !== "undefined" && ("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
            const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
            const recog = new SpeechRecognition();
            recog.continuous = true;
            recog.interimResults = true;
            recog.lang = "en-US";

            recog.onresult = (event: any) => {
                let interimTranscript = "";
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        setTranscript(event.results[i][0].transcript);
                    } else {
                        interimTranscript += event.results[i][0].transcript;
                    }
                }
            };

            recog.onend = () => {
                if (isListening) recog.start();
            };

            setRecognition(recog);
        }
    }, []);

    const startListening = useCallback(() => {
        if (recognition) {
            setIsListening(true);
            recognition.start();
        }
    }, [recognition]);

    const stopListening = useCallback(() => {
        if (recognition) {
            setIsListening(false);
            recognition.stop();
        }
    }, [recognition]);

    return { transcript, isListening, startListening, stopListening };
}

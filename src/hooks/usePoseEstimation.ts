import { useEffect, useRef, useState } from "react";

// Use global types from MediaPipe CDN
declare global {
    interface Window {
        Pose: any;
        POSE_CONNECTIONS: any;
        drawConnectors: any;
        drawLandmarks: any;
    }
}

export function usePoseEstimation(videoRef: React.RefObject<HTMLVideoElement>, canvasRef: React.RefObject<HTMLCanvasElement>) {
    const [poseResults, setPoseResults] = useState<any | null>(null);
    const [isPoseActive, setIsPoseActive] = useState(false);
    const poseRef = useRef<any | null>(null);

    useEffect(() => {
        if (typeof window === "undefined" || !window.Pose) return;

        const pose = new window.Pose({
            locateFile: (file: string) => {
                return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
            },
        });

        pose.setOptions({
            modelComplexity: 1,
            smoothLandmarks: true,
            enableSegmentation: false,
            smoothSegmentation: false,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5,
        });

        pose.onResults((results: any) => {
            setPoseResults(results);
            if (canvasRef.current) {
                const canvasCtx = canvasRef.current.getContext("2d");
                if (canvasCtx) {
                    canvasCtx.save();
                    canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

                    // Draw the video frame
                    canvasCtx.drawImage(results.image, 0, 0, canvasRef.current.width, canvasRef.current.height);

                    // Draw landmarks
                    if (results.poseLandmarks) {
                        window.drawConnectors(canvasCtx, results.poseLandmarks, window.POSE_CONNECTIONS, {
                            color: "#00FF00",
                            lineWidth: 4,
                        });
                        window.drawLandmarks(canvasCtx, results.poseLandmarks, {
                            color: "#FF0000",
                            lineWidth: 2,
                        });
                    }
                    canvasCtx.restore();
                }
            }
        });

        poseRef.current = pose;

        return () => {
            pose.close();
        };
    }, [canvasRef]);

    const startPose = async () => {
        if (videoRef.current && poseRef.current) {
            setIsPoseActive(true);
            const sendFrame = async () => {
                if (videoRef.current && isPoseActive) {
                    await poseRef.current?.send({ image: videoRef.current });
                    requestAnimationFrame(sendFrame);
                }
            };
            sendFrame();
        }
    };

    const stopPose = () => {
        setIsPoseActive(false);
    };

    return { poseResults, startPose, stopPose, isPoseActive };
}

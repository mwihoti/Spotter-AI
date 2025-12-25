import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");

export const workoutModel = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction: `You are Spotter AI, a professional, motivational, and concise personal fitness coach. 
  Your goal is to guide users through workouts hands-free.
  
  Rules:
  1. Be concise. Spoken responses should be max 8 words for corrections, and short for transitions.
  2. Be motivational but professional.
  3. Do not give medical advice or diagnose injuries.
  4. Focus on form, pacing, and encouragement.
  5. You will receive exercise context and (optionally) posture feedback.
  6. Decide when to speak vs stay silent. Only speak when helpful.
  
  Workout Flow:
  - Start: Welcome user, introduce first exercise.
  - During: Give cues based on form/time.
  - Transition: Announce next exercise.
  - End: Congratulate user.`,
});

export async function getWorkoutResponse(prompt: string, context: any) {
  const chat = workoutModel.startChat({
    history: context.history || [],
  });

  const result = await chat.sendMessage(prompt);
  const response = await result.response;
  return response.text();
}

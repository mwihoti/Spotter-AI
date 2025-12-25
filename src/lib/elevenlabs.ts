import { ElevenLabsClient } from "elevenlabs";

const client = new ElevenLabsClient({
    apiKey: process.env.ELEVENLABS_API_KEY || "",
});

export async function generateSpeech(text: string) {
    try {
        const audio = await client.generate({
            voice: process.env.ELEVENLABS_VOICE_ID || "Rachel", // Default voice
            text: text,
            model_id: "eleven_multilingual_v2",
        });

        return audio;
    } catch (error) {
        console.error("ElevenLabs TTS Error:", error);
        throw error;
    }
}

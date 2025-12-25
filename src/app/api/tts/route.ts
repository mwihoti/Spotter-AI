import { NextResponse } from "next/server";
import { generateSpeech } from "@/lib/elevenlabs";

export async function POST(req: Request) {
    try {
        if (!process.env.ELEVENLABS_API_KEY) {
            return NextResponse.json({ error: "ElevenLabs API key is missing. Please check your .env file." }, { status: 401 });
        }

        const { text } = await req.json();
        if (!text) {
            return NextResponse.json({ error: "Text is required" }, { status: 400 });
        }

        const audioStream = await generateSpeech(text);

        // Convert stream to buffer for response
        const chunks = [];
        for await (const chunk of audioStream) {
            chunks.push(chunk);
        }
        const buffer = Buffer.concat(chunks);

        return new NextResponse(buffer, {
            headers: {
                "Content-Type": "audio/mpeg",
            },
        });
    } catch (error: any) {
        console.error("TTS API Error:", error);
        const status = error.statusCode || 500;
        const message = error.body?.detail?.message || "Failed to generate speech";
        return NextResponse.json({ error: message }, { status });
    }
}

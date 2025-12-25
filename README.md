# 🏋️ Spotter AI

Spotter AI is a voice-first, hands-free personal fitness coach powered by **Gemini** and **ElevenLabs**. It provides real-time form correction and personalized workout guidance, allowing you to focus entirely on your workout without ever touching your screen.

## ✨ Features

- 🎙️ **Voice-First Interaction**: Fully hands-free experience using ElevenLabs for natural voice feedback.
- 🧠 **AI Coaching**: Powered by Gemini to provide intelligent workout plans and real-time adjustments.
- 🧘 **Pose Estimation**: Real-time form correction using MediaPipe (Webcam mode).
- ⚡ **Seamless Flow**: Intelligent workout management that adapts to your pace.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15+](https://nextjs.org/)
- **AI Intelligence**: [Google Gemini](https://ai.google.dev/)
- **Voice Synthesis**: [ElevenLabs](https://elevenlabs.io/)
- **Pose Estimation**: [MediaPipe](https://google.github.io/mediapipe/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Framer Motion](https://www.framer.com/motion/)

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/mwihoti/Spotter-AI.git
cd gymai
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
Create a `.env.local` file in the root directory and add your API keys:
```env
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
ELEVENLABS_API_KEY=your_elevenlabs_api_key
ELEVENLABS_VOICE_ID=your_preferred_voice_id
```

### 4. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📄 License

This project is licensed under the MIT License.

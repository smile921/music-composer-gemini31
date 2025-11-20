# Maestro - Sheet Music Composer 🎼

Maestro is a modern, web-based sheet music editor built with React, VexFlow, and Google's Gemini AI. It allows users to compose melodies, play them back, save them locally, and generate new musical ideas using AI.

## ✨ Features Implemented

### 🎹 Composition & Editing
- **Virtual Piano Interface**: Visual input for notes across 3 octaves (C3-B5).
- **Real-time Rendering**: Instant visual feedback using VexFlow to render standard music notation.
- **Key Signatures**: Support for changing key signatures (e.g., G Major, D Minor) which updates stave rendering.
- **Note Controls**: Support for various durations (Whole, Half, Quarter, Eighth).
- **Rest Mode**: Input rests instead of notes.
- **Accidentals**: Support for Sharps (#) and Flats (b).
- **Edit Tools**: Undo last action and Clear board functionality.
- **Repeat Signs**: Add Start (`|:`) and End (`:|`) repeat bars to the score.

### 🤖 AI Integration
- **Gemini AI Composer**: Generate melodies based on natural language descriptions (e.g., "A sad melody in D minor").
- **Chord Suggestions**: Analyze your melody and receive AI-generated chord progression suggestions displayed on the score.
- **Automatic Transcription**: Converts AI JSON responses directly into notation on the staff.

### 📂 Library & Persistence
- **Song Library**: Built-in presets including "Game of Thrones Theme", "Ode to Joy", etc.
- **Local Storage**: Save your own compositions to the browser's local storage.
- **Search & Filter**: Filter songs by category (Soundtrack, Classical, Folk, Pop) or search by title/composer.
- **Management**: Delete custom saved songs.

### 🖨️ Export, Playback & Practice
- **Audio Playback**: Synthetic sine-wave playback using the Web Audio API.
- **Metronome**: Built-in metronome with adjustable BPM that syncs with playback for practice.
- **Print Optimization**: Custom CSS for high-quality printing (removes UI elements, formats for A4 paper).

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS
- **Music Rendering**: VexFlow 5
- **AI**: Google GenAI SDK (Gemini 2.5 Flash)
- **Icons**: Lucide React

## 🚀 Build & Deployment

This project uses a **No-Build** setup relying on ES Modules and Import Maps. It runs directly in modern browsers without Webpack or Vite bundling for simplicity in this specific environment.

### Prerequisites
- A modern web browser (Chrome/Edge/Firefox).
- A static file server.

### How to Run Locally

1. **Clone or Download** the project files.
2. **Start a Static Server** in the root directory.
   - Using Python:
     ```bash
     python3 -m http.server 8000
     ```
   - Using Node.js (`serve`):
     ```bash
     npx serve .
     ```
3. **Open Browser**: Navigate to `http://localhost:8000`.

### Environment Variables
To use the AI features, the application expects `process.env.API_KEY` to be available. In a local development environment without a bundler, you may need to hardcode your key in `services/geminiService.ts` temporarily or set up a basic build pipeline (like Vite) to handle `.env` files.

### Deployment
Since the app is static HTML/JS/CSS:
1. Upload all files to any static host (GitHub Pages, Netlify, Vercel, AWS S3).
2. Ensure the `metadata.json` and structure remain at the root.

## 📄 License
Open Source.
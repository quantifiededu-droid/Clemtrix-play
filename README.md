# Clemtrix Play 🎹

Learn piano the right way — step by step. Clemtrix Play is an interactive piano learning platform with a structured curriculum, real-time hand diagrams, and an integrated synth-powered keyboard.

## 🚀 Tech Stack

- **Framework**: React 19 + Vite + Express (Full-stack)
- **Database / Auth**: Firebase (Firestore + Google Auth)
- **Audio engine**: Tone.js
- **Animations**: Framer Motion
- **Styling**: Tailwind CSS v4
- **Validation**: Zod + React Hook Form

## 📂 Folder Structure

- `/src/pages`: Main application views (Landing, Dashboard, Lesson, Quiz, etc.)
- `/src/components`: UI components including the interactive Piano and SVG Hand Diagrams.
- `/src/lib`: Logic for Firebase, Lessons Data, and utility functions.
- `server.ts`: Express server handling Vite middleware and API endpoints.

## 🛠️ Local Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd clemtrix-play
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   - Copy `.env.example` to `.env`.
   - Fill in your `GEMINI_API_KEY` (if using AI features) and Firebase config.

4. **Run development server**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000`.

## ☁️ Firebase Setup

This app uses Firebase for real-time progress tracking and authentication.
- Create a project at [Firebase Console](https://console.firebase.google.com/).
- Enable **Firestore** and **Google Authentication**.
- Copy the config into a `firebase-applet-config.json` or update `src/lib/firebase.ts`.

## 🌍 Vercel Deployment

1. Connect your GitHub repository to Vercel.
2. The `vercel.json` provides the routing for the SPA and API.
3. Ensure all environment variables are added in the Vercel dashboard.
4. Deploy!

## 📜 Key Features

- **22 Lessons**: Full course from Beginner (finding Middle C) to Advanced (Beethoven's Für Elise).
- **Interactive Piano**: 29-key responsive keyboard with high-fidelity audio.
- **Hand Diagnostics**: Precision SVG diagrams for posture and fingering.
- **Smart Progress**: Lessons unlock sequentially upon passing quizzes.
- **Adaptive UI**: Fully responsive and dark-mode ready.

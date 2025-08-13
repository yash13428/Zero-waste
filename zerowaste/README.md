# ZeroWaste — Freedom from Hunger

A food surplus redistribution platform connecting donors and NGOs, built with React + Firebase for Independence Day’s theme: “Digital Independence – Innovating for a Better Tomorrow.”

## What’s inside
- React (Vite)
- Firebase Authentication (Anonymous)
- Firebase Firestore (real-time database)
- Firebase Hosting
- Live “Meals Served” counter (increments when a donation is claimed)

## Prerequisites
- Node.js (LTS) and npm
- Firebase CLI

Install/check tools:
```bash
node -v
npm -v
npm install -g firebase-tools
firebase --version
```

## 1) Get the code and install dependencies
```bash
# if needed
# git clone <your-repo-url> zerowaste
cd zerowaste
npm install
```

## 2) Create and configure your Firebase project
1. Open the Firebase Console and create a new project (or use an existing one).
2. Add a Web app in Project Settings → "Your apps" → Web (</> icon). Copy the config values shown.
3. Enable Authentication → Sign-in method → enable "Anonymous".
4. Create Firestore Database → Start in Test mode (fine for hackathon) → choose a location.

Optional (MVP rules for quick testing):
```text
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null; // requires Anonymous Auth enabled
    }
  }
}
```
Deploy these rules (optional):
```bash
firebase deploy --only firestore
```

## 3) Environment variables
Create a `.env` in the project root (same folder as `package.json`) using `.env.example` as a guide:
```bash
cp .env.example .env
```
Fill it with your actual Web app config values (no quotes):
```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=000000000000
VITE_FIREBASE_APP_ID=1:000000000000:web:abcdef123456
```
Important:
- Storage bucket format is `<project-id>.appspot.com`.
- After editing `.env`, restart the dev server. Vite reads env on startup.
- If you have `.env.local`, `.env.development`, or `.env.production`, ensure they don’t override with placeholders.

## 4) Run locally
```bash
npm run dev
```
Open the printed URL (typically `http://localhost:5173`).

You can now:
- Register Donors and NGOs
- Post surplus food donations
- View and claim donations (NGOs)
- See the live “Meals Served” counter update when a donation is claimed

First-time index (Firestore): if the listings page requests a composite index, create it once in Firestore → Indexes:
- Collection: `donations`
- Fields: `status` Asc, `createdAt` Desc

## 5) Deploy to Firebase Hosting
Ensure the project is linked to your Firebase project:
```bash
firebase login
firebase use --add   # select your project and set as default
```
Initialize Hosting (only once):
- Choose Initialize (not Overwrite) when asked to create a new codebase
- Use existing project → select your project
- Hosting → Configure for Firebase Hosting
- Public directory: `dist`
- Single-page app rewrite: `Yes`
- Generate sample GitHub Actions workflow: `No`
- Overwrite existing files (firebase.json, rules): `No`

Build and deploy:
```bash
npm run build
firebase deploy
```
Your site will be available at a URL like:
- `https://<your-project-id>.web.app`
- `https://<your-project-id>.firebaseapp.com`

The repo includes a Hosting config (`firebase.json`) with SPA rewrites and `firestore.rules` for quick testing.

## Common troubleshooting
- API key not valid / requests show `key=your_api_key` or `projects/your_project_id`:
  - Your `.env` wasn’t picked up by Vite.
  - Fix: ensure `.env` is in the project root, keys are correct, stop and restart the dev server. Try clearing Vite cache:
    ```bash
    rm -rf node_modules/.vite dist
    npm run dev
    ```
  - Hard refresh the browser (Ctrl/Cmd+Shift+R) or open a new Incognito window.
  - Check `src/firebase.js` at runtime by temporarily logging the config:
    ```js
    console.log('Firebase config:', firebaseConfig);
    ```
    Confirm `apiKey` and `projectId` are your real values, then remove the log.

- Anonymous Auth / Firestore errors (permission-denied):
  - Enable Authentication → Anonymous sign-in.
  - Ensure Firestore is created.
  - For MVP, use the permissive rules above during development, then harden for production.

- Composite index error on listings:
  - Create a composite index for `donations` on `status` (Asc) + `createdAt` (Desc) in Firestore → Indexes. The console link will prefill it.

- Firebase init prompts:
  - If asked "generate sample flow" (GitHub Actions), choose `n`.
  - If asked to Overwrite existing config, choose `No`.
  - If you accidentally overwrote configs, restore `firebase.json` and `firestore.rules` as in this README and re-deploy.

## Scripts
```bash
npm run dev     # start locally
npm run build   # production build to dist/
```

## Project highlights
- Real-time “Meals Served” counter from Firestore (`stats/global.mealsServed`).
- Claiming a donation sets `status = Claimed`, stores `claimedBy`, and increments the counter by `estimatedMeals`.
- Simple heuristic: estimated meals = `quantity * 3` for kg, or `quantity` for servings.

## Folder overview (key files)
- `src/firebase.js` — Firebase init (uses `.env`)
- `src/services/firestore.js` — Firestore helpers (donors, NGOs, donations, stats)
- `src/pages/` — Home, DonorRegistration, NGORegistration, DonationForm, Listings
- `src/components/` — Navbar, Footer, MealCounter, DonationCard
- `firebase.json` — Hosting config (SPA)
- `firestore.rules` — MVP Firestore rules (dev)
- `.env.example` — Template for environment variables

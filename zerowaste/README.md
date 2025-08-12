# ZeroWaste — Freedom from Hunger

A food surplus redistribution platform connecting donors and NGOs, built for Independence Day with the theme “Digital Independence – Innovating for a Better Tomorrow.”

## Tech Stack
- React (Vite)
- Firebase (Auth, Firestore, Hosting)

## Features
- Donor and NGO registration
- Post surplus food donations
- View and claim available donations
- Real-time Meals Served counter (increments on successful claim)
- Clean responsive UI with tricolor theme

## Local Setup
1. Clone or open this folder.
2. Install dependencies:
```bash
npm install
```
3. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/).
4. In your project, enable:
   - Authentication: enable Anonymous sign-in
   - Firestore Database: in test mode (or set secure rules below)
5. Create a web app in Firebase and copy the config.
6. Create `.env` from `.env.example` and fill values:
```bash
cp .env.example .env
# edit .env and paste your Firebase config
```
7. Run the app:
```bash
npm run dev
```

## Firestore Structure
- `donors` — donor registration docs
- `ngos` — NGO registration docs
- `donations` — donation posts with fields like `status`, `estimatedMeals`
- `stats/global` — `{ mealsServed: number }`

## Suggested Firestore Rules (MVP)
Use test rules during hackathon or adapt for production. For the MVP, allow authenticated (anonymous) reads/writes and prevent destructive updates.

```rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

For production, restrict writes per collection and validate fields.

## Deploy to Firebase Hosting
1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```
2. Login and init:
```bash
firebase login
firebase init
# Choose Hosting + Firestore, use existing project, set build dir to dist
# Configure as SPA (rewrite to /index.html) = yes
```
3. Build and deploy:
```bash
npm run build
firebase deploy
```

## Environment Variables
See `.env.example` and set:
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

## Notes
- Estimated meals = `quantity * 3` for kg, or `quantity` for servings.
- Claiming a donation sets `status = Claimed`, stores `claimedBy`, and increments `stats/global.mealsServed` by `estimatedMeals`.

## Scripts
```bash
npm run dev     # start locally
npm run build   # production build
```

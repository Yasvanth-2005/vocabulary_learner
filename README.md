# Smart Spaced-Repetition Vocab Builder

A MERN stack web app for saving vocabulary words, auto-fetching definitions, and reviewing them with a spaced-repetition scheduler.

## Links

| | URL |
|---|---|
| **Live app** | https://vocabulary-learner-mauve.vercel.app |
| **API** | https://vocabulary-learner-lim4.onrender.com |
| **GitHub** | https://github.com/Yasvanth-2005/vocabulary_learner |

## Prerequisites

- **Node.js** 18+ (for native `fetch` on the backend)
- **MongoDB** running locally, or a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) connection string

## Quick Start (local)

### 1. Start MongoDB

Ensure MongoDB is running on your machine. The default connection string is:

```
mongodb://127.0.0.1:27017/vocab-builder
```

For Atlas, set `MONGODB_URI` in `backend/.env` (see step 2).

### 2. Start the backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

The API runs at **http://localhost:5000**.

Backend environment variables (`backend/.env`):

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://127.0.0.1:27017/vocab-builder` |
| `USER_ID` | Hardcoded user ID (no auth) | `test-user` |

### 3. Start the frontend

In a second terminal:

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

The React app runs at **http://localhost:5173**.

Frontend environment variable (`frontend/.env`):

```
VITE_API_BASE_URL=http://localhost:5000/api
```

| Variable | Description |
|----------|-------------|
| `VITE_API_BASE_URL` | Full backend API URL including `/api` (defaults to `http://localhost:5000/api` if unset) |

**Production (e.g. Vercel):** set `VITE_API_BASE_URL` to your hosted API (e.g. `https://vocabulary-learner-lim4.onrender.com/api`) in the host's build environment and redeploy.

## Usage

1. **Library** — Type a word and click **Add word**. The backend fetches the definition from [dictionaryapi.dev](https://dictionaryapi.dev/) and saves it to MongoDB.
2. **Review** — Open the Review tab to practice words due today. Reveal to see the **definition** and **example sentence**, then mark **Got it right** or **Needs work**.

## Dev Mode (for reviewers)

Dev Mode is **off by default**. Normal users get real spaced-repetition intervals (1 day / 3 days).

To test the full review lifecycle in a few minutes:

1. Click the **Dev Mode: Off** button in the **top-right corner of the header** (next to the Vocab Builder title).
2. In the modal that opens, flip the **Dev Mode** toggle to **on**. The header button updates to **Dev Mode: On**.
3. With Dev Mode on:
   - Review intervals are compressed to **1 minute** (needs work) and **3 minutes** (got it right) instead of days.
   - **Advance 1 day** / **Advance 3 days** buttons appear in the modal to pull future reviews into the queue immediately.
   - Each word in the **Library** tab shows a **Skip to Review** button to make that word due right away.
4. Suggested 5-minute test flow: add a word → open **Review** → reveal → mark an outcome → use **Advance time** or wait for the compressed interval → confirm the word returns to the queue.

Turn Dev Mode off again from the same header button and toggle when you are done testing.

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/health` | Health check |
| `GET` | `/api/words` | List saved words (supports `page`, `limit`, `search`, `sort`) |
| `POST` | `/api/words` | Add a word (body: `{ "word": "..." }`) |
| `GET` | `/api/words/due/count` | Count of words due for review |
| `GET` | `/api/words/due` | Words due for review |
| `POST` | `/api/words/:id/review` | Submit review (body: `{ "outcome": "got_it_right" \| "needs_work" }`) |
| `POST` | `/api/words/dev/advance-time` | Advance all review dates (Dev Mode only) |
| `POST` | `/api/words/:id/skip-review` | Make a word due immediately (Dev Mode only) |

Send header `X-Dev-Mode: true` to enable dev scheduling intervals.

## Architecture

### Backend

```
backend/src/
├── config/          # DB connection, constants (USER_ID, intervals)
├── controllers/     # Thin HTTP handlers
├── middleware/      # Centralized error handling
├── models/          # Mongoose Word schema
├── routes/          # Express route definitions
└── services/
    ├── dictionaryService.js       # dictionaryapi.dev integration
    ├── spacedRepetitionService.js # interval logic & due-date math
    └── wordService.js             # business logic orchestration
```

**Design decisions:**

- External dictionary API calls are isolated in `dictionaryService.js`, not in route handlers.
- Spaced-repetition scheduling lives in `spacedRepetitionService.js` so interval rules are easy to test and change.
- Controllers parse HTTP input and delegate to `wordService.js`, which orchestrates the database and services.

### Frontend

```
frontend/src/
├── api/client.js              # Fetch wrapper with Dev Mode header
├── store/                     # Redux Toolkit (ui, review, library slices)
├── context/DevModeContext.jsx # Dev Mode toggle shared across components
└── components/
    ├── Header.jsx
    ├── DevSettingsModal.jsx   # Dev Mode toggle + advance time controls
    ├── WordInput.jsx
    ├── WordList.jsx
    ├── ReviewMode.jsx
    ├── Skeleton.jsx
    └── Toast.jsx
```

**Design decisions:**

- **Redux Toolkit** manages review queue state, library reload triggers, tab selection, and toasts.
- **Dev Mode** is held in React Context and sent as `X-Dev-Mode: true` on every API request when enabled.
- The library uses a paginated grid; the review screen shows one word at a time with reveal-then-rate flow.

### Data Model

Each `Word` document stores:

- `word`, `definition`, `example`, `phonetic`, `partOfSpeech` — from the dictionary API
- `nextReviewAt` — indexed date used to query due words (`nextReviewAt <= now`)
- `lastReviewedAt`, `reviewCount` — review history metadata
- `userId` — hardcoded to `test-user` (no auth)

### Dev Test Mode (implementation)

The spec requires reviewers to test the full spaced-repetition lifecycle in ~5 minutes without waiting real days. This app uses a **dual-interval strategy**:

1. **Compressed intervals** — When Dev Mode is on, the frontend sends `X-Dev-Mode: true`. The backend's `spacedRepetitionService` maps **1 day → 1 minute** and **3 days → 3 minutes** instead of calendar days.
2. **Advance Time** — In the header dev settings modal, subtracts 1 or 3 days from every word's `nextReviewAt` so future reviews surface immediately.
3. **Skip to Review** — Per-word action in the Library tab (Dev Mode only) that sets `nextReviewAt` to now.

This combination lets a reviewer: add a word → review it → mark an outcome → wait 3 minutes (or advance time) → see it return to the queue.

See [Dev Mode (for reviewers)](#dev-mode-for-reviewers) above for step-by-step UI instructions.

## Tech Stack

- **MongoDB** + **Mongoose**
- **Express.js**
- **React** (Vite) + **Redux Toolkit**
- **Node.js**
- **Tailwind CSS** v4

## Note on definitions & example sentences

When a word is added, the backend fetches data from [dictionaryapi.dev](https://dictionaryapi.dev/) and stores `definition`, `example`, `phonetic`, and `partOfSpeech` on each `Word` document.

Not every entry from the dictionary API includes an example sentence (e.g. *ephemeral* may have a definition but no quoted usage). To still meet the review requirement:

1. **On add** — `dictionaryService.js` searches **all meanings and definitions** for an example. If none exists, it **generates and stores a fallback** example based on the word and its part of speech.
2. **On review** — The Review screen always shows **Definition:-** and **Example:-** after reveal. For older words saved before this logic, the frontend builds a readable example from the stored definition if `example` is still empty.

Newly added words will have an example persisted in MongoDB. Existing words in the database will still display an example in Review via the frontend fallback until re-added.

## Note on hosted deployment

The backend API is hosted on [Render](https://render.com). On the free tier, the service spins down after inactivity, so the **first request to the hosted URL may take 30–60 seconds** to respond while the server wakes up. If the app seems slow or fails on the first load, wait a moment and refresh — subsequent requests should be much faster.

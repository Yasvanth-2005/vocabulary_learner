# Smart Spaced-Repetition Vocab Builder

A MERN stack web app for saving vocabulary words, auto-fetching definitions, and reviewing them with a spaced-repetition scheduler.

## Prerequisites

- **Node.js** 18+ (for native `fetch` on the backend)
- **MongoDB** running locally, or a MongoDB Atlas connection string

## Quick Start

### 1. Start MongoDB

Ensure MongoDB is running on your machine. The default connection string is:

```
mongodb://127.0.0.1:27017/vocab-builder
```

### 2. Start the backend

```bash
cd backend
cp .env.example .env   # optional — defaults work for local dev
npm install
npm run dev
```

The API runs at **http://localhost:5000**.

### 3. Start the frontend

In a second terminal:

```bash
cd frontend
cp .env.example .env   # optional — defaults work for local dev
npm install
npm run dev
```

The React app runs at **http://localhost:5173**.

### Frontend environment

Create `frontend/.env` (or set the variable in your hosting provider's build settings):

```
VITE_API_BASE_URL=http://localhost:5000/api
```

| Variable | Description |
|----------|-------------|
| `VITE_API_BASE_URL` | Full backend API URL including `/api` (defaults to `http://localhost:5000/api`) |

**Local dev:** omit the variable or point it at `http://localhost:5000/api`.

**Production (e.g. Vercel):** set `VITE_API_BASE_URL` to your hosted backend, e.g. `https://your-api.onrender.com/api`. Vite bakes this in at build time, so add it in your host's environment variables and redeploy.

## Usage

1. **Library** — Type a word and click **Add word**. The backend fetches the definition from [dictionaryapi.dev](https://dictionaryapi.dev/) and saves it to MongoDB.
2. **Review** — Open the Review tab to practice words due today. Reveal the definition, then mark **Got it right** or **Needs work**.

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
| `GET` | `/api/words` | List all saved words |
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
    ├── dictionaryService.js      # dictionaryapi.dev integration
    ├── spacedRepetitionService.js # interval logic & due-date math
    └── wordService.js            # business logic orchestration
```

External API calls live in `dictionaryService.js`, not in route handlers. Review scheduling is isolated in `spacedRepetitionService.js`. Controllers only parse requests and delegate to `wordService.js`.

### Frontend

```
frontend/src/
├── api/client.js           # Fetch wrapper with Dev Mode header
├── context/DevModeContext.jsx
└── components/
    ├── WordInput.jsx
    ├── WordList.jsx
    ├── ReviewMode.jsx
    ├── DevModeToggle.jsx
    └── Toast.jsx
```

React state is kept in `App.jsx` with targeted updates after reviews (optimistic queue removal + background refresh). Dev Mode is shared via React Context and sent to the API on every request.

### Data Model

Each `Word` document stores:

- `word`, `definition`, `example` — from the dictionary API
- `nextReviewAt` — indexed date used to query due words (`nextReviewAt <= now`)
- `lastReviewedAt`, `reviewCount` — review history metadata
- `userId` — hardcoded to `test-user` (no auth)

### Dev Test Mode (implementation)

Dev Mode uses a **dual-interval strategy** so reviewers can complete a full word lifecycle in ~5 minutes:

1. **Compressed intervals** — When Dev Mode is on, the frontend sends `X-Dev-Mode: true` on API requests. The backend maps **1 day → 1 minute** and **3 days → 3 minutes**.
2. **Advance Time** — Available in the header dev settings modal when Dev Mode is on. Subtracts 1 or 3 days from every word's `nextReviewAt`.
3. **Skip to Review** — Per-word button in the Library tab (Dev Mode only) that sets `nextReviewAt` to now.

See [Dev Mode (for reviewers)](#dev-mode-for-reviewers) above for step-by-step UI instructions.

## Tech Stack

- **MongoDB** + **Mongoose**
- **Express.js**
- **React** (Vite)
- **Node.js**
- **Tailwind CSS** v4

# PRD: Smart Spaced-Repetition Vocab Builder

**Objective** Build a functional, full-stack web application that allows users to save new vocabulary words, automatically fetches their definitions, and presents them in a spaced-repetition review interface. 

**Technology Stack Requirement**
This challenge **must be built using the MERN stack**:
* **M**ongoDB (Database / Mongoose ORM)
* **E**xpress.js (Backend Framework)
* **R**eact.js (Frontend Framework)
* **N**ode.js (Runtime Environment)

*Submissions using alternative frameworks, SQL databases, or languages will not be evaluated.*

**Timeline**
Please spend no more than 2-3 days on this challenge. We are looking for clean architecture, a sensible UI, and independent problem-solving rather than a massive feature set.

---

## Part 1: Core Product Requirements

### 1. Smart Word Ingestion
**User Story:** As a user, I want to type a word into an input field so that the app can automatically fetch and save its definition.

**Acceptance Criteria:**
* The UI contains a search/input field for adding a new word.
* Upon submission, the Express backend calls a free public dictionary API (e.g., `api.dictionaryapi.dev`) to retrieve the definition and an example sentence.
* The enriched data (word, definition, example) is stored as a document in MongoDB.
* The React UI updates to reflect the successfully added word.

### 2. The Review Interface
**User Story:** As a user, I want a dedicated view to test my memory on words that are due for review today.

**Acceptance Criteria:**
* A "Review Mode" screen displays the count of words currently due for review.
* The interface shows one word at a time, hiding the definition.
* A "Reveal" button displays the definition and example sentence.
* After revealing, the user must choose between two actions: "Got it right" or "Needs work".
* The React UI instantly transitions to the next word in the queue upon selection.

### 3. Spaced Repetition Engine & "Dev Test Mode"
**User Story:** As a user, I want the system to schedule my next review based on my performance. As a tester, I want to trigger these reviews on demand without waiting days.

**Acceptance Criteria:**
* **Base Logic:** "Needs work" schedules the word for review in 1 day. "Got it right" schedules it for 3 days.
* **On-Demand Testing Utility:** Include a visible "Dev Mode" toggle or a "Simulate Time" button in the React UI. 
* When Dev Mode is active, the app must allow the tester to override the waiting period. You can achieve this by implementing a "Skip to Next Review" button per word, a global "Advance Time by X Days" function, or by mapping the 1-day/3-day logic to 1-minute/3-minute intervals for testing purposes.
* Choose whichever testing implementation you feel is cleanest, but the reviewer must be able to test the full lifecycle of a word in a 5-minute session.

---

## Part 2: Engineering & Evaluation Expectations

We are evaluating this submission across three primary pillars: Code Quality, UI/UX Skills, and Independence. 

### Code Quality & Architecture
* **Separation of Concerns:** External API calls should not be tightly coupled to Express route handlers. We expect to see dedicated service layers or utility classes in Node.
* **State Management:** Demonstrate clean React state handling. Avoid unnecessary re-renders and ensure the UI stays smoothly synchronized with backend changes.
* **Data Modeling:** Your Mongoose schemas and MongoDB queries should cleanly handle the time-based filtering required for the review engine.
* **Error Handling:** Gracefully handle edge cases, such as network failures or a user typing a word that does not exist in the dictionary API.

### UI / UX Skills
* **Component Design:** You are free to use a React component library (MUI, Tailwind UI, Radix, etc.) or write custom CSS. 
* **Polish & Feedback:** We expect a consumer-grade feel. Include loading states during API calls, empty states when there are no words to review, and clear feedback when an action succeeds or fails.
* **Responsiveness:** The core review interface should function cleanly on both desktop and standard mobile viewport widths.

### Autonomy & Product Sense
* **Independent Execution:** This spec leaves certain implementation details (like the exact mechanism for the "Dev Test Mode" and the database schema structure) up to you. We are testing your ability to make sensible product and technical decisions without needing step-by-step guidance.
* **Scope Management:** Focus on nailing the core flow. You may hardcode a user ID (`const USER_ID = 'test-user'`) and completely skip authentication, login screens, and user registration.

---

## Submission Guidelines

* Provide a link to a public GitHub repository containing your code.
* Include a `README.md` file with explicit, step-by-step instructions on how to start the Node/Express backend and Vite/React frontend locally.
* Include a brief section in the README explaining your architectural decisions, specifically how you chose to implement the "Dev Test Mode" for the spaced repetition engine.

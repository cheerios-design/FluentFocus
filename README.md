# Project Architecture: FluentFocus (MVP)
**Author: Sam Daramroei**
**Target:** Turkish speakers preparing for TOEFL/IELTS.
**Core Stack:** Next.js 14 (App Router), TypeScript, PostgreSQL (Prisma), Tailwind CSS.

## 1. Data Pipeline & Seeding Strategy (The "No-Scraper" Engine)
We do not scrape websites. We ingest raw data from open-source repositories and enrich it via APIs.

### A. Data Sources
1. **Primary Word List (IELTS):** `Aynaabaj/IELTS-1200-Words-Practice` (JSON source).
2. **Primary Word List (TOEFL):** `ladrift/toefl` (TXT source).
3. **Enrichment API:** `api.dictionaryapi.dev` (Free, Open Source).
   - Used to fetch: `phonetics` (audio URL), `meanings` (definitions), and `examples` (sentences).
4. **Localization:** Google Translate API (Free Tier) or `google-translate-api` (NPM package) for generating the initial Turkish `translation` field during seeding.

### B. The Seeding Script (`scripts/seed.ts`)
This script runs *once* during build/setup to populate the database.
1. **Read:** Parse the raw `.txt` or `.json` files from the `data/` folder.
2. **Fetch:** Loop through words -> Call Dictionary API -> Get Definition/Audio/Example.
3. **Translate:** Call Translation API -> Get Turkish equivalent.
4. **Upsert:** Save to PostgreSQL `Word` table to avoid duplicates.

## 2. Database Schema (Prisma Models)

### `User`
- `id`: String (UUID)
- `email`: String (Unique)
- `level`: Enum (BEGINNER, INTERMEDIATE, ADVANCED)
- `dailyGoal`: Int (default: 5 words/day)
- `streak`: Int

### `Word` (The Core Knowledge Unit)
- `id`: Int (Auto-inc)
- `term`: String (Unique) - e.g., "Abate"
- `translation`: String - e.g., "Azalmak, dinmek"
- `definition`: String (English)
- `exampleSentence`: String - e.g., "The storm suddenly abated."
- `audioUrl`: String? (URL to MP3 from Dictionary API)
- `examType`: Enum (TOEFL, IELTS, BOTH)
- `difficulty`: Enum (B1, B2, C1)

### `Progress`
- `userId`: String
- `wordId`: Int
- `status`: Enum (NEW, LEARNING, MASTERED)
- `nextReview`: DateTime (Spaced Repetition logic)

## 3. MVP Features (The "4 Skills" Loop)

### Reading (Contextual Learning)
- **Component:** `ReadingCard.tsx`
- **Logic:** Display the `exampleSentence` with the target `word` obscured (bolded or blanked out).
- **Action:** User taps to reveal the meaning and Turkish translation.

### Listening (Active Recall)
- **Component:** `AudioQuiz.tsx`
- **Logic:** Auto-play `audioUrl` (or Browser TTS if null).
- **Action:** User types the word they heard.

### Writing (Timed Output)
- **Component:** `TimedEssay.tsx`
- **Logic:** 2-minute timer. Prompt: "Use [Word] in a sentence about [Topic]."
- **Action:** Simple text area. Local storage save.

### Speaking (Shadowing)
- **Component:** `PronunciationRecorder.tsx`
- **Logic:** Browser `MediaRecorder` API.
- **Action:** User records reading the `exampleSentence`. Playback side-by-side with native audio.

## 4. API Routes (Next.js App Router)
- `GET /api/words/daily`: Returns 5 random "NEW" words + 5 "LEARNING" words.
- `POST /api/progress`: Updates the status of a specific word for the user.
- `GET /api/tts`: (Optional) Proxy for Text-to-Speech if browser API fails.

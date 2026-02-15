# 🚀 FluentFocus Setup Guide

This guide will help you set up the FluentFocus MVP from scratch.

## Prerequisites

- Node.js 18+ installed
- A PostgreSQL database (Supabase or Neon recommended)
- Git

## Step 1: Install Dependencies

```bash
cd fluent-focus
npm install
```

This will install:
- **Prisma & @prisma/client**: Database ORM
- **tsx**: TypeScript execution for scripts
- All Next.js, React, and Tailwind dependencies

## Step 2: Database Setup

### Option A: Supabase (Recommended)

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Navigate to **Settings → Database**
3. Copy the **Connection String** (URI format)
4. Make sure to use the **Transaction** connection string, not Session Pooling

### Option B: Neon

1. Go to [neon.tech](https://neon.tech) and create a new project
2. Copy the connection string from the dashboard
3. Neon provides the `pgvector` extension by default

### Option C: Local PostgreSQL

```bash
# Install PostgreSQL locally, then create a database
createdb fluentfocus
```

## Step 3: Configure Environment Variables

1. Copy the example env file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your database URL:
   ```env
   DATABASE_URL="postgresql://user:password@host:5432/fluentfocus?schema=public"
   ```

## Step 4: Initialize Prisma

```bash
# Generate Prisma Client
npm run db:generate

# Push schema to database (for development)
npm run db:push

# OR create a migration (for production)
npm run db:migrate
```

### Understanding the Commands:

- **`db:generate`**: Generates TypeScript types from your Prisma schema
- **`db:push`**: Syncs your schema directly to the database (dev only)
- **`db:migrate`**: Creates versioned migration files (production-ready)
- **`db:studio`**: Opens Prisma Studio GUI to view/edit data

## Step 5: Seed the Database

Run the seeding script to populate your database with sample TOEFL words:

```bash
npm run db:seed
```

This script will:
1. Fetch word data from the **Dictionary API** (definitions, audio, examples)
2. Add mock Turkish translations
3. Insert 10 sample words into your database

Expected output:
```
🌱 Starting database seeding...

📖 Processing: "abate"...
✅ Saved: "abate" (ID: 1)
   Definition: To become less intense or widespread...
   Audio: ✓

...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Seeding complete!
   Success: 10 words
   Failed: 0 words
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Step 6: Verify Database Content

Open Prisma Studio to view your data:

```bash
npm run db:studio
```

This will open `http://localhost:5555` where you can browse:
- **Words table**: See all seeded vocabulary
- **Users table**: (empty for now)
- **Progress table**: (empty for now)

## Step 7: Start the Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

## Step 8: Test the API

Test the daily words endpoint:

```bash
# Get random words (demo mode)
curl http://localhost:3000/api/daily
```

Expected response:
```json
{
  "success": true,
  "data": {
    "newWords": [
      {
        "id": 1,
        "term": "abate",
        "translation": "Azalmak, dinmek",
        "definition": "To become less intense or widespread",
        "exampleSentence": "The storm began to abate.",
        "audioUrl": "https://api.dictionaryapi.dev/media/...",
        "examType": "TOEFL",
        "difficulty": "B2",
        "progressStatus": "NEW"
      }
      // ... 4 more words
    ],
    "reviewWords": [ /* ... */ ]
  },
  "meta": {
    "message": "Demo mode: Random words returned (no user tracking)",
    "totalWords": 10
  }
}
```

## Project Structure

```
fluent-focus/
├── prisma/
│   └── schema.prisma          # Database models & relations
├── scripts/
│   └── seed.ts                # Database seeding script
├── src/
│   └── app/
│       ├── api/
│       │   └── daily/
│       │       └── route.ts   # GET /api/daily endpoint
│       ├── layout.tsx
│       └── page.tsx
├── .env                       # Your secrets (gitignored)
├── .env.example              # Template for others
└── package.json              # Dependencies & scripts
```

## Common Issues & Solutions

### Issue: `Environment variable not found: DATABASE_URL`
**Solution**: Make sure you created `.env` file (not just `.env.example`) and added a valid `DATABASE_URL`.

### Issue: `Error: P1001: Can't reach database server`
**Solution**: 
- Check if your database is running
- Verify the connection string format
- For Supabase: Use the **Transaction** pooling string, not Session

### Issue: Seeding fails with 429 errors
**Solution**: The Dictionary API has rate limits. The script includes a 300ms delay between requests. If it still fails, increase the timeout in `seed.ts`.

### Issue: `Module not found: Can't resolve '@prisma/client'`
**Solution**: Run `npm run db:generate` to generate the Prisma Client.

## Next Steps

Now that your database is set up, you can:

1. **Add Authentication**: Integrate Clerk or NextAuth
2. **Build UI Components**: Create Reading/Listening/Writing/Speaking cards
3. **Implement Progress Tracking**: Build the spaced repetition logic
4. **Add More Words**: Expand the seeding script with full TOEFL/IELTS lists
5. **Deploy**: Push to Vercel with DATABASE_URL as an environment variable

## Useful Commands Reference

```bash
# Development
npm run dev                    # Start dev server
npm run db:studio             # Open database GUI

# Database Management
npm run db:generate           # Generate Prisma Client
npm run db:push              # Sync schema to DB (dev)
npm run db:migrate           # Create migration (prod)
npm run db:seed              # Populate sample data

# Production
npm run build                # Build for production
npm start                    # Start production server
```

## Support

If you encounter any issues:
1. Check the console for error messages
2. Verify your `.env` file is correctly configured
3. Make sure all dependencies are installed (`npm install`)
4. Try deleting `node_modules` and reinstalling

---

**Built with:** Next.js 14 • TypeScript • Prisma • PostgreSQL • Tailwind CSS

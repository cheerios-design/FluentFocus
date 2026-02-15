import { NextResponse } from 'next/server';
import { PrismaClient, ProgressStatus } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * GET /api/daily
 * Returns a selection of words for daily practice
 * - 5 random "NEW" words (words the user hasn't seen yet)
 * - 5 random "LEARNING" words (words due for review)
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    // For MVP: If no userId provided, return random words
    // In production, you'd require authentication
    if (!userId) {
      return await getRandomWords();
    }

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get words based on user's progress
    const userWords = await getUserDailyWords(userId, user.dailyGoal);

    return NextResponse.json({
      success: true,
      data: userWords,
      meta: {
        userId,
        dailyGoal: user.dailyGoal,
        totalWords: userWords.length,
      },
    });
  } catch (error) {
    console.error('Error in /api/daily:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

/**
 * Gets daily words for a specific user based on their progress
 */
async function getUserDailyWords(userId: string, dailyGoal: number) {
  const now = new Date();

  // 1. Get NEW words (words user hasn't started yet)
  const newWordsCount = Math.ceil(dailyGoal * 0.5); // 50% new words
  const reviewWordsCount = Math.floor(dailyGoal * 0.5); // 50% review words

  // Find words that user hasn't encountered yet
  const existingWordIds = await prisma.progress.findMany({
    where: { userId },
    select: { wordId: true },
  });

  const existingIds = existingWordIds.map((p) => p.wordId);

  const newWords = await prisma.word.findMany({
    where: {
      id: {
        notIn: existingIds,
      },
    },
    take: newWordsCount,
    orderBy: {
      id: 'asc', // In production, you might want random or difficulty-based ordering
    },
  });

  // 2. Get LEARNING words (words due for review)
  const reviewWords = await prisma.word.findMany({
    where: {
      progress: {
        some: {
          userId,
          status: ProgressStatus.LEARNING,
          nextReview: {
            lte: now,
          },
        },
      },
    },
    include: {
      progress: {
        where: {
          userId,
        },
        take: 1,
      },
    },
    take: reviewWordsCount,
  });

  // 3. Combine and return
  return {
    newWords: newWords.map((word) => ({
      ...word,
      progressStatus: 'NEW' as const,
    })),
    reviewWords: reviewWords.map((word) => ({
      ...word,
      progressStatus: word.progress[0]?.status || 'LEARNING',
      nextReview: word.progress[0]?.nextReview,
      reviewCount: word.progress[0]?.reviewCount || 0,
    })),
  };
}

/**
 * Fallback: Returns random words when no userId is provided
 * Useful for demos or unauthenticated previews
 */
async function getRandomWords() {
  // Get total count
  const totalWords = await prisma.word.count();

  if (totalWords === 0) {
    return NextResponse.json(
      { error: 'No words in database. Please run the seeding script.' },
      { status: 404 }
    );
  }

  // Get 10 random words (simple approach)
  // For production, consider more sophisticated randomization
  const words = await prisma.word.findMany({
    take: 10,
    orderBy: {
      id: 'asc',
    },
  });

  return NextResponse.json({
    success: true,
    data: {
      newWords: words.slice(0, 5).map((word) => ({
        ...word,
        progressStatus: 'NEW' as const,
      })),
      reviewWords: words.slice(5, 10).map((word) => ({
        ...word,
        progressStatus: 'LEARNING' as const,
      })),
    },
    meta: {
      message: 'Demo mode: Random words returned (no user tracking)',
      totalWords: words.length,
    },
  });
}

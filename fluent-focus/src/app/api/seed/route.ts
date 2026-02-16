import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * GET /api/seed
 * Seeds the database with initial vocabulary data
 * This endpoint should be called once after deployment
 * Consider adding authentication in production
 */
export async function GET(request: Request) {
  try {
    // Check if already seeded
    const wordCount = await prisma.word.count();
    
    if (wordCount > 0) {
      return NextResponse.json({
        success: false,
        message: `Database already seeded with ${wordCount} words`,
        skipReason: 'Words already exist in database',
      });
    }

    // Fetch IELTS words
    console.log('Fetching IELTS words from GitHub...');
    const ieltsResponse = await fetch(
      'https://raw.githubusercontent.com/Aynaabaj/IELTS-1200-Words-Practice/main/words.json'
    );
    const ieltsData = await ieltsResponse.json();
    const ieltsWords = ieltsData.slice(0, 50); // First 50 words

    // Fetch TOEFL words
    console.log('Fetching TOEFL words from GitHub...');
    const toeflResponse = await fetch(
      'https://raw.githubusercontent.com/ladrift/toefl/master/wang_yumei.txt'
    );
    const toeflText = await toeflResponse.text();
    const toeflWords = toeflText
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('#'))
      .slice(0, 50); // First 50 words

    // Mock Turkish translations (in production, use a translation API)
    const mockTranslations: Record<string, string> = {
      abandon: 'terk etmek',
      ability: 'yetenek',
      abstract: 'soyut',
      abundant: 'bol',
      academic: 'akademik',
      accelerate: 'hızlandırmak',
      accept: 'kabul etmek',
      access: 'erişim',
      accommodate: 'barındırmak',
      accomplish: 'başarmak',
    };

    const words = [];
    let successCount = 0;

    // Process IELTS words
    for (const word of ieltsWords) {
      try {
        const dictResponse = await fetch(
          `https://api.dictionaryapi.dev/api/v2/entries/en/${word.word}`
        );
        
        let definition = 'Definition not available';
        let example = 'Example not available';
        let audioUrl = null;

        if (dictResponse.ok) {
          const dictData = await dictResponse.json();
          const firstEntry = dictData[0];
          const firstMeaning = firstEntry?.meanings?.[0];
          
          definition = firstMeaning?.definitions?.[0]?.definition || definition;
          example = firstMeaning?.definitions?.[0]?.example || example;
          audioUrl = firstEntry?.phonetics?.find((p: any) => p.audio)?.audio || null;
        }

        words.push({
          term: word.word,
          translation: mockTranslations[word.word] || word.word,
          definition,
          exampleSentence: example,
          audioUrl,
          examType: 'IELTS',
          difficulty: 'B2',
        });
        successCount++;
        
        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`Failed to process IELTS word: ${word.word}`, error);
      }
    }

    // Process TOEFL words
    for (const term of toeflWords) {
      try {
        const dictResponse = await fetch(
          `https://api.dictionaryapi.dev/api/v2/entries/en/${term}`
        );
        
        let definition = 'Definition not available';
        let example = 'Example not available';
        let audioUrl = null;

        if (dictResponse.ok) {
          const dictData = await dictResponse.json();
          const firstEntry = dictData[0];
          const firstMeaning = firstEntry?.meanings?.[0];
          
          definition = firstMeaning?.definitions?.[0]?.definition || definition;
          example = firstMeaning?.definitions?.[0]?.example || example;
          audioUrl = firstEntry?.phonetics?.find((p: any) => p.audio)?.audio || null;
        }

        words.push({
          term,
          translation: mockTranslations[term] || term,
          definition,
          exampleSentence: example,
          audioUrl,
          examType: 'TOEFL',
          difficulty: 'B2',
        });
        successCount++;
        
        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`Failed to process TOEFL word: ${term}`, error);
      }
    }

    // Insert all words into database
    console.log(`Inserting ${words.length} words into database...`);
    await prisma.word.createMany({
      data: words,
      skipDuplicates: true,
    });

    console.log(`✅ Database seeded successfully with ${words.length} words`);

    return NextResponse.json({
      success: true,
      message: `Database seeded successfully with ${words.length} words`,
      details: {
        ieltsWords: ieltsWords.length,
        toeflWords: toeflWords.length,
        totalInserted: words.length,
        successCount,
      },
    });
  } catch (error) {
    console.error('Seeding error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to seed database',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

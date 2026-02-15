import { PrismaClient, ExamType, Difficulty } from '@prisma/client';

const prisma = new PrismaClient();

// ============================================
// SAMPLE TOEFL WORDS
// ============================================
const SAMPLE_WORDS = [
  { term: 'abate', difficulty: Difficulty.B2 },
  { term: 'benevolent', difficulty: Difficulty.C1 },
  { term: 'candid', difficulty: Difficulty.B2 },
  { term: 'diligent', difficulty: Difficulty.B2 },
  { term: 'ephemeral', difficulty: Difficulty.C1 },
  { term: 'frugal', difficulty: Difficulty.B2 },
  { term: 'gregarious', difficulty: Difficulty.C1 },
  { term: 'hypothesis', difficulty: Difficulty.B2 },
  { term: 'inevitable', difficulty: Difficulty.B2 },
  { term: 'jubilant', difficulty: Difficulty.C1 },
];

// ============================================
// TYPES FOR DICTIONARY API RESPONSE
// ============================================
interface PhoneticData {
  text?: string;
  audio?: string;
}

interface MeaningData {
  partOfSpeech: string;
  definitions: {
    definition: string;
    example?: string;
    synonyms?: string[];
    antonyms?: string[];
  }[];
  synonyms?: string[];
  antonyms?: string[];
}

interface DictionaryResponse {
  word: string;
  phonetic?: string;
  phonetics?: PhoneticData[];
  meanings?: MeaningData[];
  sourceUrls?: string[];
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Fetches word data from the free Dictionary API
 */
async function fetchWordData(word: string): Promise<DictionaryResponse | null> {
  try {
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
    );

    if (!response.ok) {
      console.error(`❌ Failed to fetch data for "${word}": ${response.status}`);
      return null;
    }

    const data = await response.json();
    return data[0] as DictionaryResponse; // API returns an array
  } catch (error) {
    console.error(`❌ Error fetching "${word}":`, error);
    return null;
  }
}

/**
 * Extracts the audio URL from phonetics array
 */
function extractAudioUrl(phonetics?: PhoneticData[]): string | null {
  if (!phonetics || phonetics.length === 0) return null;

  // Prefer US pronunciation, fallback to any available audio
  const usAudio = phonetics.find((p) =>
    p.audio?.includes('-us.') || p.audio?.includes('-us-')
  );
  if (usAudio?.audio) return usAudio.audio;

  const anyAudio = phonetics.find((p) => p.audio && p.audio.length > 0);
  return anyAudio?.audio || null;
}

/**
 * Extracts the first definition and example from meanings
 */
function extractDefinitionAndExample(meanings?: MeaningData[]): {
  definition: string;
  example: string;
} {
  const defaultResponse = {
    definition: 'No definition available.',
    example: 'No example available.',
  };

  if (!meanings || meanings.length === 0) return defaultResponse;

  // Get the first meaning with a definition
  for (const meaning of meanings) {
    if (meaning.definitions && meaning.definitions.length > 0) {
      const firstDef = meaning.definitions[0];
      return {
        definition: firstDef.definition || defaultResponse.definition,
        example: firstDef.example || `This is a ${meaning.partOfSpeech}.`,
      };
    }
  }

  return defaultResponse;
}

/**
 * Placeholder function for Turkish translation
 * TODO: Replace with Google Translate API or similar service
 */
function getTurkishTranslation(word: string): string {
  // Mock translations for demo purposes
  const mockTranslations: Record<string, string> = {
    abate: 'Azalmak, dinmek',
    benevolent: 'İyiliksever, hayırsever',
    candid: 'Açık sözlü, samimi',
    diligent: 'Çalışkan, gayretli',
    ephemeral: 'Geçici, kısa ömürlü',
    frugal: 'Tutumlu, mütevazı',
    gregarious: 'Sosyal, sürü halinde',
    hypothesis: 'Hipotez, varsayım',
    inevitable: 'Kaçınılmaz',
    jubilant: 'Sevinçli, coşkulu',
  };

  return mockTranslations[word.toLowerCase()] || `[Translation for "${word}"]`;
}

// ============================================
// MAIN SEEDING FUNCTION
// ============================================
async function main() {
  console.log('🌱 Starting database seeding...\n');

  let successCount = 0;
  let failCount = 0;

  for (const { term, difficulty } of SAMPLE_WORDS) {
    try {
      console.log(`📖 Processing: "${term}"...`);

      // Fetch word data from Dictionary API
      const wordData = await fetchWordData(term);

      if (!wordData) {
        console.log(`⚠️  Skipping "${term}" (API fetch failed)\n`);
        failCount++;
        continue;
      }

      // Extract relevant data
      const audioUrl = extractAudioUrl(wordData.phonetics);
      const { definition, example } = extractDefinitionAndExample(
        wordData.meanings
      );
      const translation = getTurkishTranslation(term);

      // Upsert to database
      const word = await prisma.word.upsert({
        where: { term: term.toLowerCase() },
        update: {
          translation,
          definition,
          exampleSentence: example,
          audioUrl,
          difficulty,
          examType: ExamType.TOEFL,
        },
        create: {
          term: term.toLowerCase(),
          translation,
          definition,
          exampleSentence: example,
          audioUrl,
          difficulty,
          examType: ExamType.TOEFL,
        },
      });

      console.log(`✅ Saved: "${word.term}" (ID: ${word.id})`);
      console.log(`   Definition: ${definition.substring(0, 60)}...`);
      console.log(`   Audio: ${audioUrl ? '✓' : '✗'}\n`);

      successCount++;

      // Rate limiting: Wait 300ms between requests
      await new Promise((resolve) => setTimeout(resolve, 300));
    } catch (error) {
      console.error(`❌ Error processing "${term}":`, error);
      failCount++;
    }
  }

  console.log('━'.repeat(50));
  console.log(`✅ Seeding complete!`);
  console.log(`   Success: ${successCount} words`);
  console.log(`   Failed: ${failCount} words`);
  console.log('━'.repeat(50));
}

// ============================================
// EXECUTION
// ============================================
main()
  .catch((e) => {
    console.error('Fatal error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

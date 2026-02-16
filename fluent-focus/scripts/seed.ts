import { PrismaClient, ExamType, Difficulty } from '@prisma/client';

/**
 * FluentFocus Database Seeding Script
 * 
 * Fetches vocabulary words from GitHub repositories and enriches them with:
 * - Definitions and examples from Dictionary API (api.dictionaryapi.dev)
 * - Native speaker audio pronunciations
 * - Turkish translations (currently mock, ready for real API)
 * 
 * Data Sources:
 * - IELTS: github.com/Aynaabaj/IELTS-1200-Words-Practice
 * - TOEFL: github.com/ladrift/toefl (Wang Yumei list)
 * 
 * Usage: npm run db:seed
 */

const prisma = new PrismaClient();

// ============================================
// GITHUB DATA SOURCES
// ============================================
const DATA_SOURCES = {
  ielts: {
    url: 'https://raw.githubusercontent.com/Aynaabaj/IELTS-1200-Words-Practice/master/src/assets/data/words.json',
    examType: ExamType.IELTS,
    defaultDifficulty: Difficulty.B2,
  },
  toefl: {
    // Wang Yumei TOEFL list - we'll fetch list_01.txt as a sample
    url: 'https://raw.githubusercontent.com/ladrift/toefl/master/list_01.txt',
    examType: ExamType.TOEFL,
    defaultDifficulty: Difficulty.C1,
  },
};

// Sample fallback words if GitHub fetch fails
const FALLBACK_WORDS = [
  { term: 'abate', difficulty: Difficulty.B2 },
  { term: 'benevolent', difficulty: Difficulty.C1 },
  { term: 'candid', difficulty: Difficulty.B2 },
  { term: 'diligent', difficulty: Difficulty.B2 },
  { term: 'ephemeral', difficulty: Difficulty.C1 },
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
 * Fetches IELTS words from GitHub repository
 */
async function fetchIELTSWords(): Promise<Array<{ term: string; difficulty: Difficulty; examType: ExamType }>> {
  try {
    console.log('📥 Fetching IELTS words from GitHub...');
    const response = await fetch(DATA_SOURCES.ielts.url);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    
    // The IELTS repo structure might vary, adapt based on actual structure
    // Common formats: array of objects with 'word' or 'term' field
    let words: string[] = [];
    
    if (Array.isArray(data)) {
      words = data.map((item: any) => {
        if (typeof item === 'string') return item;
        return item.word || item.term || item.text || '';
      }).filter(Boolean);
    } else if (data.words && Array.isArray(data.words)) {
      words = data.words;
    }

    console.log(`✅ Fetched ${words.length} IELTS words`);
    
    return words.slice(0, 50).map(term => ({ // Limit to 50 for MVP
      term: term.toLowerCase().trim(),
      difficulty: DATA_SOURCES.ielts.defaultDifficulty,
      examType: DATA_SOURCES.ielts.examType,
    }));
  } catch (error) {
    console.error('❌ Failed to fetch IELTS words:', error);
    return [];
  }
}

/**
 * Fetches TOEFL words from GitHub repository (TXT format)
 */
async function fetchTOEFLWords(): Promise<Array<{ term: string; difficulty: Difficulty; examType: ExamType }>> {
  try {
    console.log('📥 Fetching TOEFL words from GitHub...');
    const response = await fetch(DATA_SOURCES.toefl.url);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const text = await response.text();
    
    // Parse TXT file - usually one word per line
    const words = text
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0 && /^[a-zA-Z]+$/.test(line)) // Only alphabetic words
      .map(word => word.toLowerCase());

    console.log(`✅ Fetched ${words.length} TOEFL words`);
    
    return words.slice(0, 50).map(term => ({ // Limit to 50 for MVP
      term,
      difficulty: DATA_SOURCES.toefl.defaultDifficulty,
      examType: DATA_SOURCES.toefl.examType,
    }));
  } catch (error) {
    console.error('❌ Failed to fetch TOEFL words:', error);
    return [];
  }
}

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
  // Mock translations for common TOEFL/IELTS words
  const mockTranslations: Record<string, string> = {
    // Original sample words
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
    
    // Additional common words
    accommodate: 'Barındırmak, uyum sağlamak',
    accurate: 'Doğru, kesin',
    acknowledge: 'Kabul etmek, onaylamak',
    acquire: 'Edinmek, kazanmak',
    advocate: 'Savunmak, desteklemek',
    allocate: 'Ayırmak, tahsis etmek',
    analyze: 'Analiz etmek, incelemek',
    approach: 'Yaklaşmak, yaklaşım',
    appropriate: 'Uygun, yerinde',
    assess: 'Değerlendirmek, ölçmek',
    assume: 'Varsaymak, üstlenmek',
    authority: 'Yetki, otorite',
    benefit: 'Yarar, fayda',
    category: 'Kategori, sınıf',
    circumstance: 'Durum, şart',
    commit: 'Taahhüt etmek, kararlılık göstermek',
    communicate: 'İletişim kurmak',
    concept: 'Kavram, fikir',
    conclude: 'Sonuçlandırmak, bitirmek',
    conduct: 'Yürütmek, davranmak',
    consequence: 'Sonuç, netice',
    consist: 'Oluşmak, ibaret olmak',
    constant: 'Sabit, sürekli',
    constitute: 'Oluşturmak, teşkil etmek',
    construct: 'İnşa etmek, kurmak',
    context: 'Bağlam, durum',
    contribute: 'Katkıda bulunmak',
    demonstrate: 'Göstermek, kanıtlamak',
    derive: 'Türetmek, elde etmek',
    distribute: 'Dağıtmak, paylaştırmak',
    economy: 'Ekonomi, tasarruf',
    environment: 'Çevre, ortam',
    establish: 'Kurmak, tesis etmek',
    estimate: 'Tahmin etmek',
    evident: 'Açık, belli',
    expand: 'Genişletmek, büyümek',
    factor: 'Faktör, etken',
    function: 'İşlev, fonksiyon',
    identify: 'Tanımlamak, belirlemek',
    illustrate: 'Örneklemek, göstermek',
    implement: 'Uygulamak, yerine getirmek',
    imply: 'Ima etmek, anlamına gelmek',
    indicate: 'Göstermek, belirtmek',
  };

  return mockTranslations[word.toLowerCase()] || `[Türkçe: "${word}"]`;
}

// ============================================
// MAIN SEEDING FUNCTION
// ============================================
async function main() {
  console.log('🌱 Starting database seeding from GitHub repositories...\n');
  console.log('📚 Data Sources:');
  console.log('   - IELTS: Aynaabaj/IELTS-1200-Words-Practice');
  console.log('   - TOEFL: ladrift/toefl (Wang Yumei list)\n');

  // Fetch words from GitHub
  const ieltsWords = await fetchIELTSWords();
  const toeflWords = await fetchTOEFLWords();
  
  // Combine all words
  let allWords = [...ieltsWords, ...toeflWords];
  
  // Fallback to sample words if GitHub fetch failed
  if (allWords.length === 0) {
    console.log('⚠️  Using fallback sample words...\n');
    allWords = FALLBACK_WORDS.map(w => ({
      ...w,
      examType: ExamType.TOEFL,
    }));
  }

  console.log(`\n📊 Total words to process: ${allWords.length}\n`);
  console.log('━'.repeat(50));

  let successCount = 0;
  let failCount = 0;

  for (const { term, difficulty, examType } of allWords) {
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
          examType,
        },
        create: {
          term: term.toLowerCase(),
          translation,
          definition,
          exampleSentence: example,
          audioUrl,
          difficulty,
          examType,
        },
      });

      console.log(`✅ Saved: "${word.term}" (${word.examType}, ${word.difficulty})`);
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
  console.log(`   IELTS words: ${ieltsWords.length}`);
  console.log(`   TOEFL words: ${toeflWords.length}`);
  console.log(`   Successfully seeded: ${successCount}`);
  console.log(`   Failed: ${failCount}`);
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


interface Phonetic {
  text?: string;
  audio?: string;
}

interface Definition {
  definition: string;
  example?: string;
  synonyms: string[];
  antonyms: string[];
}

interface Meaning {
  partOfSpeech: string;
  definitions: Definition[];
  synonyms: string[];
  antonyms: string[];
}

export interface WordData {
  word: string;
  phonetics: Phonetic[];
  meanings: Meaning[];
  sourceUrls: string[];
  phonetic?: string;
}

class DictionaryService {
  private baseUrl = 'https://api.dictionaryapi.dev/api/v2/entries/en';

  async searchWord(word: string): Promise<WordData | null> {
    try {
      const response = await fetch(`${this.baseUrl}/${word}`);
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data[0] as WordData;
    } catch (error) {
      console.error('Error fetching word data:', error);
      return null;
    }
  }

  // Get a random word from a curated list for "Word of the Day"
  async getRandomWord(): Promise<WordData | null> {
    const commonWords = [
      'serendipity', 'ephemeral', 'luminous', 'eloquent', 'mellifluous',
      'tranquility', 'ethereal', 'resilience', 'solitude', 'nostalgia',
      'effervescent', 'melancholy', 'whimsical', 'ineffable', 'serene',
      'perennial', 'quintessential', 'resplendent', 'introspection', 'vellichor'
    ];
    
    const randomIndex = Math.floor(Math.random() * commonWords.length);
    const randomWord = commonWords[randomIndex];
    
    return this.searchWord(randomWord);
  }
}

export const dictionaryService = new DictionaryService();

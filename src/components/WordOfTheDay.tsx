
import { useState, useEffect } from 'react';
import { WordData, dictionaryService } from '@/services/DictionaryAPI';
import { getWordOfDay, setWordOfDay, shouldUpdateWordOfDay } from '@/utils/localStorage';
import { CalendarDays, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WordOfTheDayProps {
  onWordSelect: (word: string) => void;
}

const WordOfTheDay = ({ onWordSelect }: WordOfTheDayProps) => {
  const [wordData, setWordData] = useState<WordData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWordOfDay = async () => {
      setLoading(true);
      
      try {
        // Check if we need to update the word of the day
        if (shouldUpdateWordOfDay()) {
          const newWordData = await dictionaryService.getRandomWord();
          if (newWordData) {
            setWordOfDay(newWordData);
            setWordData(newWordData);
          } else {
            // If API fails, use cached word if available
            const cachedWord = getWordOfDay();
            setWordData(cachedWord);
          }
        } else {
          // Use cached word of the day
          const cachedWord = getWordOfDay();
          setWordData(cachedWord);
          
          // If no cached word, fetch a new one
          if (!cachedWord) {
            const newWordData = await dictionaryService.getRandomWord();
            if (newWordData) {
              setWordOfDay(newWordData);
              setWordData(newWordData);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching word of the day:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchWordOfDay();
  }, []);
  
  const handleClick = () => {
    if (wordData) {
      onWordSelect(wordData.word);
    }
  };

  if (loading) {
    return (
      <div className="glass-card rounded-2xl p-6 animate-pulse-gentle">
        <div className="flex items-center gap-2 mb-3">
          <CalendarDays size={20} className="text-dictionary-navy" />
          <h2 className="text-lg font-semibold text-dictionary-navy">Word of the Day</h2>
        </div>
        <div className="h-6 bg-dictionary-lightgray/50 rounded-md w-1/3 mb-2"></div>
        <div className="h-4 bg-dictionary-lightgray/50 rounded-md w-1/4 mb-4"></div>
        <div className="h-20 bg-dictionary-lightgray/50 rounded-md"></div>
      </div>
    );
  }

  if (!wordData) return null;

  // Get first definition for display
  const firstDefinition = wordData.meanings[0]?.definitions[0]?.definition || '';
  const truncatedDefinition = firstDefinition.length > 120 
    ? `${firstDefinition.substring(0, 120)}...` 
    : firstDefinition;

  return (
    <div 
      className={cn(
        "glass-card rounded-2xl p-6 cursor-pointer transition-all duration-300",
        "hover:shadow-md hover:scale-[1.01]"
      )}
      onClick={handleClick}
    >
      <div className="flex items-center gap-2 mb-3">
        <CalendarDays size={20} className="text-dictionary-navy" />
        <h2 className="text-lg font-semibold text-dictionary-navy">Word of the Day</h2>
      </div>
      
      <h3 className="text-2xl font-bold text-dictionary-navy mb-1">{wordData.word}</h3>
      
      {wordData.phonetic && (
        <p className="text-dictionary-gray text-sm mb-3">{wordData.phonetic}</p>
      )}
      
      <p className="text-dictionary-dark">{truncatedDefinition}</p>
      
      <div className="mt-4 flex justify-end">
        <button className="text-dictionary-navy font-medium flex items-center gap-1 hover:underline">
          <span>Learn more</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default WordOfTheDay;

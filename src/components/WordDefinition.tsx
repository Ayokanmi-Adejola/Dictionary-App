
import { useState, useEffect } from 'react';
import { WordData } from '@/services/DictionaryAPI';
import { Star, Volume2, ExternalLink } from 'lucide-react';
import { isWordFavorited, addToFavorites, removeFromFavorites } from '@/utils/localStorage';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface WordDefinitionProps {
  wordData: WordData;
}

const WordDefinition = ({ wordData }: WordDefinitionProps) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Check if the word is favorited
    setIsFavorite(isWordFavorited(wordData.word));
    
    // Find the first available audio
    const audioUrl = wordData.phonetics.find(p => p.audio)?.audio || '';
    if (audioUrl) {
      const audioElement = new Audio(audioUrl);
      setAudio(audioElement);
      
      audioElement.addEventListener('ended', () => {
        setIsPlaying(false);
      });
      
      return () => {
        audioElement.pause();
        audioElement.removeEventListener('ended', () => {
          setIsPlaying(false);
        });
      };
    }
  }, [wordData]);
  
  const toggleFavorite = () => {
    if (isFavorite) {
      removeFromFavorites(wordData.word);
      toast.success(`Removed "${wordData.word}" from favorites`);
    } else {
      addToFavorites(wordData);
      toast.success(`Added "${wordData.word}" to favorites`);
    }
    setIsFavorite(!isFavorite);
  };
  
  const playAudio = () => {
    if (audio && !isPlaying) {
      audio.play();
      setIsPlaying(true);
    }
  };

  return (
    <div className="animate-slide-up">
      <div className="glass-card rounded-2xl p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-dictionary-navy">{wordData.word}</h1>
            {wordData.phonetic && (
              <p className="text-dictionary-gray mt-1">{wordData.phonetic}</p>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            {audio && (
              <button
                onClick={playAudio}
                disabled={isPlaying}
                className={cn(
                  "p-3 rounded-full transition-all duration-300",
                  isPlaying ? "bg-dictionary-blue text-dictionary-navy opacity-70" : "glass-button text-dictionary-navy hover:text-dictionary-navy/70"
                )}
                aria-label="Play pronunciation"
              >
                <Volume2 size={20} />
              </button>
            )}
            
            <button
              onClick={toggleFavorite}
              className={cn(
                "p-3 rounded-full transition-all duration-300",
                isFavorite ? "bg-dictionary-blue text-dictionary-navy" : "glass-button text-dictionary-gray hover:text-dictionary-navy"
              )}
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <Star size={20} fill={isFavorite ? "currentColor" : "none"} />
            </button>
          </div>
        </div>
        
        <div className="space-y-6">
          {wordData.meanings.map((meaning, index) => (
            <div key={index} className="border-t border-dictionary-lightgray pt-4">
              <h2 className="text-xl font-semibold text-dictionary-navy flex items-center">
                <span className="section-title bg-dictionary-blue px-2 py-1 rounded mr-2 text-xs">
                  {meaning.partOfSpeech}
                </span>
              </h2>
              
              <div className="mt-3">
                <h3 className="text-sm uppercase tracking-wider text-dictionary-gray mb-2">Definitions</h3>
                <ul className="space-y-3">
                  {meaning.definitions.map((def, defIndex) => (
                    <li key={defIndex} className="pl-4 border-l-2 border-dictionary-blue">
                      <p className="text-dictionary-dark">{def.definition}</p>
                      {def.example && (
                        <p className="mt-1 text-dictionary-gray italic">"...{def.example}"</p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
              
              {meaning.synonyms.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm uppercase tracking-wider text-dictionary-gray mb-2">Synonyms</h3>
                  <div className="flex flex-wrap gap-2">
                    {meaning.synonyms.slice(0, 5).map((synonym, synIndex) => (
                      <span 
                        key={synIndex} 
                        className="px-3 py-1 rounded-full bg-dictionary-blue/50 text-dictionary-navy text-sm"
                      >
                        {synonym}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {meaning.antonyms.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm uppercase tracking-wider text-dictionary-gray mb-2">Antonyms</h3>
                  <div className="flex flex-wrap gap-2">
                    {meaning.antonyms.slice(0, 5).map((antonym, antIndex) => (
                      <span 
                        key={antIndex} 
                        className="px-3 py-1 rounded-full bg-dictionary-lightgray/50 text-dictionary-dark text-sm"
                      >
                        {antonym}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {wordData.sourceUrls && wordData.sourceUrls.length > 0 && (
          <div className="mt-8 pt-4 border-t border-dictionary-lightgray text-sm text-dictionary-gray">
            <p className="flex items-center gap-1">
              <span></span>
              <a 
                href={wordData.sourceUrls[0]} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-dictionary-navy underline flex items-center gap-1 hover:text-dictionary-navy/70 transition-colors"
              >
                {wordData.sourceUrls[0]}
                <ExternalLink size={14} />
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WordDefinition;

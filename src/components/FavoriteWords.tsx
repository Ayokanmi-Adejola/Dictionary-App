
import { useState, useEffect } from 'react';
import { WordData } from '@/services/DictionaryAPI';
import { Star, Trash2, ChevronRight } from 'lucide-react';
import { getFavorites, removeFromFavorites } from '@/utils/localStorage';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface FavoriteWordsProps {
  onWordSelect: (word: string) => void;
}

const FavoriteWords = ({ onWordSelect }: FavoriteWordsProps) => {
  const [favorites, setFavorites] = useState<WordData[]>([]);
  
  useEffect(() => {
    setFavorites(getFavorites());
  }, []);
  
  const handleRemove = (e: React.MouseEvent, word: string) => {
    e.stopPropagation();
    removeFromFavorites(word);
    setFavorites(getFavorites());
    toast.success(`Removed "${word}" from favorites`);
  };

  if (favorites.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-6 text-center">
        <Star size={24} className="text-dictionary-gray mx-auto mb-2" />
        <h2 className="text-lg font-semibold text-dictionary-navy mb-2">No favorites yet</h2>
        <p className="text-dictionary-gray">
          When you find words you love, star them to save them here
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl">
      <div className="p-4 border-b border-dictionary-lightgray">
        <h2 className="flex items-center gap-2 font-semibold text-dictionary-navy">
          <Star size={18} fill="currentColor" className="text-dictionary-navy" />
          <span>Favorites</span>
          <span className="ml-1 px-2 py-0.5 rounded-full bg-dictionary-blue text-dictionary-navy text-xs">
            {favorites.length}
          </span>
        </h2>
      </div>
      
      <ul className="divide-y divide-dictionary-lightgray/60">
        {favorites.map((favorite) => {
          // Get first definition for display
          const firstDefinition = favorite.meanings[0]?.definitions[0]?.definition || '';
          const truncatedDefinition = firstDefinition.length > 90 
            ? `${firstDefinition.substring(0, 90)}...` 
            : firstDefinition;
          
          return (
            <li 
              key={favorite.word}
              className={cn(
                "p-4 cursor-pointer transition-all duration-200 hover:bg-dictionary-blue/10",
                "flex items-center justify-between"
              )}
              onClick={() => onWordSelect(favorite.word)}
            >
              <div className="flex-1 mr-4">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium text-dictionary-navy">{favorite.word}</h3>
                  {favorite.phonetic && (
                    <span className="text-sm text-dictionary-gray">{favorite.phonetic}</span>
                  )}
                </div>
                <p className="text-sm text-dictionary-gray">{truncatedDefinition}</p>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => handleRemove(e, favorite.word)}
                  className="p-2 rounded-full hover:bg-dictionary-lightgray/50 transition-colors text-dictionary-gray hover:text-red-500"
                  aria-label="Remove from favorites"
                >
                  <Trash2 size={16} />
                </button>
                <ChevronRight size={18} className="text-dictionary-gray" />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default FavoriteWords;

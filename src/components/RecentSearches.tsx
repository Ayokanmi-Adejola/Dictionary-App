
import { useState, useEffect } from 'react';
import { Clock, X, ChevronRight, Trash } from 'lucide-react';
import { getRecentSearches, clearRecentSearches } from '@/utils/localStorage';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface RecentSearchesProps {
  onWordSelect: (word: string) => void;
}

const RecentSearches = ({ onWordSelect }: RecentSearchesProps) => {
  const [searches, setSearches] = useState<string[]>([]);
  
  useEffect(() => {
    setSearches(getRecentSearches());
  }, []);
  
  const handleClearAll = () => {
    clearRecentSearches();
    setSearches([]);
    toast.success('Search history cleared');
  };

  if (searches.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-6 text-center">
        <Clock size={24} className="text-dictionary-gray mx-auto mb-2" />
        <h2 className="text-lg font-semibold text-dictionary-navy mb-2">No recent searches</h2>
        <p className="text-dictionary-gray">
          Your search history will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl">
      <div className="p-4 border-b border-dictionary-lightgray flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-semibold text-dictionary-navy">
          <Clock size={18} className="text-dictionary-navy" />
          <span>Recent Searches</span>
          <span className="ml-1 px-2 py-0.5 rounded-full bg-dictionary-blue text-dictionary-navy text-xs">
            {searches.length}
          </span>
        </h2>
        
        <button
          onClick={handleClearAll}
          className="text-sm text-dictionary-gray hover:text-dictionary-navy flex items-center gap-1 transition-colors"
        >
          <Trash size={14} />
          <span>Clear all</span>
        </button>
      </div>
      
      <ul className="divide-y divide-dictionary-lightgray/60">
        {searches.map((word) => (
          <li 
            key={word}
            className={cn(
              "p-4 cursor-pointer transition-all duration-200 hover:bg-dictionary-blue/10",
              "flex items-center justify-between"
            )}
            onClick={() => onWordSelect(word)}
          >
            <span className="font-medium text-dictionary-navy">{word}</span>
            <ChevronRight size={18} className="text-dictionary-gray" />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentSearches;

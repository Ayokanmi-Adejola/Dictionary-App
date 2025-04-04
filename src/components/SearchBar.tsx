
import { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  onSearch: (query: string) => void;
  initialValue?: string;
  placeholder?: string;
}

const SearchBar = ({ 
  onSearch, 
  initialValue = '', 
  placeholder = 'Search for a word...' 
}: SearchBarProps) => {
  const [query, setQuery] = useState(initialValue);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleClear = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className={cn(
        "relative w-full max-w-2xl mx-auto transition-all duration-300 ease-in-out",
        "bg-white rounded-2xl shadow-sm border border-dictionary-lightgray/50",
        isFocused ? "shadow-md border-dictionary-blue/50 scale-[1.01]" : "hover:shadow-md hover:scale-[1.005]"
      )}
    >
      <div className="flex items-center px-4 py-3">
        <Search 
          size={20} 
          className={cn(
            "text-dictionary-gray transition-colors duration-300 mr-2",
            isFocused ? "text-dictionary-navy" : ""
          )} 
        />
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="flex-1 bg-transparent border-none outline-none text-dictionary-dark placeholder:text-dictionary-gray/70"
          autoComplete="off"
        />
        
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="p-1 rounded-full hover:bg-dictionary-lightgray/30 transition-colors"
            aria-label="Clear search"
          >
            <X size={18} className="text-dictionary-gray" />
          </button>
        )}
      </div>
      
      <button 
        type="submit" 
        className="absolute inset-y-0 right-0 px-6 m-1 rounded-xl bg-dictionary-navy text-white font-medium hover:bg-opacity-90 transition-colors"
        disabled={!query.trim()}
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;

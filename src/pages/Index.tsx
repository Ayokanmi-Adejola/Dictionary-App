
import { useState, useEffect } from 'react';
import { dictionaryService, WordData } from '@/services/DictionaryAPI';
import { addToRecentSearches } from '@/utils/localStorage';
import Navbar from '@/components/Navbar';
import SearchBar from '@/components/SearchBar';
import WordDefinition from '@/components/WordDefinition';
import WordOfTheDay from '@/components/WordOfTheDay';
import RecentSearches from '@/components/RecentSearches';
import { Book, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [wordData, setWordData] = useState<WordData | null>(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const searchWord = async (word: string) => {
    if (!word.trim()) return;
    
    setSearchQuery(word);
    setLoading(true);
    setNotFound(false);
    
    try {
      const data = await dictionaryService.searchWord(word);
      
      if (data) {
        setWordData(data);
        addToRecentSearches(word);
      } else {
        setWordData(null);
        setNotFound(true);
        toast.error(`No definitions found for "${word}"`);
      }
    } catch (error) {
      console.error('Error searching for word:', error);
      toast.error('An error occurred while searching');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dictionary-white to-dictionary-blue/30 pb-16">
      <Navbar />
      
      <main className="dict-container pt-24">
        <SearchBar 
          onSearch={searchWord} 
          initialValue={searchQuery} 
        />
        
        {loading ? (
          <div className="glass-card rounded-2xl p-8 mt-8 text-center animate-pulse-gentle">
            <Book size={40} className="text-dictionary-navy/30 mx-auto mb-4" />
            <p className="text-dictionary-gray text-lg">Looking up definition...</p>
          </div>
        ) : notFound ? (
          <div className="glass-card rounded-2xl p-8 mt-8 text-center animate-fade-in">
            <AlertCircle size={40} className="text-dictionary-gray mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-dictionary-navy mb-2">
              No definitions found
            </h2>
            <p className="text-dictionary-gray">
              We couldn't find definitions for "{searchQuery}". 
              <br />
              Please check the spelling or try another word.
            </p>
          </div>
        ) : wordData ? (
          <WordDefinition wordData={wordData} />
        ) : (
          <div className="mt-8 space-y-8 animate-fade-in">
            <WordOfTheDay onWordSelect={searchWord} />
            <RecentSearches onWordSelect={searchWord} />
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;

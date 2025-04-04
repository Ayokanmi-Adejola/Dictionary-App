
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import RecentSearches from '@/components/RecentSearches';
import { Clock } from 'lucide-react';

const History = () => {
  const navigate = useNavigate();
  
  const handleWordSelect = (word: string) => {
    navigate('/', { state: { searchWord: word } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dictionary-white to-dictionary-blue/30 pb-16">
      <Navbar />
      
      <main className="dict-container pt-24">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-dictionary-blue rounded-full mb-4">
            <Clock size={24} className="text-dictionary-navy" />
          </div>
          <h1 className="text-3xl font-bold text-dictionary-navy mb-2">Search History</h1>
          <p className="text-dictionary-gray max-w-md mx-auto">
            Words you've recently looked up
          </p>
        </div>
        
        <RecentSearches onWordSelect={handleWordSelect} />
      </main>
    </div>
  );
};

export default History;

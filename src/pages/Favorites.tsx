
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dictionaryService } from '@/services/DictionaryAPI';
import Navbar from '@/components/Navbar';
import FavoriteWords from '@/components/FavoriteWords';
import { Star } from 'lucide-react';

const Favorites = () => {
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
            <Star size={24} className="text-dictionary-navy" />
          </div>
          <h1 className="text-3xl font-bold text-dictionary-navy mb-2">Favorite Words</h1>
          <p className="text-dictionary-gray max-w-md mx-auto">
            Your personal collection of words that you've marked as favorites
          </p>
        </div>
        
        <FavoriteWords onWordSelect={handleWordSelect} />
      </main>
    </div>
  );
};

export default Favorites;

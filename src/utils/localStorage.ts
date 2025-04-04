import { WordData } from "../services/DictionaryAPI";

const FAVORITES_KEY = 'ayokanmi-dict-favorites';
const RECENT_SEARCHES_KEY = 'ayokanmi-dict-recent-searches';
const WORD_OF_DAY_KEY = 'ayokanmi-dict-word-of-day';
const WORD_OF_DAY_DATE_KEY = 'ayokanmi-dict-word-of-day-date';

// Favorites management
export const getFavorites = (): WordData[] => {
  const favoritesJson = localStorage.getItem(FAVORITES_KEY);
  return favoritesJson ? JSON.parse(favoritesJson) : [];
};

export const addToFavorites = (word: WordData): void => {
  const favorites = getFavorites();
  const exists = favorites.some(fav => fav.word === word.word);
  
  if (!exists) {
    favorites.push(word);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }
};

export const removeFromFavorites = (word: string): void => {
  const favorites = getFavorites();
  const updatedFavorites = favorites.filter(fav => fav.word !== word);
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
};

export const isWordFavorited = (word: string): boolean => {
  const favorites = getFavorites();
  return favorites.some(fav => fav.word === word);
};

// Recent searches management
export const getRecentSearches = (): string[] => {
  const searchesJson = localStorage.getItem(RECENT_SEARCHES_KEY);
  return searchesJson ? JSON.parse(searchesJson) : [];
};

export const addToRecentSearches = (word: string): void => {
  const searches = getRecentSearches();
  
  // Remove the word if it already exists to avoid duplicates
  const filteredSearches = searches.filter(s => s !== word);
  
  // Add the word to the beginning of the array
  filteredSearches.unshift(word);
  
  // Keep only the 10 most recent searches
  const updatedSearches = filteredSearches.slice(0, 10);
  
  localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updatedSearches));
};

export const clearRecentSearches = (): void => {
  localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify([]));
};

// Word of the day management
export const getWordOfDay = (): WordData | null => {
  const wordJson = localStorage.getItem(WORD_OF_DAY_KEY);
  return wordJson ? JSON.parse(wordJson) : null;
};

export const setWordOfDay = (word: WordData): void => {
  localStorage.setItem(WORD_OF_DAY_KEY, JSON.stringify(word));
  localStorage.setItem(WORD_OF_DAY_DATE_KEY, new Date().toDateString());
};

export const shouldUpdateWordOfDay = (): boolean => {
  const lastUpdated = localStorage.getItem(WORD_OF_DAY_DATE_KEY);
  return !lastUpdated || lastUpdated !== new Date().toDateString();
};

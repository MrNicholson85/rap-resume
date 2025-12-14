'use client';

import { useState } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export default function SearchBar({ onSearch, placeholder = 'Search for rap artists...' }: SearchBarProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="flex-1 px-4 py-3 bg-white dark:bg-[#2e2e2e] border-2 border-[#e0e0e0] dark:border-[#464646] text-[#1F1F1F] dark:text-white placeholder-[#464646] dark:placeholder-[#e0e0e0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF4500] dark:focus:ring-[#FFD700] focus:border-[#FF4500] dark:focus:border-[#FFD700] transition-colors"
        />
        <button
          type="submit"
          className="px-6 py-3 bg-[#FF4500] hover:bg-[#ff7b3a] dark:bg-[#ff7b3a] dark:hover:bg-[#FFD700] text-white font-semibold rounded-lg transition-colors shadow-md"
        >
          Search
        </button>
      </div>
    </form>
  );
}

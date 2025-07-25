import InputField from '../common/InputField';
import { useState, useEffect, useCallback } from 'react';
import { Search } from 'lucide-react'; // ✅ Lucide icon

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const debouncedSearch = useCallback(() => {
    const handler = setTimeout(() => {
      onSearch(query);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [query, onSearch]);

  useEffect(() => {
    const cleanup = debouncedSearch();
    return cleanup;
  }, [debouncedSearch]);

  return (
    <InputField
      id="search"
      type="text"
      placeholder="Search by title or tag..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      className="w-full md:max-w-xs input-glass rounded-lg text-base py-2.5 pl-10"
      icon={<Search className="w-4 h-4" />}
    />
  );
};

export default SearchBar;

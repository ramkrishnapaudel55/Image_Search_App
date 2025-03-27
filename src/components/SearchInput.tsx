
import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Search, X } from 'lucide-react';

interface SearchInputProps {
  onSearch: (query: string) => void;
  initialQuery?: string;
  placeholder?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({
  onSearch,
  initialQuery = '',
  placeholder = 'Search for images...'
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleClear = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className={cn(
        "relative w-full max-w-2xl mx-auto transition-all duration-300",
        "glass rounded-full overflow-hidden",
        "shadow-sm hover:shadow-md",
        isFocused ? "shadow-md ring-2 ring-primary/20" : ""
      )}
    >
      <div className="flex items-center h-14 px-4">
        <Search className="h-5 w-5 text-muted-foreground mr-2 flex-shrink-0" />
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={cn(
            "flex-1 bg-transparent border-none h-full focus:outline-none",
            "placeholder:text-muted-foreground text-foreground",
            "text-lg"
          )}
        />
        
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="flex-shrink-0 mr-1 p-1 rounded-full hover:bg-muted transition-colors"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        )}
        
        <button
          type="submit"
          className={cn(
            "flex-shrink-0 ml-1 px-6 py-2 rounded-full",
            "bg-primary text-primary-foreground",
            "font-medium transition-all hover:brightness-110",
            "focus:outline-none focus:ring-2 focus:ring-primary/20",
            "text-sm"
          )}
        >
          Search
        </button>
      </div>
    </form>
  );
};

export default SearchInput;

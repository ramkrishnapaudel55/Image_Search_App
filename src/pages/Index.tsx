
import React, { useState, useEffect, useCallback } from 'react';
import SearchInput from '@/components/SearchInput';
import ImageGrid from '@/components/ImageGrid';
import { useImageSearch } from '@/hooks/useImageSearch';
import { cn } from '@/lib/utils';

const Index: React.FC = () => {
  const { 
    query, 
    images, 
    isLoading, 
    error, 
    searchResult, 
    handleSearch, 
    loadMore 
  } = useImageSearch();
  
  const [hasScrolled, setHasScrolled] = useState(false);

  // Handle scroll events to shrink header on scroll
  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <header 
        className={cn(
          "fixed top-0 inset-x-0 z-50 transition-all duration-500",
          "bg-white/70 backdrop-blur-lg border-b border-gray-100/80",
          hasScrolled ? "py-4" : "py-6"
        )}
      >
        <div className="container max-w-6xl mx-auto px-4">
          <div className="flex flex-col items-center justify-center">
            <h1 
              className={cn(
                "text-4xl font-bold tracking-tight text-primary transition-all duration-300",
                hasScrolled ? "text-3xl mb-2" : "text-4xl mb-4"
              )}
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600">
                Pic-Keyword-Quest
              </span>
            </h1>
            
            <div 
              className={cn(
                "w-full transition-all duration-300",
                hasScrolled ? "max-w-xl" : "max-w-2xl"
              )}
            >
              <SearchInput 
                onSearch={handleSearch} 
                initialQuery={query}
                placeholder="Search for beautiful images..."
              />
            </div>
          </div>
        </div>
      </header>

      <main className={cn(
        "container max-w-6xl mx-auto px-4 pt-40 pb-16 transition-all duration-300",
        hasScrolled ? "pt-36" : "pt-48"
      )}>
        {searchResult && searchResult.total > 0 && (
          <div className="text-center mb-6 animate-fade-in">
            <p className="text-muted-foreground">
              Found <span className="font-medium text-foreground">{searchResult.total.toLocaleString()}</span> results for <span className="font-medium text-foreground">"{query}"</span>
            </p>
          </div>
        )}

        {error && !isLoading && (
          <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg mb-6 animate-fade-in">
            {error}
          </div>
        )}

        <ImageGrid 
          images={images} 
          isLoading={isLoading} 
          onLoadMore={loadMore} 
        />

        {images.length === 0 && isLoading && (
          <div className="flex flex-col items-center justify-center h-64 animate-pulse">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-lg font-medium text-muted-foreground">Loading images...</p>
          </div>
        )}
      </main>

      <footer className="border-t border-gray-100 py-6 text-center text-sm text-muted-foreground">
        <div className="container max-w-6xl mx-auto px-4">
          <p>Images powered by Unsplash API</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;

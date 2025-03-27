
import { useState, useEffect, useCallback } from 'react';
import { searchImages, getTrendingImages, UnsplashImage, SearchResult } from '../services/unsplash';
import { useToast } from '@/components/ui/use-toast';

export function useImageSearch() {
  const [query, setQuery] = useState<string>('');
  const [images, setImages] = useState<UnsplashImage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [page, setPage] = useState<number>(1);
  const { toast } = useToast();

  const fetchImages = useCallback(async (searchQuery: string, pageNum: number = 1) => {
    if (!searchQuery.trim() && pageNum === 1) {
      return fetchTrendingImages();
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await searchImages(searchQuery, pageNum);
      setSearchResult(result);
      
      if (pageNum === 1) {
        setImages(result.results);
      } else {
        setImages(prev => [...prev, ...result.results]);
      }
      
      if (result.results.length === 0 && pageNum === 1) {
        setError('No images found for this search term.');
        toast({
          title: "No results found",
          description: "Try a different search term",
        });
      }
    } catch (err) {
      setError('An error occurred while fetching images.');
      toast({
        title: "Error",
        description: "Failed to load images. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const fetchTrendingImages = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const trendingImages = await getTrendingImages();
      setImages(trendingImages);
    } catch (err) {
      setError('An error occurred while fetching trending images.');
      toast({
        title: "Error",
        description: "Failed to load trending images. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const handleSearch = useCallback((searchQuery: string) => {
    setQuery(searchQuery);
    setPage(1);
    fetchImages(searchQuery, 1);
  }, [fetchImages]);

  const loadMore = useCallback(() => {
    if (isLoading) return;
    const nextPage = page + 1;
    setPage(nextPage);
    fetchImages(query, nextPage);
  }, [fetchImages, isLoading, page, query]);

  useEffect(() => {
    // Load trending images on initial load
    fetchTrendingImages();
  }, [fetchTrendingImages]);

  return {
    query,
    images,
    isLoading,
    error,
    searchResult,
    handleSearch,
    loadMore
  };
}

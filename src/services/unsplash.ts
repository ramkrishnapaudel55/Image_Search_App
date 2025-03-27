
const UNSPLASH_API_URL = 'https://api.unsplash.com';
const UNSPLASH_ACCESS_KEY = 'ff5rDROvnyChEXWKvbu-09D9UBL3neCcvjRoFMNphic'; // Replace with actual access key

export interface UnsplashImage {
  id: string;
  created_at: string;
  updated_at: string;
  width: number;
  height: number;
  color: string;
  blur_hash: string;
  likes: number;
  liked_by_user: boolean;
  description: string | null;
  alt_description: string | null;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  user: {
    id: string;
    username: string;
    name: string;
    portfolio_url: string | null;
    profile_image: {
      small: string;
      medium: string;
      large: string;
    };
  };
}

export interface SearchResult {
  total: number;
  total_pages: number;
  results: UnsplashImage[];
}

export const searchImages = async (query: string, page: number = 1, perPage: number = 30): Promise<SearchResult> => {
  try {
    const response = await fetch(
      `${UNSPLASH_API_URL}/search/photos?query=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}`,
      {
        headers: {
          Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to search images:', error);
    return { total: 0, total_pages: 0, results: [] };
  }
};

export const getTrendingImages = async (count: number = 30): Promise<UnsplashImage[]> => {
  try {
    const response = await fetch(
      `${UNSPLASH_API_URL}/photos/random?count=${count}`,
      {
        headers: {
          Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch trending images:', error);
    return [];
  }
};

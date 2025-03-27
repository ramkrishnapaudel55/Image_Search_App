
import React from 'react';
import { UnsplashImage } from '../services/unsplash';
import ImageCard from './ImageCard';
import { cn } from '@/lib/utils';

interface ImageGridProps {
  images: UnsplashImage[];
  isLoading: boolean;
  onLoadMore: () => void;
}

const ImageGrid: React.FC<ImageGridProps> = ({ images, isLoading, onLoadMore }) => {
  // Create a ref for the last image element to detect when to load more
  const observer = React.useRef<IntersectionObserver | null>(null);
  const lastImageRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          onLoadMore();
        }
      });
      
      if (node) observer.current.observe(node);
    },
    [isLoading, onLoadMore]
  );

  // Split images into columns for masonry layout
  const columns = React.useMemo(() => {
    const cols: UnsplashImage[][] = [[], [], []];
    
    images.forEach((image, index) => {
      const columnIndex = index % 3;
      cols[columnIndex].push(image);
    });
    
    return cols;
  }, [images]);

  if (images.length === 0 && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
        <p className="text-lg font-medium">No images found</p>
        <p className="text-sm">Try a different search term</p>
      </div>
    );
  }

  return (
    <div className="py-8 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {columns.map((column, colIndex) => (
          <div key={colIndex} className="flex flex-col gap-6">
            {column.map((image, imgIndex) => {
              const isLastImage = colIndex === 2 && imgIndex === column.length - 1 && colIndex * column.length + imgIndex === images.length - 1;
              
              return (
                <div
                  key={image.id}
                  ref={isLastImage ? lastImageRef : null}
                  className={cn(
                    "animate-scale-in",
                    `animation-delay-${(colIndex * column.length + imgIndex) % 5}`
                  )}
                  style={{ 
                    animationDelay: `${(colIndex * column.length + imgIndex) % 5 * 50}ms` 
                  }}
                >
                  <ImageCard image={image} priority={imgIndex < 3} />
                </div>
              );
            })}
          </div>
        ))}
      </div>
      
      {isLoading && (
        <div className="flex justify-center mt-8">
          <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default ImageGrid;

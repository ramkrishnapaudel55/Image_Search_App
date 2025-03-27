
import React, { useState, useRef, useEffect } from 'react';
import { UnsplashImage } from '../services/unsplash';
import { cn } from '@/lib/utils';

interface ImageCardProps {
  image: UnsplashImage;
  priority?: boolean;
}

const ImageCard: React.FC<ImageCardProps> = ({ image, priority = false }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    
    if (imgRef.current) {
      observer.observe(imgRef.current);
    }
    
    return () => {
      observer.disconnect();
    };
  }, []);

  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  // Calculate aspect ratio for the card
  const aspectRatio = image.height / image.width;
  const cardHeight = Math.round(aspectRatio * 100);

  return (
    <div 
      className={cn(
        "relative overflow-hidden rounded-lg shadow-md transition-all duration-300",
        "hover:shadow-lg hover:transform hover:scale-[1.02] image-card-animation",
        "flex flex-col bg-card"
      )}
      style={{ paddingBottom: `${cardHeight}%` }}
    >
      <div className="absolute inset-0 flex flex-col">
        <div className="relative overflow-hidden flex-grow">
          {(isVisible || priority) && (
            <img
              ref={imgRef}
              src={image.urls.regular}
              alt={image.alt_description || 'Unsplash Image'}
              onLoad={handleImageLoad}
              className={cn(
                "w-full h-full object-cover transition-opacity duration-500",
                isLoaded ? "opacity-100" : "opacity-0",
                "animate-blur-in"
              )}
            />
          )}
          
          {!isLoaded && (
            <div className="absolute inset-0 bg-muted animate-pulse" 
              style={{ backgroundColor: image.color || '#f3f4f6' }}>
            </div>
          )}
          
          <div className={cn(
            "absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent",
            "opacity-0 group-hover:opacity-100 transition-opacity duration-300",
            "flex items-end justify-between text-white"
          )}>
            <div className="flex items-center space-x-2">
              {image.user.profile_image.small && (
                <img 
                  src={image.user.profile_image.small} 
                  alt={image.user.name}
                  className="w-6 h-6 rounded-full"
                />
              )}
              <span className="text-sm font-medium truncate">{image.user.name}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageCard;

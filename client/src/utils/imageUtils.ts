/**
 * Utility functions for handling image URLs consistently across the application
 */

// Get the base URL for images based on environment
const getImageBaseUrl = (): string => {
  // Check if we're in development
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return 'http://localhost:3001';
  }
  
  // Production fallback
  return 'https://moezbinz.onrender.com';
};

/**
 * Constructs a proper image URL from database image path
 * @param imagePath - The image path from database (e.g., "/uploads/products/image.jpg" or "https://...")
 * @param fallback - Fallback image path if imagePath is invalid
 * @returns Complete image URL
 */
export const getImageUrl = (imagePath?: string | null, fallback: string = '/uploads/placeholder.jpg'): string => {
  // If no image path provided, return fallback
  if (!imagePath) {
    return `${getImageBaseUrl()}${fallback}`;
  }

  // If it's already a complete URL (starts with http), return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  // If it starts with '/uploads', it's already a proper path
  if (imagePath.startsWith('/uploads')) {
    return `${getImageBaseUrl()}${imagePath}`;
  }

  // If it doesn't start with '/', assume it's a relative path and add '/uploads/'
  if (!imagePath.startsWith('/')) {
    return `${getImageBaseUrl()}/uploads/${imagePath}`;
  }

  // Default case: prepend base URL
  return `${getImageBaseUrl()}${imagePath}`;
};

/**
 * Gets product image URL with proper fallback
 */
export const getProductImageUrl = (imagePath?: string | null): string => {
  return getImageUrl(imagePath, '/uploads/products/placeholder.jpg');
};

/**
 * Gets news image URL with proper fallback
 */
export const getNewsImageUrl = (imagePath?: string | null): string => {
  return getImageUrl(imagePath, '/uploads/news/placeholder.jpg');
};

/**
 * Gets auction image URL with proper fallback
 */
export const getAuctionImageUrl = (imagePath?: string | null): string => {
  return getImageUrl(imagePath, '/uploads/products/placeholder.jpg');
};

/**
 * Gets user avatar URL with proper fallback
 */
export const getUserAvatarUrl = (imagePath?: string | null): string => {
  return getImageUrl(imagePath, '/uploads/users/default-avatar.jpg');
};

/**
 * Checks if an image URL is valid
 */
export const isValidImageUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Handles image error by setting fallback image
 */
export const handleImageError = (
  e: React.SyntheticEvent<HTMLImageElement, Event>,
  fallbackSrc: string = '/uploads/placeholder.jpg'
) => {
  const target = e.target as HTMLImageElement;
  const fallbackUrl = `${getImageBaseUrl()}${fallbackSrc}`;
  
  if (target.src !== fallbackUrl) {
    target.src = fallbackUrl;
  }
};

import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { getAllMedia, getMediaByType, filterMedia, type Media } from '@lotus/api-client';

interface UseMediaOptions {
  type?: 'video' | 'image' | 'audio';
  uploadedBy?: string;
  minSize?: number;
  maxSize?: number;
}

export const useMedia = (options: UseMediaOptions = {}) => {
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        setLoading(true);
        setError(null);

        let result: Media[];

        // If we have a type filter, use getMediaByType
        if (options.type) {
          result = await getMediaByType(db, options.type);
        } else if (options.uploadedBy || options.minSize || options.maxSize) {
          // If we have other filters, use filterMedia
          result = await filterMedia(db, options);
        } else {
          // Otherwise get all media
          result = await getAllMedia(db);
        }

        setMedia(result);
      } catch (err) {
        console.error('Error fetching media:', err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchMedia();
  }, [options.type, options.uploadedBy, options.minSize, options.maxSize]);

  return { media, loading, error, refetch: () => {} };
};

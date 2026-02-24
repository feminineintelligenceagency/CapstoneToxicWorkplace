import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UploadProgress {
  loaded: number;
  total: number;
}

export const useS3Upload = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<UploadProgress | null>(null);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = async (file: File, path: string): Promise<string | null> => {
    setUploading(true);
    setError(null);
    setProgress({ loaded: 0, total: file.size });

    try {
      // Upload directly to Supabase Storage (no backend needed)
      const { data, error: uploadError } = await supabase.storage
        .from('assets')
        .upload(path, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        setError(uploadError.message);
        return null;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('assets')
        .getPublicUrl(path);

      setProgress({ loaded: file.size, total: file.size });
      return publicUrl;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Upload failed';
      setError(message);
      return null;
    } finally {
      setUploading(false);
      setProgress(null);
    }
  };

  return {
    uploadFile,
    uploading,
    progress,
    error,
  };
};


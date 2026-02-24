import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ScenarioAsset {
  type: 'image' | 'video' | 'document';
  name: string;
  url: string;
}

export const useScenarioAssets = (scenarioIndex: number) => {
  const [assets, setAssets] = useState<ScenarioAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        setLoading(true);
        setError(null);

        // List all files in the scenario folder
        const { data, error: listError } = await supabase.storage
          .from('assets')
          .list(`scenario-${scenarioIndex}`);

        if (listError) {
          // Bucket or folder doesn't exist yet - return empty list
          setAssets([]);
          setLoading(false);
          return;
        }

        if (!data || data.length === 0) {
          setAssets([]);
          setLoading(false);
          return;
        }

        // Filter out folders and get file details
        const files = data.filter(item => !item.id.startsWith('.') && item.name);

        // Get public URLs for each file
        const scenarioAssets: ScenarioAsset[] = files.map(file => {
          const filePath = `scenario-${scenarioIndex}/${file.name}`;
          const { data: { publicUrl } } = supabase.storage
            .from('assets')
            .getPublicUrl(filePath);

          // Determine file type from extension
          const ext = file.name.toLowerCase().split('.').pop() || '';
          let type: 'image' | 'video' | 'document' = 'document';

          if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) {
            type = 'image';
          } else if (['mp4', 'webm', 'mov'].includes(ext)) {
            type = 'video';
          }

          return {
            type,
            name: file.name,
            url: publicUrl,
          };
        });

        setAssets(scenarioAssets);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch assets';
        setError(message);
        setAssets([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAssets();
  }, [scenarioIndex]);

  return { assets, loading, error };
};

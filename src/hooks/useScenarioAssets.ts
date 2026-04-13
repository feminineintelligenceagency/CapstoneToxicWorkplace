import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { validateAndNormalizeUrl, escapeHtml } from "@/lib/linkSanitize";

export interface ScenarioAsset {
  type: "image" | "video" | "audio" | "document" | "link";
  name: string;
  url: string;
  storagePath: string;
  uploadedAt?: string;
}

export const useScenarioAssets = (scenarioId?: string) => {
  const [assets, setAssets] = useState<ScenarioAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAssets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // List all files in the scenario folder
      if (!scenarioId) {
        setAssets([]);
        setLoading(false);
        return;
      }

      const { data, error: listError } = await supabase.storage
        .from("assets")
        .list(`scenario-${scenarioId}`);

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
      const files = data.filter(
        (item) => !item.id.startsWith(".") && item.name,
      );

      // Get public URLs for each file
      const scenarioAssetsWithNulls = await Promise.all(
        files.map(async (file) => {
          const filePath = `scenario-${scenarioId}/${file.name}`;
          const {
            data: { publicUrl },
          } = supabase.storage.from("assets").getPublicUrl(filePath);

          // Link entries are stored as lightweight JSON records in storage.
          if (file.name.toLowerCase().endsWith(".link.json")) {
            try {
              const response = await fetch(publicUrl);
              if (!response.ok) return null;

              const linkData = (await response.json()) as {
                title?: string;
                url?: string;
                createdAt?: string;
              };
              if (!linkData?.url) return null;

              // Validate and normalize the stored URL. If invalid or disallowed, skip this entry.
              let normalizedUrl: string;
              try {
                normalizedUrl = validateAndNormalizeUrl(linkData.url);
              } catch {
                return null;
              }

              // Escape title for safe display (defense-in-depth; UI should render as text)
              const displayName =
                linkData.title && linkData.title.trim()
                  ? escapeHtml(linkData.title.trim())
                  : file.name.replace(/\.link\.json$/i, "");

              return {
                type: "link" as const,
                name: displayName,
                url: normalizedUrl,
                storagePath: filePath,
                uploadedAt:
                  (linkData as { createdAt?: string }).createdAt ||
                  file.created_at,
              };
            } catch {
              return null;
            }
          }

          // Determine file type from extension.
          const ext = file.name.toLowerCase().split(".").pop() || "";
          let type: "image" | "video" | "audio" | "document" = "document";

          if (
            [
              "jpg",
              "jpeg",
              "png",
              "gif",
              "webp",
              "svg",
              "bmp",
              "avif",
            ].includes(ext)
          ) {
            type = "image";
          } else if (["mp4", "webm", "mov", "m4v", "ogv"].includes(ext)) {
            type = "video";
          } else if (
            ["mp3", "wav", "ogg", "m4a", "aac", "flac"].includes(ext)
          ) {
            type = "audio";
          }

          return {
            type,
            name: file.name,
            url: publicUrl,
            storagePath: filePath,
            uploadedAt: file.created_at,
          };
        }),
      );

      const scenarioAssets = scenarioAssetsWithNulls.filter(
        (asset) => asset !== null,
      ) as ScenarioAsset[];

      setAssets(scenarioAssets);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch assets";
      setError(message);
      setAssets([]);
    } finally {
      setLoading(false);
    }
  }, [scenarioId]);

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  return { assets, loading, error, refetch: fetchAssets };
};

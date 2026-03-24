import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { Image, Video, FileText, Eye, AudioLines, Link2 } from 'lucide-react';

interface Asset {
  type: 'image' | 'video' | 'audio' | 'document' | 'link';
  name: string;
  url: string;
}

interface AssetSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  availableAssets: Asset[];
  onSelectAsset?: (asset: Asset) => void;
  selectedAssetUrl?: string;
}

const getAssetIcon = (type: Asset['type']) => {
  switch (type) {
    case 'image':
      return <Image className="w-4 h-4" />;
    case 'video':
      return <Video className="w-4 h-4" />;
    case 'audio':
      return <AudioLines className="w-4 h-4" />;
    case 'document':
      return <FileText className="w-4 h-4" />;
    case 'link':
      return <Link2 className="w-4 h-4" />;
  }
};

export const AssetSelector = ({
  isOpen,
  onClose,
  availableAssets,
  onSelectAsset,
  selectedAssetUrl,
}: AssetSelectorProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Select Asset to Display</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Asset List */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm">Available Assets</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto border rounded-lg p-2">
              {availableAssets.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">No assets available</p>
              ) : (
                availableAssets.map((asset, idx) => (
                  <Card
                    key={idx}
                    className={`p-3 cursor-pointer transition-colors ${
                      selectedAssetUrl === asset.url
                        ? 'bg-primary/10 border-primary'
                        : 'hover:bg-muted/50'
                    }`}
                    onClick={() => {
                      setPreviewUrl(asset.url);
                      onSelectAsset?.(asset);
                    }}
                  >
                    <div className="flex items-start gap-2">
                      <div className="mt-1">{getAssetIcon(asset.type)}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{asset.name}</p>
                        <Badge variant="outline" className="mt-1 text-xs">
                          {asset.type.toUpperCase()}
                        </Badge>
                      </div>
                      {selectedAssetUrl === asset.url && (
                        <Eye className="w-4 h-4 text-primary" />
                      )}
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* Preview */}
          <div className="md:col-span-2">
            <h3 className="font-semibold text-sm mb-2">Preview</h3>
            <div className="border rounded-lg p-4 bg-muted/50 min-h-64 flex items-center justify-center">
              {previewUrl ? (
                <div className="w-full h-full flex items-center justify-center">
                  {previewUrl.match(/\.(jpg|jpeg|png|gif|webp|svg|bmp|avif)$/i) ? (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="max-w-full max-h-96 object-contain rounded"
                    />
                  ) : previewUrl.match(/\.(mp4|webm|mov|m4v|ogv)$/i) ? (
                    <video
                      src={previewUrl}
                      controls
                      className="max-w-full max-h-96 object-contain rounded"
                    />
                  ) : previewUrl.match(/\.(mp3|wav|ogg|m4a|aac|flac)$/i) ? (
                    <audio src={previewUrl} controls className="w-full max-w-lg" />
                  ) : previewUrl.match(/^https?:\/\//i) && !previewUrl.match(/\.(pdf|txt|md|doc|docx|ppt|pptx|xls|xlsx)$/i) ? (
                    <div className="text-center space-y-2">
                      <Link2 className="w-12 h-12 text-muted-foreground mx-auto" />
                      <p className="text-sm text-muted-foreground">External link</p>
                      <a
                        href={previewUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary text-sm hover:underline break-all"
                      >
                        Open link
                      </a>
                    </div>
                  ) : (
                    <div className="text-center space-y-2">
                      <FileText className="w-12 h-12 text-muted-foreground mx-auto" />
                      <p className="text-sm text-muted-foreground">Document preview not available</p>
                      <a
                        href={previewUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary text-sm hover:underline"
                      >
                        Open in new tab
                      </a>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground">Select an asset to preview</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="game" onClick={onClose}>
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

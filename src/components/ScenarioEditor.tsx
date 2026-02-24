import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { Upload, Minus, Plus, Settings } from 'lucide-react';
import { BASE_SCENARIOS } from '@/types/game';
import { useS3Upload } from '@/hooks/useS3Upload';
import { toast } from 'sonner';

interface Asset {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'video' | 'document';
  uploadedAt: string;
}

interface ScenarioEditorProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ScenarioEditor = ({ isOpen, onClose }: ScenarioEditorProps) => {
  const [activeTab, setActiveTab] = useState<'scenarios' | 'assets'>('scenarios');
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState(0);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [editingDescription, setEditingDescription] = useState('');
  const [fileInput, setFileInput] = useState<File | null>(null);
  const { uploadFile, uploading, error: uploadError } = useS3Upload();

  const currentScenario = BASE_SCENARIOS[selectedScenarioIndex];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileInput(file);
    }
  };

  const handleUploadAsset = async () => {
    if (!fileInput) {
      toast.error('Please select a file');
      return;
    }

    const timestamp = new Date().toISOString();
    const path = `scenario-${selectedScenarioIndex}/${timestamp}-${fileInput.name}`;
    
    const url = await uploadFile(fileInput, path);
    if (url) {
      const newAsset: Asset = {
        id: `asset-${Date.now()}`,
        name: fileInput.name,
        url,
        type: fileInput.type.startsWith('image/') ? 'image' : 
               fileInput.type.startsWith('video/') ? 'video' : 'document',
        uploadedAt: timestamp,
      };
      setAssets([...assets, newAsset]);
      setFileInput(null);
      toast.success('Asset uploaded successfully');
    } else {
      toast.error(uploadError || 'Failed to upload asset');
    }
  };

  const handleDeleteAsset = (assetId: string) => {
    setAssets(assets.filter(a => a.id !== assetId));
    toast.success('Asset removed');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Scenario & Asset Manager
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="scenarios">Scenarios</TabsTrigger>
            <TabsTrigger value="assets">Assets & Media</TabsTrigger>
          </TabsList>

          <TabsContent value="scenarios" className="space-y-4">
            <div className="space-y-3">
              <Label>Select Scenario</Label>
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                {BASE_SCENARIOS.map((scenario, idx) => (
                  <Button
                    key={idx}
                    variant={selectedScenarioIndex === idx ? 'default' : 'outline'}
                    className="text-left h-auto p-3"
                    onClick={() => {
                      setSelectedScenarioIndex(idx);
                      setEditingDescription(scenario.description);
                    }}
                  >
                    <div className="text-sm font-semibold">{scenario.companyName}</div>
                  </Button>
                ))}
              </div>
            </div>

            {currentScenario && (
              <Card className="p-4 space-y-4">
                <div>
                  <Label className="text-base font-semibold">Company Name</Label>
                  <p className="text-sm text-muted-foreground mt-1">{currentScenario.companyName}</p>
                </div>

                <div>
                  <Label className="text-base font-semibold">Scenario Seed</Label>
                  <p className="text-sm text-muted-foreground mt-1">{currentScenario.scenarioSeed}</p>
                </div>

                <div>
                  <Label htmlFor="description" className="text-base font-semibold">Description</Label>
                  <Textarea
                    id="description"
                    value={editingDescription}
                    onChange={(e) => setEditingDescription(e.target.value)}
                    placeholder="Edit scenario description..."
                    className="mt-2 min-h-32"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Note: Changes are local only and won't persist to the database in this version.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-base font-semibold">Roles ({currentScenario.roles.length})</Label>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {currentScenario.roles.map((role, idx) => (
                      <div key={idx} className="text-sm border rounded p-2">
                        <Badge className="mb-1">{role.personality}</Badge>
                        <p className="font-semibold text-xs">{role.roleName}</p>
                        <p className="text-xs text-muted-foreground mt-1">{role.roleDescription}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="assets" className="space-y-4">
            <Card className="p-4 space-y-4">
              <div>
                <h3 className="font-semibold mb-2">
                  Assets for: <span className="text-primary">{currentScenario.companyName}</span>
                </h3>
              </div>

              <div className="space-y-3 border rounded-lg p-3 bg-muted/50">
                <Label htmlFor="file-upload" className="font-semibold">Upload Asset</Label>
                <div className="flex gap-2">
                  <Input
                    id="file-upload"
                    type="file"
                    onChange={handleFileSelect}
                    accept="image/*,video/*,.pdf,.doc,.docx"
                    disabled={uploading}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleUploadAsset}
                    disabled={!fileInput || uploading}
                    size="sm"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {uploading ? 'Uploading...' : 'Upload'}
                  </Button>
                </div>
                {uploadError && <p className="text-sm text-destructive">{uploadError}</p>}
              </div>

              <div className="space-y-2">
                <Label className="font-semibold">Uploaded Assets</Label>
                {assets.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic">No assets uploaded yet</p>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {assets.map((asset) => (
                      <div key={asset.id} className="flex items-center justify-between p-2 border rounded bg-muted/30">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{asset.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {asset.type.toUpperCase()} • {new Date(asset.uploadedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteAsset(asset.id)}
                          className="ml-2"
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={onClose} variant="game">
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

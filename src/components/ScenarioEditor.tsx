import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Upload, Minus, Settings, Link2, Plus, Download, Trash2, Upload as UploadIcon } from 'lucide-react';
import { useS3Upload } from '@/hooks/useS3Upload';
import { useScenarioAssets } from '@/hooks/useScenarioAssets';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useScenarios } from '@/hooks/useScenarios';
import { ScenarioUpdateInput } from '@/types/scenario';

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

interface ScenarioEditorProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ScenarioEditor = ({ isOpen, onClose }: ScenarioEditorProps) => {
  const [activeTab, setActiveTab] = useState<'scenarios' | 'assets'>('scenarios');
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('');
  const [draftScenario, setDraftScenario] = useState<ScenarioUpdateInput | null>(null);
  const [fileInput, setFileInput] = useState<File | null>(null);
  const [linkTitle, setLinkTitle] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const importInputRef = useRef<HTMLInputElement | null>(null);
  const { uploadFile, uploading, error: uploadError } = useS3Upload();
  const { scenarios, loading: scenariosLoading, updateScenario, refetch, createScenario, deleteScenario } = useScenarios();
  const { assets: scenarioAssets, loading: assetsLoading, refetch: refetchAssets } = useScenarioAssets(selectedScenarioId);

  useEffect(() => {
    if (!selectedScenarioId && scenarios.length > 0) {
      setSelectedScenarioId(scenarios[0].id);
    }
  }, [selectedScenarioId, scenarios]);

  const currentScenario = useMemo(
    () => scenarios.find((scenario) => scenario.id === selectedScenarioId),
    [scenarios, selectedScenarioId],
  );

  useEffect(() => {
    if (!currentScenario) {
      setDraftScenario(null);
      return;
    }

    setDraftScenario({
      scenario_name: currentScenario.scenario_name,
      scenario_seed: currentScenario.scenario_seed,
      description: currentScenario.description,
      roles: currentScenario.roles.map((role) => ({
        id: role.id,
        personality: role.personality,
        role_name: role.role_name,
        role_description: role.role_description,
        guidelines: role.guidelines,
        order_index: role.order_index,
      })),
    });
  }, [currentScenario]);

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
    if (!selectedScenarioId) {
      toast.error('Select a scenario first');
      return;
    }

    const timestamp = new Date().toISOString();
    const path = `scenario-${selectedScenarioId}/${timestamp}-${fileInput.name}`;
    
    const url = await uploadFile(fileInput, path);
    if (url) {
      void url;
      setFileInput(null);
      toast.success('Asset uploaded successfully');
      await refetchAssets();
    } else {
      toast.error(uploadError || 'Failed to upload asset');
    }
  };

  const handleAddLink = async () => {
    if (!selectedScenarioId) {
      toast.error('Select a scenario first');
      return;
    }

    if (!linkUrl.trim()) {
      toast.error('Please enter a link URL');
      return;
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(linkUrl.trim());
      if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
        toast.error('Only http and https links are supported');
        return;
      }
    } catch {
      toast.error('Please enter a valid URL');
      return;
    }

    const timestamp = new Date().toISOString();
    const safeTitle = (linkTitle.trim() || parsedUrl.hostname).replace(/[^\w.-]+/g, '-');
    const fileName = `${safeTitle}-${Date.now()}.link.json`;
    const path = `scenario-${selectedScenarioId}/${fileName}`;
    const payload = JSON.stringify({
      title: linkTitle.trim() || parsedUrl.hostname,
      url: parsedUrl.toString(),
      createdAt: timestamp,
    });

    const linkFile = new File([payload], fileName, { type: 'application/json' });
    const { error } = await supabase.storage
      .from('assets')
      .upload(path, linkFile, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      toast.error(error.message || 'Failed to save link');
      return;
    }

    setLinkTitle('');
    setLinkUrl('');
    toast.success('Link saved successfully');
    await refetchAssets();
  };

  const updateRoleField = (roleIndex: number, field: 'personality' | 'role_name' | 'role_description', value: string) => {
    if (!draftScenario) return;
    const next = [...draftScenario.roles];
    next[roleIndex] = { ...next[roleIndex], [field]: value };
    setDraftScenario({ ...draftScenario, roles: next });
  };

  const updateGuideline = (roleIndex: number, guidelineIndex: number, value: string) => {
    if (!draftScenario) return;
    const roles = [...draftScenario.roles];
    const guidelines = [...roles[roleIndex].guidelines];
    guidelines[guidelineIndex] = value;
    roles[roleIndex] = { ...roles[roleIndex], guidelines };
    setDraftScenario({ ...draftScenario, roles });
  };

  const addGuideline = (roleIndex: number) => {
    if (!draftScenario) return;
    const roles = [...draftScenario.roles];
    roles[roleIndex] = {
      ...roles[roleIndex],
      guidelines: [...roles[roleIndex].guidelines, ''],
    };
    setDraftScenario({ ...draftScenario, roles });
  };

  const removeGuideline = (roleIndex: number, guidelineIndex: number) => {
    if (!draftScenario) return;
    const roles = [...draftScenario.roles];
    roles[roleIndex] = {
      ...roles[roleIndex],
      guidelines: roles[roleIndex].guidelines.filter((_, idx) => idx !== guidelineIndex),
    };
    setDraftScenario({ ...draftScenario, roles });
  };

  const addRole = () => {
    if (!draftScenario) return;
    setDraftScenario({
      ...draftScenario,
      roles: [
        ...draftScenario.roles,
        {
          personality: 'New Personality',
          role_name: 'New Role',
          role_description: '',
          guidelines: [''],
          order_index: draftScenario.roles.length,
        },
      ],
    });
  };

  const removeRole = (roleIndex: number) => {
    if (!draftScenario) return;
    const roles = draftScenario.roles
      .filter((_, idx) => idx !== roleIndex)
      .map((role, idx) => ({ ...role, order_index: idx }));
    setDraftScenario({ ...draftScenario, roles });
  };

  const handleSaveScenarioChanges = async () => {
    if (!selectedScenarioId || !draftScenario) return;
    try {
      await updateScenario(selectedScenarioId, {
        ...draftScenario,
        roles: draftScenario.roles.map((role, idx) => ({
          ...role,
          order_index: idx,
          guidelines: role.guidelines.map((g) => g.trim()).filter(Boolean),
        })),
      });
      toast.success('Scenario saved to Supabase');
      await refetch();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save scenario';
      toast.error(message);
    }
  };

  const handleCreateScenario = async () => {
    try {
      const newId = await createScenario();
      setSelectedScenarioId(newId);
      toast.success('Scenario created');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create scenario';
      toast.error(message);
    }
  };

  const handleDeleteScenario = async () => {
    if (!currentScenario) return;
    const confirmed = window.confirm(`Delete scenario "${currentScenario.scenario_name}"? This cannot be undone.`);
    if (!confirmed) return;

    try {
      await deleteScenario(currentScenario.id);
      setSelectedScenarioId('');
      toast.success('Scenario deleted');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete scenario';
      toast.error(message);
    }
  };

  const handleExportScenarios = () => {
    const payload = {
      version: 1,
      exportedAt: new Date().toISOString(),
      scenarios: scenarios.map((scenario) => ({
        export_id: scenario.id,
        scenario_name: scenario.scenario_name,
        scenario_seed: scenario.scenario_seed,
        description: scenario.description,
        roles: scenario.roles
          .sort((a, b) => a.order_index - b.order_index)
          .map((role) => ({
            personality: role.personality,
            role_name: role.role_name,
            role_description: role.role_description,
            guidelines: role.guidelines,
            order_index: role.order_index,
          })),
      })),
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scenarios-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => {
    importInputRef.current?.click();
  };

  const handleImportFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const raw = await file.text();
      const parsed = JSON.parse(raw) as {
        scenarios?: Array<{
          export_id?: string;
          scenario_name?: string;
          scenario_seed?: string;
          description?: string;
          roles?: Array<{
            personality?: string;
            role_name?: string;
            role_description?: string;
            guidelines?: string[];
            order_index?: number;
          }>;
        }>;
      };

      if (!Array.isArray(parsed.scenarios)) {
        toast.error('Invalid import file format');
        return;
      }

      let importedCount = 0;
      let skippedCount = 0;
      const seenIds = new Set(scenarios.map((s) => s.id));
      const seenNames = new Set(scenarios.map((s) => s.scenario_name.trim().toLowerCase()));

      for (const incoming of parsed.scenarios) {
        const name = (incoming.scenario_name || '').trim();
        if (!name) {
          skippedCount += 1;
          continue;
        }

        const duplicate =
          (incoming.export_id && seenIds.has(incoming.export_id)) ||
          seenNames.has(name.toLowerCase());
        if (duplicate) {
          skippedCount += 1;
          continue;
        }

        const importId =
          incoming.export_id && UUID_REGEX.test(incoming.export_id)
            ? incoming.export_id
            : undefined;

        const { data: created, error: createError } = await supabase
          .from('scenarios')
          .insert({
            id: importId,
            scenario_name: name,
            scenario_seed: incoming.scenario_seed || '',
            description: incoming.description || '',
            is_active: true,
          })
          .select('*')
          .single();
        if (createError) throw createError;

        const incomingRoles = Array.isArray(incoming.roles) ? incoming.roles : [];
        if (incomingRoles.length > 0) {
          const roleRows = incomingRoles.map((role, index) => ({
            scenario_id: created.id,
            personality: role.personality || 'Unknown',
            role_name: role.role_name || `Role ${index + 1}`,
            role_description: role.role_description || '',
            guidelines: Array.isArray(role.guidelines) ? role.guidelines : [],
            order_index: typeof role.order_index === 'number' ? role.order_index : index,
          }));
          const { error: roleError } = await supabase
            .from('scenario_roles')
            .insert(roleRows);
          if (roleError) throw roleError;
        }

        importedCount += 1;
        seenIds.add(created.id);
        seenNames.add(name.toLowerCase());
      }

      await refetch();
      toast.success(`Import complete. Added ${importedCount}, skipped ${skippedCount} duplicates.`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to import scenarios';
      toast.error(message);
    } finally {
      if (importInputRef.current) {
        importInputRef.current.value = '';
      }
    }
  };

  const handleDeleteAsset = async (storagePath: string) => {
    const confirmed = window.confirm('Remove this asset from the scenario?');
    if (!confirmed) return;

    const { error } = await supabase.storage.from('assets').remove([storagePath]);
    if (error) {
      toast.error(error.message || 'Failed to remove asset');
      return;
    }

    toast.success('Asset removed');
    await refetchAssets();
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
            <input
              ref={importInputRef}
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={handleImportFile}
            />
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="outline" onClick={handleCreateScenario}>
                <Plus className="w-4 h-4 mr-2" />
                Create Scenario
              </Button>
              <Button type="button" variant="outline" onClick={handleExportScenarios}>
                <Download className="w-4 h-4 mr-2" />
                Export Scenarios
              </Button>
              <Button type="button" variant="outline" onClick={handleImportClick}>
                <UploadIcon className="w-4 h-4 mr-2" />
                Import Scenarios
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={handleDeleteScenario}
                disabled={!currentScenario}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Scenario
              </Button>
            </div>
            <div className="space-y-3">
              <Label>Select Scenario</Label>
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                {scenarios.map((scenario) => (
                  <Button
                    key={scenario.id}
                    variant={selectedScenarioId === scenario.id ? 'default' : 'outline'}
                    className="text-left h-auto p-3"
                    onClick={() => {
                      setSelectedScenarioId(scenario.id);
                    }}
                  >
                    <div className="text-sm font-semibold">{scenario.scenario_name}</div>
                  </Button>
                ))}
              </div>
            </div>

            {scenariosLoading && <p className="text-sm text-muted-foreground">Loading scenarios...</p>}

            {currentScenario && draftScenario && (
              <Card className="p-4 space-y-4">
                <div>
                  <Label className="text-base font-semibold">Scenario Name</Label>
                  <Input
                    value={draftScenario.scenario_name}
                    onChange={(e) => setDraftScenario({ ...draftScenario, scenario_name: e.target.value })}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label className="text-base font-semibold">Scenario Seed</Label>
                  <Textarea
                    value={draftScenario.scenario_seed}
                    onChange={(e) => setDraftScenario({ ...draftScenario, scenario_seed: e.target.value })}
                    className="mt-2 min-h-20"
                  />
                </div>

                <div>
                  <Label htmlFor="description" className="text-base font-semibold">Description</Label>
                  <Textarea
                    id="description"
                    value={draftScenario.description}
                    onChange={(e) => setDraftScenario({ ...draftScenario, description: e.target.value })}
                    placeholder="Edit scenario description..."
                    className="mt-2 min-h-32"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-semibold">Roles ({draftScenario.roles.length})</Label>
                    <Button type="button" size="sm" variant="outline" onClick={addRole}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Role
                    </Button>
                  </div>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {draftScenario.roles.map((role, roleIdx) => (
                      <div key={role.id ?? `role-${roleIdx}`} className="text-sm border rounded p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <Badge className="mb-1">{role.personality}</Badge>
                          <Button type="button" variant="ghost" size="sm" onClick={() => removeRole(roleIdx)}>
                            <Minus className="w-4 h-4" />
                          </Button>
                        </div>
                        <Input
                          placeholder="Personality"
                          value={role.personality}
                          onChange={(e) => updateRoleField(roleIdx, 'personality', e.target.value)}
                        />
                        <Input
                          placeholder="Role name"
                          value={role.role_name}
                          onChange={(e) => updateRoleField(roleIdx, 'role_name', e.target.value)}
                        />
                        <Textarea
                          placeholder="Role description"
                          value={role.role_description}
                          onChange={(e) => updateRoleField(roleIdx, 'role_description', e.target.value)}
                          className="min-h-20"
                        />
                        <div className="space-y-2">
                          <Label className="text-xs">Guidelines</Label>
                          {role.guidelines.map((guideline, guidelineIdx) => (
                            <div key={`guideline-${guidelineIdx}`} className="flex gap-2">
                              <Input
                                value={guideline}
                                onChange={(e) => updateGuideline(roleIdx, guidelineIdx, e.target.value)}
                                placeholder="+1 / -1 guideline"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeGuideline(roleIdx, guidelineIdx)}
                              >
                                <Minus className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                          <Button type="button" variant="outline" size="sm" onClick={() => addGuideline(roleIdx)}>
                            <Plus className="w-4 h-4 mr-2" />
                            Add guideline
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <Button onClick={handleSaveScenarioChanges} variant="game">
                  Save Scenario Fields
                </Button>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="assets" className="space-y-4">
            <Card className="p-4 space-y-4">
              <div>
                <h3 className="font-semibold mb-2">
                  Assets for: <span className="text-primary">{currentScenario?.scenario_name ?? 'No scenario selected'}</span>
                </h3>
              </div>

              <div className="space-y-3 border rounded-lg p-3 bg-muted/50">
                <Label htmlFor="file-upload" className="font-semibold">Upload Asset</Label>
                <div className="flex gap-2">
                  <Input
                    id="file-upload"
                    type="file"
                    onChange={handleFileSelect}
                    accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.md,.csv"
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

              <div className="space-y-3 border rounded-lg p-3 bg-muted/50">
                <Label className="font-semibold">Add External Link</Label>
                <Input
                  placeholder="Link title (optional)"
                  value={linkTitle}
                  onChange={(e) => setLinkTitle(e.target.value)}
                />
                <div className="flex gap-2">
                  <Input
                    placeholder="https://example.com"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleAddLink}
                    disabled={!linkUrl.trim() || uploading}
                    size="sm"
                    variant="secondary"
                  >
                    <Link2 className="w-4 h-4 mr-2" />
                    Save Link
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="font-semibold">Uploaded Assets</Label>
                {assetsLoading ? (
                  <p className="text-sm text-muted-foreground italic">Loading assets...</p>
                ) : scenarioAssets.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic">No assets uploaded yet</p>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {scenarioAssets.map((asset) => (
                      <div key={`${asset.url}-${asset.name}`} className="flex items-center justify-between p-2 border rounded bg-muted/30">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{asset.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {asset.type.toUpperCase()}
                            {asset.uploadedAt ? ` • ${new Date(asset.uploadedAt).toLocaleDateString()}` : ''}
                          </p>
                        </div>
                        <a
                          href={asset.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary hover:underline ml-2"
                        >
                          Open
                        </a>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteAsset(asset.storagePath)}
                          className="ml-1"
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
        </div>
      </DialogContent>
    </Dialog>
  );
};

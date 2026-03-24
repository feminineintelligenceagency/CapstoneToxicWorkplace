import { useEffect, useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Image as ImageIcon, X, Loader2, Link2, FileText, AudioLines } from "lucide-react";
import { Lobby, LobbyPlayer } from "@/types/lobby";
import { AssetSelector } from "@/components/AssetSelector";
import { useScenarioAssets } from "@/hooks/useScenarioAssets";
import { useCallContext } from "@/contexts/CallContext";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface RoleplayTimerProps {
  lobby: Lobby;
  players: LobbyPlayer[];
  isHost: boolean;
  onTimerEnd: () => void;
  scenarioDescription?: string;
  myPlayerId?: string | null;
  onAssetSelect?: (asset: { type: 'image' | 'video' | 'audio' | 'document' | 'link'; name: string; url: string; presentedBy: string; presentedAt: string }) => void;
  onAssetRemove?: () => void;
}

export const RoleplayTimer = ({
  lobby,
  players,
  isHost,
  onTimerEnd,
  scenarioDescription,
  myPlayerId,
  onAssetSelect,
  onAssetRemove,
}: RoleplayTimerProps) => {
  const call = useCallContext();
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [isExpired, setIsExpired] = useState(false);
  const [assetSelectorOpen, setAssetSelectorOpen] = useState(false);
  const [displayedAsset, setDisplayedAsset] = useState(lobby.current_displayed_asset);
  const hasTriggeredRef = useRef(false);

  // Get available assets for the scenario from Supabase Storage
  const scenarioId = lobby.scenario_id;
  const { assets: uploadedAssets, loading: assetsLoading } = useScenarioAssets(scenarioId);

  // Sync displayed asset from lobby when it updates
  useEffect(() => {
    setDisplayedAsset(lobby.current_displayed_asset);
  }, [lobby.current_displayed_asset]);

  useEffect(() => {
    if (!lobby.roleplay_timer_end) {
      setTimeRemaining(0);
      setIsExpired(false);
      return;
    }

    hasTriggeredRef.current = false;

    const calculateRemaining = () => {
      const endTime = new Date(lobby.roleplay_timer_end).getTime();
      const now = Date.now();
      const remaining = Math.max(0, Math.floor((endTime - now) / 1000));
      return remaining;
    };

    const initialRemaining = calculateRemaining();
    setTimeRemaining(initialRemaining);
    setIsExpired(initialRemaining <= 0);

    const interval = setInterval(() => {
      const remaining = calculateRemaining();
      setTimeRemaining(remaining);

      if (remaining <= 0 && !hasTriggeredRef.current) {
        setIsExpired(true);
        hasTriggeredRef.current = true;
        if (isHost) {
          onTimerEnd();
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lobby.roleplay_timer_end, isHost, onTimerEnd]);

  const handleAssetSelect = (asset: { type: 'image' | 'video' | 'audio' | 'document' | 'link'; name: string; url: string }) => {
    const displayedAssetData = {
      ...asset,
      presentedBy: myPlayerId || 'unknown',
      presentedAt: new Date().toISOString(),
    };
    // Don't set local state - let Supabase update trigger the sync
    // This ensures ALL players see the update at the same time
    onAssetSelect?.(displayedAssetData);
    setAssetSelectorOpen(false);
  };

  const handleRemoveAsset = () => {
    // Don't set local state - let Supabase update trigger the sync
    onAssetRemove?.();
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getTimeColor = (seconds: number): string => {
    if (seconds <= 30) return "text-destructive";
    if (seconds <= 60) return "text-orange-500";
    return "text-primary";
  };

  const presenterName = displayedAsset && players.length > 0
    ? players.find(p => p.id === displayedAsset.presentedBy)?.player_name || 'Unknown'
    : null;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-8">
        {call && (
          <div className="flex flex-col gap-3">
            <Alert className="bg-muted/50">
              <AlertDescription>
                Your audio may be transcribed during this phase for future use.
              </AlertDescription>
            </Alert>
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <Button
                variant={call.isMuted ? "destructive" : "secondary"}
                size="sm"
                onClick={() => call.setMuted(!call.isMuted)}
              >
                {call.isMuted ? <MicOff className="w-4 h-4 mr-2" /> : <Mic className="w-4 h-4 mr-2" />}
                {call.isMuted ? "Unmute" : "Mute"}
              </Button>
              <div className="flex gap-2 flex-wrap">
                {players.map((p) => (
                  <span
                    key={p.id}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                      call.speakingPeers.has(p.id)
                        ? "ring-2 ring-primary bg-primary/20"
                        : "bg-secondary/50"
                    }`}
                  >
                    {p.player_name}
                    {call.speakingPeers.has(p.id) && " (talking)"}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold">Roleplay Phase</h2>
          <p className="text-lg text-muted-foreground">
            Act out your role and interact with other players
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Timer and Scenario */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="p-8 shadow-md">
              <div className="text-center space-y-4">
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Time Remaining
                  </p>
                  <div
                    className={`text-6xl md:text-7xl font-bold font-mono transition-colors duration-300 ${getTimeColor(
                      timeRemaining,
                    )}`}
                  >
                    {formatTime(timeRemaining)}
                  </div>
                </div>

                {timeRemaining <= 30 && timeRemaining > 0 && (
                  <p className="text-sm text-destructive animate-pulse">
                    Time is running out!
                  </p>
                )}

                {isExpired && (
                  <p className="text-sm text-muted-foreground">
                    Timer expired. Transitioning...
                  </p>
                )}
              </div>
            </Card>

            {scenarioDescription && (
              <Card className="p-4 shadow-md">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                  Scenario
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-6">
                  {scenarioDescription}
                </p>
              </Card>
            )}
          </div>

          {/* Right Column: Asset Display and Selection */}
          <div className="lg:col-span-2 space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Displayed Asset</h3>
                <Button
                  onClick={() => setAssetSelectorOpen(true)}
                  size="sm"
                  variant="outline"
                  disabled={assetsLoading}
                >
                  {assetsLoading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <ImageIcon className="w-4 h-4 mr-2" />
                  )}
                  {assetsLoading ? 'Loading Assets...' : 'Select Asset'}
                </Button>
              </div>

              <Card className="p-6 shadow-md min-h-96 flex items-center justify-center bg-muted/30">
                {displayedAsset ? (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                    {displayedAsset.type === 'image' && (
                      <img
                        src={displayedAsset.url}
                        alt={displayedAsset.name}
                        className="max-w-full max-h-80 object-contain rounded-lg shadow-md"
                      />
                    )}
                    {displayedAsset.type === 'video' && (
                      <video
                        src={displayedAsset.url}
                        controls
                        className="max-w-full max-h-80 object-contain rounded-lg shadow-md"
                      />
                    )}
                    {displayedAsset.type === 'audio' && (
                      <div className="w-full max-w-xl border rounded-lg bg-background p-4">
                        <div className="flex items-center justify-center gap-2 mb-2 text-sm text-muted-foreground">
                          <AudioLines className="w-4 h-4" />
                          Audio asset
                        </div>
                        <audio src={displayedAsset.url} controls className="w-full" />
                      </div>
                    )}
                    {displayedAsset.type === 'document' && (
                      <div className="w-full max-w-xl border rounded-lg bg-background p-6 text-center space-y-3">
                        <FileText className="w-10 h-10 mx-auto text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Document preview is opened in a new tab.</p>
                        <a
                          href={displayedAsset.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline break-all"
                        >
                          Open document
                        </a>
                      </div>
                    )}
                    {displayedAsset.type === 'link' && (
                      <div className="w-full max-w-xl border rounded-lg bg-background p-6 text-center space-y-3">
                        <Link2 className="w-10 h-10 mx-auto text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">External link shared for roleplay.</p>
                        <a
                          href={displayedAsset.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline break-all"
                        >
                          Open link
                        </a>
                      </div>
                    )}

                    <div className="text-center space-y-2 mt-4 w-full">
                      <p className="text-sm font-medium">{displayedAsset.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Presented by: {presenterName}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRemoveAsset}
                      >
                        <X className="w-3 h-3 mr-1" />
                        Remove
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center space-y-3">
                    <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto opacity-50" />
                    <div>
                      <p className="text-muted-foreground font-medium">No asset displayed</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {uploadedAssets.length === 0
                          ? 'No assets uploaded for this scenario yet. Upload images or videos using the Scenario Manager.'
                          : 'Click "Select Asset" to display media, docs, or links for the group.'}
                      </p>
                    </div>
                  </div>
                )}
              </Card>

              <p className="text-xs text-muted-foreground">
                💡 Any player can select and change what's displayed. Use assets to support your roleplay!
              </p>
            </div>
          </div>
        </div>
      </div>

      <AssetSelector
        isOpen={assetSelectorOpen}
        onClose={() => setAssetSelectorOpen(false)}
        availableAssets={uploadedAssets}
        onSelectAsset={handleAssetSelect}
        selectedAssetUrl={displayedAsset?.url}
      />
    </div>
  );
};

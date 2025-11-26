import { useEffect, useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Lobby } from "@/types/lobby";

interface RoleplayTimerProps {
  lobby: Lobby;
  isHost: boolean;
  onTimerEnd: () => void;
  scenarioDescription?: string;
}

export const RoleplayTimer = ({
  lobby,
  isHost,
  onTimerEnd,
  scenarioDescription,
}: RoleplayTimerProps) => {
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [isExpired, setIsExpired] = useState(false);
  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    if (!lobby.roleplay_timer_end) {
      // If timer hasn't been set yet this shouldn't happen
      setTimeRemaining(0);
      setIsExpired(false);
      return;
    }

    // Reset the trigger flag when timer end changes
    hasTriggeredRef.current = false;

    const calculateRemaining = () => {
      const endTime = new Date(lobby.roleplay_timer_end).getTime();
      const now = Date.now();
      const remaining = Math.max(0, Math.floor((endTime - now) / 1000));
      return remaining;
    };

    // Calculate initial remaining time
    const initialRemaining = calculateRemaining();
    setTimeRemaining(initialRemaining);
    setIsExpired(initialRemaining <= 0);

    // Update every second
    const interval = setInterval(() => {
      const remaining = calculateRemaining();
      setTimeRemaining(remaining);

      if (remaining <= 0 && !hasTriggeredRef.current) {
        setIsExpired(true);
        hasTriggeredRef.current = true;
        // Only host triggers the phase transition
        if (isHost) {
          onTimerEnd();
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lobby.roleplay_timer_end, isHost, onTimerEnd]);

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

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold">Roleplay Phase</h2>
          <p className="text-lg text-muted-foreground">
            Act out your role and interact with other players
          </p>
        </div>

        <Card className="gradient-card p-12 shadow-card">
          <div className="text-center space-y-6">
            <div className="space-y-2">
              <p className="text-lg font-semibold text-muted-foreground uppercase tracking-wide">
                Time Remaining
              </p>
              <div
                className={`text-8xl font-bold font-mono transition-colors duration-300 ${getTimeColor(
                  timeRemaining,
                )}`}
              >
                {formatTime(timeRemaining)}
              </div>
            </div>

            {timeRemaining <= 30 && timeRemaining > 0 && (
              <p className="text-lg text-destructive animate-pulse">
                Time is running out!
              </p>
            )}

            {isExpired && (
              <p className="text-lg text-muted-foreground">
                Timer expired. Transitioning to guessing phase...
              </p>
            )}

            {scenarioDescription && (
              <div className="pt-4 border-t">
                <p className="text-lg font-bold text-muted-foreground uppercase tracking-wide mb-2">
                  Scenario Context
                </p>
                <p className="text-base text-muted-foreground leading-relaxed">
                  {scenarioDescription}
                </p>
              </div>
            )}

            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                Use this time to roleplay your character and observe others. The
                guessing phase will begin automatically when the timer ends.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

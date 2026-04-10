import { isSpeechRecognitionSupported } from "@/lib/speechRecognitionSupport";
import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

type SpeechRecognitionBrowserBannerProps = {
  className?: string;
};

/**
 * Shown when the browser has no SpeechRecognition API (roleplay transcription will not work).
 */
export function SpeechRecognitionBrowserBanner({ className }: SpeechRecognitionBrowserBannerProps) {
  if (isSpeechRecognitionSupported()) return null;

  return (
    <div
      className={cn(
        "w-full border-b border-amber-500/40 bg-amber-500/10 px-4 py-3 text-amber-950 dark:bg-amber-950/30 dark:text-amber-100 dark:border-amber-500/30",
        className,
      )}
      role="status"
    >
      <div className="mx-auto flex max-w-4xl gap-3 sm:gap-4">
        <div className="min-w-0 flex-1 space-y-1.5">
          <p className="font-medium leading-snug text-amber-950 dark:text-amber-50">
            Speech recognition is not available in this browser
          </p>
          <p className="text-sm leading-relaxed text-amber-900/90 dark:text-amber-100/90">
            For live transcription during the game, use a desktop browser with the Web Speech API, such as{" "}
            <strong>Google Chrome</strong> or <strong>Microsoft Edge</strong>. Safari has limited support;
            Firefox does not support speech recognition for this feature.
          </p>
        </div>
      </div>
    </div>
  );
}

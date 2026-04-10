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
        "w-full border-b border-palette-orange/35 bg-palette-orange/10 px-4 py-3 text-foreground",
        className,
      )}
      role="status"
    >
      <div className="mx-auto flex max-w-4xl gap-3 sm:gap-4">
        <AlertTriangle
          className="mt-0.5 h-5 w-5 shrink-0 text-palette-orange-deep"
          aria-hidden
        />
        <div className="min-w-0 flex-1 space-y-1.5">
          <p className="font-medium leading-snug text-foreground">
            Speech recognition is not available in this browser
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            For live transcription during the game, use a desktop browser with the Web Speech API, such as{" "}
            <strong>Google Chrome</strong> or <strong>Microsoft Edge</strong>. Safari has limited support;
            Firefox does not support speech recognition for this feature.
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * Whether the Web Speech API (SpeechRecognition / webkitSpeechRecognition) exists.
 * Chromium (Chrome, Edge, Brave) and Safari expose it; Firefox and many mobile browsers do not.
 */
export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === "undefined") return false;
  return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
}

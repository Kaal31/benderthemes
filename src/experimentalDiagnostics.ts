import { logInfo } from "./diag";
import { startKeyboardDiagnostics } from "./keyboardDiagnostics";
import { startIdleDiagnostics } from "./idleDiagnostics";

/** Automatic, bounded diagnostics for the experimental branch. */
export function startExperimentalDiagnostics(): () => void {
  logInfo("[experimental-diagnostics] automatic keyboard/lifecycle/idle capture started; thirty-minute limit; no text input");
  const stopKeyboard = startKeyboardDiagnostics(true);
  const stopIdle = startIdleDiagnostics(true);
  return () => {
    stopKeyboard();
    stopIdle();
    logInfo("[experimental-diagnostics] stopped");
  };
}

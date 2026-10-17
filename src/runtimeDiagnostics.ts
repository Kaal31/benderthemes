import { logInfo } from "./diag";
import { startKeyboardDiagnostics } from "./keyboardDiagnostics";
import { startIdleDiagnostics } from "./idleDiagnostics";

/** Automatic, bounded diagnostics for troubleshooting Steam UI behavior. */
export function startRuntimeDiagnostics(): () => void {
  logInfo("[runtime-diagnostics] automatic keyboard/lifecycle/idle capture started; thirty-minute limit; no text input");
  const stopKeyboard = startKeyboardDiagnostics(true);
  const stopIdle = startIdleDiagnostics(true);
  return () => {
    stopKeyboard();
    stopIdle();
    logInfo("[runtime-diagnostics] stopped");
  };
}

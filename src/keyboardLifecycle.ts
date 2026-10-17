// Bounded metadata-only queue; no input content, app IDs or account details.
export type KeyboardEvent = { event: string; connected?: boolean; focused?: boolean; managerFound?: boolean; reused?: boolean; disposeAvailable?: boolean };
let recording = false;
const events: KeyboardEvent[] = [];
export function recordKeyboardEvent(event: KeyboardEvent) {
  if (recording && events.length < 32) events.push(event);
}
export function setKeyboardRecording(enabled: boolean) { recording = enabled; events.length = 0; }
export function drainKeyboardEvents(): KeyboardEvent[] { return events.splice(0); }

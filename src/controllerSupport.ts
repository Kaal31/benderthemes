/** Steam sends either batched messages or (controllerIndex, button, pressed). */
export function inputController(args: unknown[]): number | null {
  const first: any = args[0];
  if (Array.isArray(first)) {
    const pressed = [...first].reverse().find(item => item && item.bS !== false);
    const index = pressed?.nController ?? pressed?.nControllerIndex ?? pressed?.controllerIndex;
    return typeof index === "number" && Number.isFinite(index) ? index : null;
  }
  return typeof first === "number" && Number.isFinite(first) && args[2] !== false ? first : null;
}

export function controllerMotion(changes: unknown, active: number | null): any | null {
  if (!Array.isArray(changes)) return null;
  const rows = [...changes].reverse();
  return rows.find(c => {
    if (!c || typeof c !== "object") return false;
    const index = c.nController ?? c.nControllerIndex ?? c.controllerIndex ?? c.unControllerIndex;
    return active === null || index === active;
  }) ?? null;
}

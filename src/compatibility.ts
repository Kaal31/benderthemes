import { useEffect, useState } from "react";
import { reportError } from "./diag";

let failure = "";
const listeners = new Set<() => void>();
export function failHome(error: unknown) {
  failure = error instanceof Error ? error.message : String(error);
  reportError("Steam compatibility", error);
  listeners.forEach(fn => fn());
}
export function retryHome() {
  failure = "";
  listeners.forEach(fn => fn());
}
export function useHomeFailure() {
  const [value, setValue] = useState(failure);
  useEffect(() => {
    const fn = () => setValue(failure);
    listeners.add(fn);
    return () => { listeners.delete(fn); };
  }, []);
  return value;
}

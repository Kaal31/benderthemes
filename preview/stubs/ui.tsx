// Browser stand-ins for @decky/ui so the themes run in a normal page.
// Keyboard: arrows = D-pad, Enter = Ⓐ, Esc/Backspace = Ⓑ, X = Ⓧ, Y = Ⓨ/△, M = ≡, Q/E = L1/R1.
import { CSSProperties, ReactNode, useEffect, useRef } from "react";
export function ProgressBarWithInfo({ nProgress, sOperationText }: any) { return <div>{sOperationText}<progress value={nProgress} max={100} /></div>; }

export enum GamepadButton {
  INVALID = 0, OK = 1, CANCEL = 2, SECONDARY = 3, OPTIONS = 4, BUMPER_LEFT = 5, BUMPER_RIGHT = 6, TRIGGER_LEFT = 7, TRIGGER_RIGHT = 8,
  DIR_UP = 9, DIR_DOWN = 10, DIR_LEFT = 11, DIR_RIGHT = 12, SELECT = 13, START = 14,
}

type Handlers = Record<string, ((e: any) => void) | undefined>;
const stack: { current: Handlers }[] = [];

function ev(button: number, repeat: boolean) {
  return { detail: { button, is_repeat: repeat }, preventDefault() {}, stopPropagation() {} };
}
if (typeof window !== "undefined") {
  window.addEventListener("keydown", (k) => {
    const top = stack[stack.length - 1]?.current;
    if (!top) return;
    const r = k.repeat;
    const dirs: Record<string, number> = { ArrowUp: 9, ArrowDown: 10, ArrowLeft: 11, ArrowRight: 12 };
    if (dirs[k.key]) return k.preventDefault(), top.onGamepadDirection?.(ev(dirs[k.key], r));
    const key = k.key.toLowerCase();
    if (k.key === "Enter" || key === "a") return top.onOKButton?.(ev(1, r));
    if (k.key === "Escape" || k.key === "Backspace" || key === "b") {
      const e = ev(2, r);
      top.onButtonDown?.(e);
      return;
    }
    if (key === "x") return top.onSecondaryButton?.(ev(3, r));
    if (key === "y" || key === "t") return top.onOptionsButton?.(ev(4, r));
    if (key === "m") return top.onMenuButton?.(ev(14, r));
    if (key === "q") return top.onButtonDown?.(ev(5, r));
    if (key === "e") return top.onButtonDown?.(ev(6, r));
    if (key === "z" || k.key === "[") return top.onButtonDown?.(ev(7, r));
    if (key === "c" || k.key === "]") return top.onButtonDown?.(ev(8, r));
  });
}

export function Focusable(props: any) {
  const entry = useRef<{ current: Handlers }>({ current: props });
  entry.current.current = props; // latest handlers every render
  useEffect(() => {
    stack.push(entry.current);
    return () => {
      stack.splice(stack.indexOf(entry.current), 1);
    };
  }, []);
  const { style, children } = props;
  return <div style={style as CSSProperties}>{children as ReactNode}</div>;
}

const toast = (msg: string) => (window as any).__previewToast?.(msg);
export const Navigation = {
  Navigate: (p: string) => toast(`Navigate → ${p}`),
  NavigateBack: () => toast("Back"),
  NavigateToLibraryTab: () => toast("Steam Library"),
  NavigateToSteamWeb: (u: string) => toast(`Steam web → ${u}`),
  NavigateToChat: () => toast("Friends & Chat"),
  NavigateToExternalWeb: (u: string) => toast(`Browser → ${u}`),
  OpenPowerMenu: () => toast("Power menu"),
  OpenMainMenu: () => toast("Steam menu"),
  OpenQuickAccessMenu: () => toast("Quick Access → Deck Home Themes settings"),
  CloseSideMenus: () => {},
};
export const showContextMenu = () => toast("Steam's game menu");
export const showModal = (el: any) => {
  const name = window.prompt(el?.props?.strTitle ?? "Name", "");
  if (name !== null) el?.props?.onOK?.();
  return { Close() {} };
};
export const ConfirmModal = (p: any) => <div>{p.children}</div>;
export const TextField = (_p: any) => null;
export const staticClasses = { Title: "" };
export const PanelSection = (p: any) => <div>{p.children}</div>;
export const PanelSectionRow = (p: any) => <div>{p.children}</div>;
export const ButtonItem = (p: any) => <button onClick={p.onClick}>{p.children}</button>;
export const DropdownItem = () => null;
export const SliderField = () => null;
export const ToggleField = () => null;
export const findClassModule = (f: (m: any) => boolean) => {
  const m = { FooterLegend: "dhtPreviewFooterLegend" };
  return f(m) ? m : undefined;
};

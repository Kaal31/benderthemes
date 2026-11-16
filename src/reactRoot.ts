import type {ReactNode} from "react";
import * as ReactDOM from "react-dom";

export type CompatibleRoot = {render(value:ReactNode):void;unmount():void};
type HostRenderer = {
  createRoot?:(node:HTMLElement)=>CompatibleRoot;
  render?:(value:ReactNode,node:HTMLElement)=>unknown;
  unmountComponentAtNode?:(node:HTMLElement)=>unknown;
};

/** Use Decky's host ReactDOM, including Steam builds exposing only the legacy API. */
export function createCompatibleRoot(node:HTMLElement):CompatibleRoot|null {
  const renderer = ReactDOM as unknown as HostRenderer;
  if(typeof renderer.createRoot === "function")return renderer.createRoot(node);
  if(typeof renderer.render === "function" && typeof renderer.unmountComponentAtNode === "function")return {
    render:value=>{renderer.render!(value,node);},
    unmount:()=>{renderer.unmountComponentAtNode!(node);},
  };
  return null;
}

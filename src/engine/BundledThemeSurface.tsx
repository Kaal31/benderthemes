import { useLayoutEffect, useRef } from "react";
import { bundledThemes } from "./bundledThemes.generated";

export type NativeThemePort = { ownerDocument: Document; postMessage: (message: Record<string, unknown>, targetOrigin?: string) => void };
export const hasBundledRenderer = (id: string) => Object.prototype.hasOwnProperty.call(bundledThemes, id);

/** Trusted shipped UI code runs directly in Steam's DOM. Shadow DOM only scopes its styles. */
export function BundledThemeSurface({ id, base, port, onMessage }: {
  id: string; base: string; port: React.MutableRefObject<NativeThemePort | null>;
  onMessage: (message: Record<string, unknown>) => void;
}) {
  const host = useRef<HTMLDivElement>(null);
  const receive = useRef(onMessage); receive.current = onMessage;
  useLayoutEffect(() => {
    const element = host.current;
    if (!element) return;
    const doc = element.ownerDocument, view = doc.defaultView!;
    const definition = bundledThemes[id as keyof typeof bundledThemes];
    const shadow = element.shadowRoot ?? element.attachShadow({mode:"open"});
    const html = doc.createElement("div"), body = doc.createElement("div");
    html.dataset.themeHtml = ""; body.dataset.themeBody = "";
    html.style.cssText = "width:100%;height:100%;position:relative;overflow:hidden";
    const attributes = doc.createElement("template"); attributes.innerHTML = `<div ${definition.bodyAttributes}></div>`;
    for (const attribute of attributes.content.firstElementChild?.attributes ?? []) body.setAttribute(attribute.name, attribute.value);
    const absolute = (url: string) => /^(?:[a-z]+:|\/\/|#)/i.test(url) ? url : new URL(url, base).href;
    const css = (text: string) => text.replace(/:root\b/g,"[data-theme-html]")
      .replace(/(^|[{},\s])html(?=[\s.,:#>{\[])/g,"$1[data-theme-html]")
      .replace(/(^|[{},\s])body(?=[\s.,:#>{\[])/g,"$1[data-theme-body]")
      .replace(/url\(\s*(['"]?)([^)'"\s]+)\1\s*\)/g,(_match,_quote,url:string)=>`url("${absolute(url)}")`)
      .replace(/(-?[\d.]+)vw\b/g,"calc(var(--native-width) * $1 / 100)")
      .replace(/(-?[\d.]+)vh\b/g,"calc(var(--native-height) * $1 / 100)");
    body.innerHTML = definition.html;
    for (const node of body.querySelectorAll("[src],[href],[poster]")) for (const attr of ["src","href","poster"]) {
      const value = node.getAttribute(attr); if (value) node.setAttribute(attr,absolute(value));
    }
    const style = doc.createElement("style"); style.textContent = css(definition.css)+"\n[data-theme-body]{width:100%;height:100%;margin:0;position:relative}";
    html.append(body); shadow.replaceChildren(style,html);
    let disposed=false;
    const cleanups: (()=>void)[] = [], timers = new Set<number>(), intervals = new Set<number>(), frames = new Set<number>();
    const listeners = new Map<string, Set<EventListener>>();
    const emit = (name: string, event: unknown) => { for (const callback of [...(listeners.get(name) ?? [])]) callback.call(scopeWindow,event as Event); };
    const parent = {postMessage:(message:Record<string,unknown>)=>queueMicrotask(()=>{if(!disposed)receive.current(message);})};
    const local: Record<string, any> = {};
    const listen = (target: EventTarget, name: string, listener: EventListener, options?: AddEventListenerOptions|boolean) => {
      target.addEventListener(name,listener,options); cleanups.push(()=>target.removeEventListener(name,listener,options));
    };
    const scopeWindow: any = new Proxy(local, {
      get: (target,key) => {
        if (key in target) return target[key as string];
        if (key==="innerWidth") return element.clientWidth;
        if (key==="innerHeight") return element.clientHeight;
        const value=(view as any)[key]; return typeof value==="function" && !/^[A-Z]/.test(String(key)) ? value.bind(view) : value;
      },
      set: (target,key,value) => {target[key as string]=value;return true;},
    });
    const createElement=(tag:string,options?:ElementCreationOptions)=>{
      const node=doc.createElement(tag,options);
      const setAttribute=node.setAttribute.bind(node);
      node.setAttribute=(name,value)=>setAttribute(name,["src","href","poster"].includes(name)?absolute(value):value);
      for(const key of (tag.toLowerCase()==="style"?["src","href","poster","textContent"]:["src","href","poster"])){
        let prototype=Object.getPrototypeOf(node),descriptor:PropertyDescriptor|undefined;
        while(prototype&&!descriptor){descriptor=Object.getOwnPropertyDescriptor(prototype,key);prototype=Object.getPrototypeOf(prototype);}
        if(descriptor?.get&&descriptor?.set){const {get,set}=descriptor;Object.defineProperty(node,key,{configurable:true,get:()=>get.call(node),set:(value:string)=>set.call(node,key==="textContent"?css(String(value)):absolute(String(value)))});}
      }
      return node;
    };
    const scopedDoc: any = new Proxy(doc, {get: (_target,key) => {
      if(key==="createElement")return createElement;
      if(key==="body")return body;
      if(key==="documentElement")return html;
      if(key==="head")return html;
      if(key==="defaultView")return scopeWindow;
      if(key==="activeElement")return shadow.activeElement ?? body;
      if(key==="dispatchEvent")return (event:Event)=>body.dispatchEvent(event);
      if(key==="getElementById")return (ident:string)=>shadow.getElementById(ident);
      if(key==="querySelector"||key==="querySelectorAll")return (selector:string)=>(shadow[key] as any)(selector.replace(/(^|[\s,>+~])html(?=$|[\s.#:[>+~,])/g,"$1[data-theme-html]").replace(/(^|[\s,>+~])body(?=$|[\s.#:[>+~,])/g,"$1[data-theme-body]"));
      if(key==="addEventListener")return (name:string,listener:EventListener,options?:AddEventListenerOptions|boolean)=>listen(name==="visibilitychange"?doc:body,name,listener,options);
      if(key==="removeEventListener")return (name:string,listener:EventListener,options?:boolean)=>{doc.removeEventListener(name,listener,options);body.removeEventListener(name,listener,options);};
      const value=(doc as any)[key];return typeof value==="function"?value.bind(doc):value;
    }});
    Object.assign(local, {
      window:scopeWindow,self:scopeWindow,globalThis:scopeWindow,document:scopedDoc,parent,
      location:new URL(base),
      Image:function(width?:number,height?:number){const image=createElement("img") as HTMLImageElement;if(width!==undefined)image.width=width;if(height!==undefined)image.height=height;return image;},
      Audio:function(src?:string){const audio=createElement("audio") as HTMLAudioElement;if(src)audio.src=src;return audio;},
      addEventListener:(name:string,listener:EventListener,options?:AddEventListenerOptions|boolean)=>{
        if(["message","resize","pagehide","unload"].includes(name)){let set=listeners.get(name);if(!set)listeners.set(name,set=new Set());set.add(listener);}
        else listen(name.startsWith("key")?body:view,name,listener,options);
      },
      removeEventListener:(name:string,listener:EventListener,options?:boolean)=>{listeners.get(name)?.delete(listener);body.removeEventListener(name,listener,options);view.removeEventListener(name,listener,options);},
      dispatchEvent:(event:Event)=>{emit(event.type,event);return true;},
      setTimeout:(callback:TimerHandler,delay?:number,...args:any[])=>{const timer=view.setTimeout(()=>{timers.delete(timer);if(!disposed&&typeof callback==="function")callback(...args);},delay);timers.add(timer);return timer;},
      clearTimeout:(timer:number)=>{timers.delete(timer);view.clearTimeout(timer);},
      setInterval:(callback:()=>void,delay?:number)=>{const timer=view.setInterval(()=>{if(!disposed)callback();},delay);intervals.add(timer);return timer;},
      clearInterval:(timer:number)=>{intervals.delete(timer);view.clearInterval(timer);},
      requestAnimationFrame:(callback:FrameRequestCallback)=>{const frame=view.requestAnimationFrame(time=>{frames.delete(frame);if(!disposed)callback(time);});frames.add(frame);return frame;},
      cancelAnimationFrame:(frame:number)=>{frames.delete(frame);view.cancelAnimationFrame(frame);},
      fetch:(url:string|URL|Request,options?:RequestInit)=>view.fetch(typeof url==="string"?absolute(url):url,options),
    });
    port.current={ownerDocument:doc,postMessage:message=>{if(message.type==="state")element.dataset.themeConnected="true";emit("message",{data:message,source:parent,origin:view.location.origin});}};
    const resize=()=>{element.style.setProperty("--native-width",element.clientWidth+"px");element.style.setProperty("--native-height",element.clientHeight+"px");emit("resize",new Event("resize"));};
    const rewrite=(node:Element)=>{
      if(node.tagName==="STYLE"){const value=css(node.textContent??"");if(node.textContent!==value)node.textContent=value;}
      for(const name of ["src","href","poster"]){const value=node.getAttribute(name);if(value&&absolute(value)!==value)node.setAttribute(name,absolute(value));}
      for(const child of node.querySelectorAll("[src],[href],[poster],style"))rewrite(child);
    };
    const mutations=new MutationObserver(records=>{for(const record of records){if(record.type==="attributes")rewrite(record.target as Element);for(const node of record.addedNodes)if(node instanceof view.Element)rewrite(node as Element);}});
    mutations.observe(body,{childList:true,subtree:true,attributes:true,attributeFilter:["src","href","poster"]});
    const observer=new ResizeObserver(resize);observer.observe(element);resize();
    for(const script of definition.scripts)script(scopeWindow);
    return ()=>{
      emit("pagehide",new Event("pagehide"));emit("unload",new Event("unload"));disposed=true;
      port.current=null;observer.disconnect();mutations.disconnect();cleanups.forEach(clean=>clean());
      timers.forEach(timer=>view.clearTimeout(timer));intervals.forEach(timer=>view.clearInterval(timer));frames.forEach(frame=>view.cancelAnimationFrame(frame));
      for(const media of shadow.querySelectorAll("audio,video")){(media as HTMLMediaElement).pause();media.removeAttribute("src");(media as HTMLMediaElement).load();}
      shadow.replaceChildren();listeners.clear();
    };
  },[id,base,port]);
  return <div ref={host} data-native-theme={id} style={{position:"absolute",inset:0,overflow:"hidden",transform:"translateZ(0)"}}/>;
}

import {CSSProperties, ReactNode, useMemo} from "react";
import {bundledStyles} from "../engine/bundledStyles.generated";
import {activeTheme, themeFileUrl} from "../engine/registry";
import {useHome} from "../common";
import {useStage} from "../input";

function splitSelectors(text:string){
 const parts:string[]=[];let depth=0,start=0,quote="";
 for(let i=0;i<text.length;i++){const c=text[i];if(c==="\\"){i++;continue;}if(quote){if(c===quote)quote="";continue;}if(c==='"'||c==="'"){quote=c;continue;}if(c==="("||c==="[")depth++;else if(c===")"||c==="]")depth--;else if(c===","&&!depth){parts.push(text.slice(start,i));start=i+1;}}
 parts.push(text.slice(start));return parts;
}
/** Reuse visual rules only. The original HTML, scripts and bridge never run. */
export function NativeVisuals({id,children,style,page="home"}:{id:keyof typeof bundledStyles;children:ReactNode;style?:CSSProperties;page?:string}) {
 const {settings}=useHome(),theme=activeTheme(settings),{W,H}=useStage();
 const base=theme?themeFileUrl(theme,"")!:"";
 const css=useMemo(()=>{
  const root=`.dht-native-${id}`;
  const sheet=new CSSStyleSheet();
  sheet.replaceSync(bundledStyles[id].replace(/url\(\s*(['"]?)([^)'"\s]+)\1\s*\)/g,(_m,_q,url:string)=>`url("${new URL(url,base).href}")`).replace(/(-?[\d.]+)vw\b/g,"calc(var(--native-width) * $1 / 100)").replace(/(-?[\d.]+)vh\b/g,"calc(var(--native-height) * $1 / 100)"));
  const rules=(list:CSSRuleList):string=>Array.from(list).map(rule=>{
   if(rule instanceof CSSStyleRule){
    const selectors=splitSelectors(rule.selectorText).map(selector=>{
     const s=selector.trim().replace(/:root\b|\bbody\b|\bhtml\b/g,root).replace(/:focus-visible/g,":is(:focus-visible,[data-selected=true])");
     return s.startsWith(root)?s:`${root} ${s}`;
    }).join(",");
    return `${selectors}{${rule.style.cssText}}`;
   }
   if(rule instanceof CSSMediaRule)return `@media ${rule.conditionText}{${rules(rule.cssRules)}}`;
   if(rule instanceof CSSSupportsRule)return `@supports ${rule.conditionText}{${rules(rule.cssRules)}}`;
   return rule.cssText;
  }).join("\n");
  return rules(sheet.cssRules)+`\n${root}.no-motion *,${root}.no-motion *:before,${root}.no-motion *:after{animation:none!important;transition:none!important;scroll-behavior:auto!important}`;
 },[id,base]);
 return <div className={`dht-native-${id}${settings.animations?"":" no-motion still"}`} data-react-theme={id} data-page={page} style={{position:"absolute",inset:0,overflow:"hidden",color:"white",fontFamily:'"Segoe UI",sans-serif',"--native-width":`${W}px`,"--native-height":`${H}px`,...style} as CSSProperties}><style>{css}</style>{children}</div>;
}

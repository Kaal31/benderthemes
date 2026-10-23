/** Keep Steam's single navigation node and the theme's selected DOM control separate. */
type SteamNav={TakeFocus:()=>unknown};
type Scope={root:HTMLElement;selected:HTMLElement|null;nav:()=>SteamNav|null};
const scopes=new WeakMap<Document,Set<Scope>>();
const belongs=(scope:Scope,node:HTMLElement)=>scope.root.contains(node)||!!(node.closest('.dht-menu--old-beta-big-picture,.dht-menu--old-big-picture')&&scope.root.closest('[data-dht-root]')?.contains(node));
const usable=(scope:Scope,node:HTMLElement|null):node is HTMLElement=>!!node?.isConnected&&belongs(scope,node)&&!node.closest('[inert],.beta-page-departure,[data-transition-snapshot]');

export function installNativeThemeFocus(root:HTMLElement,nav:()=>SteamNav|null){
 const doc=root.ownerDocument,scope:Scope={root,selected:null,nav};
 let list=scopes.get(doc);if(!list){list=new Set();scopes.set(doc,list);}list.add(scope);
 const focus=(event?:Event)=>{
  if(typeof nav()?.TakeFocus!=='function')return;
  const target=(event?.target??doc.activeElement) as HTMLElement|null;
  if(!target||typeof target.closest!=='function'||target===root||!belongs(scope,target))return;
  const control=target.closest<HTMLElement>('button,a[href],input,select,textarea,[tabindex]');
  if(!usable(scope,control)||control===root)return;
  scope.selected?.removeAttribute('data-dht-control-focus');scope.selected=control;control.setAttribute('data-dht-control-focus','true');
  root.setAttribute('data-dht-native-focus','true');
  // Real text editing retains browser focus. Other controls use Steam's root
  // as the input receiver, avoiding OnDOMBlur clearing its navigation focus.
  if(!control.matches('input,select,textarea,[contenteditable=true]'))queueMicrotask(()=>{if(usable(scope,control)&&doc.activeElement===control)nav()?.TakeFocus();});
 };
 doc.addEventListener('focusin',focus,true);focus();
 return ()=>{doc.removeEventListener('focusin',focus,true);scope.selected?.removeAttribute('data-dht-control-focus');root.removeAttribute('data-dht-native-focus');list!.delete(scope);};
}

/** Page handlers must read the visible control, not Steam's outer input node. */
export function themeActiveElement(context:Document|HTMLElement|null|undefined):Element|null{
 if(!context)return null;
 const doc=context.nodeType===9?context as Document:context.ownerDocument!;
 const active=doc.activeElement;
 for(const scope of scopes.get(doc)??[]){
  if(typeof scope.nav()?.TakeFocus==='function'&&active===scope.root&&usable(scope,scope.selected))return scope.selected;
 }
 return active;
}

export const nativeControlFocusCSS=(css:string)=>css.replace(/:focus(?![-\w])/g,':is(:focus,[data-dht-control-focus=true])');

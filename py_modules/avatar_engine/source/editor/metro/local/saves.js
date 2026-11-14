// Local panel section "My avatars" (M8): twenty avatar slots kept in this browser, and moving an avatar in or out
// as a block of text (the site's sona code), a JSON file or the plain 1000-byte description.
// Behaviour follows the site's My Sonas rail and Import / Export dialog (bundle me/qc/Qf/im/Bv/Pv/Dv/_g/_v/Iv/Nv),
// with the account replaced by browser storage. Wording is the site's where it has some.
// Helpers: ./saves/codec.js (codes, files; node-tested in qa/m8) and ./saves/store.js (slots, thumbnails, migration).
import {SlotStore,SLOT_COUNT,NAME_MAX} from './saves/store.js';
import * as C from './saves/codec.js';

let store=null,origin=null,askState=null;   // askState: the open confirm dialog {buttons, cancel} (controller focus stays in it)   // origin: the code the avatar on the stage was opened from (byte-exact export)
const normCache=new Map();
const norm=b64=>{if(!normCache.has(b64))normCache.set(b64,C.normalise(b64));return normCache.get(b64);};

function ensureStore(ctx){
  if(store)return store;
  store=new SlotStore({fresh:!!ctx.data?.fresh});
  if(store.reason!=='fresh'){
    try{const r=store.migrate();if(r.moved)setTimeout(()=>ctx.toast(`Moved ${r.moved} saved avatar${r.moved===1?'':'s'} into slots`),0);
      store.migration=r;}catch(e){console.warn('Slot migration failed',e);}
  }
  if(store.active)origin=store.active.b64;
  return store;
}

const STYLE=`.sv{position:relative;min-height:100%;color:#222;font-size:15px}
.sv h2{margin:0;font-size:26px;font-weight:300}
.sv .svhead{display:flex;align-items:baseline;gap:14px;margin-bottom:10px}
.sv .svcount{color:#666;font-size:14px}
.sv .svsp{flex:1}
.sv button{font:inherit;cursor:pointer;border:0;background:#dcdcdc;color:#222;padding:7px 14px;min-height:34px}
.sv button:hover{background:#cfcfcf}
.sv button.go{background:#7cbf1e;color:#fff}
.sv button.go:hover{background:#6aa816}
.sv button.danger{background:#c8321e;color:#fff}
.sv button:disabled{opacity:.45;cursor:default}
.sv button:focus-visible,.sv input:focus-visible,.sv textarea:focus-visible{outline:2px solid #222;outline-offset:2px}
.sv .svbar{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-bottom:12px}
.sv .svstate{font-size:14px;color:#444;margin-left:6px}
.sv .svstate.dirty{color:#b5530b}
.sv .svnote{margin:8px 0;padding:8px 12px;background:#fff3c4;font-size:14px}
.sv .svnote.bad{background:#ffd9d2}
.sv .svsay{font-size:14px;color:#3f6f00;min-height:20px;margin:0 0 8px}
.sv .svsay.err{color:#b3261e}
.sv .slots{display:grid;grid-template-columns:repeat(auto-fill,minmax(132px,1fr));gap:12px}
.sv .slot{background:#fff;display:flex;flex-direction:column;box-shadow:0 1px 2px rgba(0,0,0,.12)}
.sv .slot.on{box-shadow:0 0 0 3px #7cbf1e}
.sv .slot.target .slotpic{outline:2px dashed #7cbf1e;outline-offset:-6px}
.sv .slotpic{position:relative;padding:0;aspect-ratio:3/4;background:#e6e6ea;display:flex;align-items:center;justify-content:center;overflow:hidden}
.sv .slotpic:hover{background:#d9dbe6}
.sv .slotpic img{width:100%;height:100%;object-fit:cover;display:block}
.sv .slotpic .plus{font-size:40px;color:#9a9aa8;font-weight:200}
.sv .slotpic .nopic{color:#777;font-size:13px}
.sv .slotn{position:absolute;left:6px;top:4px;font-size:13px;color:#fff;background:rgba(0,0,0,.45);padding:0 6px}
.sv .slotname{display:flex;align-items:center;gap:4px;padding:4px 6px 0;min-height:30px}
.sv .sname{flex:1;font-size:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.sv .slotname.unnamed .sname{color:#888}
.sv .slotname input{flex:1;min-width:0;font:inherit;font-size:14px;padding:3px 4px;border:1px solid #888}
.sv .slottools{display:flex;gap:4px;padding:4px 6px 6px}
.sv .slottools button,.sv .spen{padding:3px 8px;min-height:26px;font-size:13px}
.sv .spen{background:none}
.sv .slottools .del{margin-left:auto}
.sv .svfoot{display:flex;align-items:center;gap:12px;margin-top:14px;color:#666;font-size:13px}
.sv .xhalf{margin-bottom:20px}
.sv .xhalf h3{margin:0 0 4px;font-size:18px;font-weight:600}
.sv .xlead{margin:0 0 8px;color:#555;font-size:14px;max-width:70ch}
.sv textarea{width:100%;box-sizing:border-box;font:13px/1.35 Consolas,'Courier New',monospace;padding:6px;border:1px solid #aaa;background:#fff;resize:vertical}
.sv .xrow{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-top:6px}
.sv .xnote{font-size:14px;color:#555}
.sv .xsay.ok{color:#3f6f00}.sv .xsay.bad{color:#b3261e}
.sv .svask{position:fixed;inset:0;background:rgba(0,0,0,.35);display:flex;align-items:center;justify-content:center;z-index:1001}
.sv .askcard{background:#fff;box-shadow:0 6px 30px rgba(0,0,0,.35);width:min(480px,90%);padding:20px 22px}
.sv .askcard h3{margin:0 0 10px;font-size:20px;font-weight:400}
.sv .askrow{display:flex;gap:14px;align-items:flex-start}
.sv .askrow img{width:72px;aspect-ratio:3/4;object-fit:cover;background:#e6e6ea}
.sv .askrow p{margin:0;flex:1}
.sv .askbar{display:flex;flex-wrap:wrap;justify-content:flex-end;gap:8px;margin-top:18px}`;

const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!=null)n.textContent=text;return n;};
const button=(text,{cls='',title='',onClick}={})=>{const b=el('button',cls,text);b.type='button';if(title){b.title=title;b.setAttribute('aria-label',title);}if(onClick)b.onclick=onClick;return b;};
const today=()=>new Date().toISOString().slice(0,10);
function download(blob,name){
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.append(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(a.href),4000);return name;
}
async function copyText(textarea){
  try{await navigator.clipboard.writeText(textarea.value);return 'Copied.';}catch{textarea.focus();textarea.select();return 'Press Ctrl+C to copy.';}
}

export default {
  id:'saves',title:'My avatars',order:20,
  init(ctx){try{ensureStore(ctx);}catch(e){console.warn(e);}},
  mount(container,ctx){
    const st=ensureStore(ctx);
    let mode='browse',view='slots',pending=null,say={text:'',err:false},askResolve=null,alive=true,thumbRun=0;
    const root=el('div','sv'),style=el('style');style.textContent=STYLE;
    container.append(style,root);
    this._cleanup=()=>{alive=false;askState=null;askResolve?.(null);askResolve=null;};

    // ---------- what is on the stage, against the slots ----------
    const current=()=>{try{return C.descToBase64(ctx.desc());}catch{return null;}};
    const slotHolding=cur=>cur?st.slots.findIndex(s=>s&&norm(s.b64)===cur):-1;
    function stageState(){
      const cur=current(),a=st.active,label=a?st.label(a.index):'';
      if(a&&st.slots[a.index]){const dirty=norm(a.b64)!==cur;return {dirty,text:dirty?`Save to ${label} (unsaved changes)`:`Saved to ${label}`};}
      const i=slotHolding(cur);
      return i>=0?{dirty:false,text:`Saved to ${st.label(i)}`}:{dirty:true,text:'Save (unsaved changes)'};
    }
    const setSay=(text,err=false)=>{say={text,err};const n=root.querySelector('.svsay');if(n){n.textContent=text;n.className='svsay'+(err?' err':'');}};

    // ---------- confirm dialog (site `Is` / `Sg`) ----------
    function ask({title,body,options,thumb=null}){
      askResolve?.(null);
      const layer=el('div','svask'),card=el('div','askcard');card.setAttribute('role','dialog');card.setAttribute('aria-modal','true');
      const h=el('h3',null,title);h.id='svAskTitle';card.setAttribute('aria-labelledby',h.id);
      const row=el('div','askrow');
      if(thumb){const img=el('img');img.alt='';img.src=thumb;row.append(img);}
      row.append(el('p',null,body));
      const bar=el('div','askbar'),cancel=button('Cancel',{onClick:()=>done(null)});bar.append(cancel);
      for(const o of options)bar.append(button(o.label,{cls:o.danger?'danger':o.go?'go':'',onClick:()=>done(o.key)}));
      card.append(h,row,bar);layer.append(card);root.append(layer);
      setTimeout(()=>cancel.focus(),0);
      askState={buttons:[...bar.querySelectorAll('button')],cancel:()=>done(null)};
      function done(v){layer.remove();askState=null;const r=askResolve;askResolve=null;r?.(v);}
      return new Promise(r=>{askResolve=r;});
    }
    const confirm=async(o)=>(await ask({...o,options:[{key:'yes',label:o.ok,danger:o.danger!==false,go:o.danger===false}]}))==='yes';

    // ---------- actions ----------
    async function writeSlot(i,b64,{importing=false}={}){
      const was=st.slots[i];
      if(was&&!await confirm({title:`Write over ${st.label(i)}?`,body:`What is saved there now is replaced by ${importing?'the imported sona':'the figure on the stage'}. There is no undo.`,
        ok:'Write over it',thumb:st.thumb(was.b64)}))return false;
      if(!st.put(i,b64)){setSay(st.persistent?'That did not save. Browser storage is full or blocked.':'That did not save.',true);render();return false;}
      if(!importing){st.setActive(i,b64);origin=b64;}
      mode='browse';pending=null;
      setSay(importing?`Imported into slot ${i+1}.`:`Saved to ${st.label(i)}`);ctx.toast(importing?`Imported into slot ${i+1}`:`Saved to ${st.label(i)}`);
      render();return true;
    }
    function startPick(p,text){pending=p;mode='pick';view='slots';setSay(text);render();}
    async function saveCurrent(i){
      const cur=current();if(!cur){setSay('That avatar could not be written to a slot.',true);return;}
      const code=C.codeFor(ctx.desc(),origin);
      return writeSlot(i,code);
    }
    async function quickSave(){   // site `Rv`: save to the slot the avatar came from, else pick one
      const a=st.active;
      if(!a||!st.slots[a.index]){startPick({kind:'save'},'Pick a slot to save into');return;}
      await saveCurrent(a.index);
    }
    async function pick(i){
      const p=pending;
      if(p?.kind==='import'){await writeSlot(i,p.b64,{importing:true});return;}
      const ok=await saveCurrent(i);
      if(ok&&p?.thenWear!=null&&p.thenWear!==i)await wear(p.thenWear,{asked:true});
    }
    async function wear(i,{asked=false}={}){   // site `im`
      const s=st.slots[i];if(!s)return;
      if(!asked&&slotHolding(current())<0){
        const r=await ask({title:'Unsaved changes',body:`The avatar on the stage has changes that are not in any slot. Wearing slot ${i+1} replaces it.`,
          options:[{key:'save',label:'Save it to a slot first',go:true},{key:'drop',label:'Wear it anyway',danger:true}]});
        if(r==='save'){startPick({kind:'save',thenWear:i},'Pick a slot for the one you have now');return;}
        if(r!=='drop')return;
      }
      let desc;try{desc=C.descFromBase64(s.b64);}catch{setSay('That slot could not be opened.',true);ctx.toast('That slot could not be opened.');return;}
      try{await ctx.commit(desc);}catch(e){console.warn(e);setSay('That slot could not be opened.',true);return;}
      st.setActive(i,s.b64);origin=s.b64;mode='browse';pending=null;
      setSay(`Wearing ${st.label(i)}`);ctx.toast(`Wearing ${st.label(i)}`);if(alive)render();
    }
    async function clearSlot(i){   // site `Bv`
      const s=st.slots[i];if(!s)return;
      if(!await confirm({title:`Clear ${st.label(i)}?`,body:'The avatar saved there is deleted. There is no undo, and nothing else is affected.',ok:'Clear it',thumb:st.thumb(s.b64)}))return;
      const name=st.label(i);
      if(!st.clear(i)){setSay(`Could not clear ${name}. Nothing was changed.`,true);return;}
      if(origin===s.b64&&!st.active)origin=null;
      setSay(`${name} cleared`);render();
    }
    function rename(i,box){   // site `Dv`/`Pv`
      if(box.querySelector('input'))return;
      const input=el('input');input.type='text';input.value=st.slots[i]?.name||'';input.maxLength=NAME_MAX;input.placeholder=`Slot ${i+1}`;
      input.setAttribute('aria-label',`Name for slot ${i+1}`);box.replaceChildren(input);input.focus();input.select();
      let finished=false;
      const finish=keep=>{
        if(finished)return;finished=true;
        if(keep){const before=st.slots[i]?.name||'',next=input.value.replace(/\s+/g,' ').trim().slice(0,NAME_MAX);
          if(next!==before){if(st.rename(i,next))setSay(next?`Renamed to “${next}”`:'Name cleared');else setSay('That did not save.',true);}}
        if(alive)render();
      };
      input.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();finish(true);}});
      input.addEventListener('blur',()=>finish(true));
      input.addEventListener('change',()=>finish(true));   // controller A on the field (local-panel sends 'change')
    }

    // ---------- slot thumbnails: a small full-body render of each slot (tile-art 'avatar', in colour) ----------
    async function fillThumbs(){
      const run=++thumbRun;let tileArt=null;
      for(let i=0;i<SLOT_COUNT;i++){
        const s=st.slots[i];if(!s||st.thumb(s.b64))continue;
        if(!tileArt){try{({tileArt}=await import('../tile-art.js'));}catch{return;}}
        try{
          const {canvas}=await tileArt('avatar',{desc:C.descFromBase64(s.b64),focused:true,width:132,height:176});
          st.setThumb(s.b64,canvas.toDataURL('image/png'));
        }catch(e){console.warn('Slot thumbnail failed',e);continue;}
        if(!alive||run!==thumbRun)return;
        const pic=root.querySelector(`.slot[data-slot="${i}"] .slotpic`);if(pic&&st.slots[i]?.b64===s.b64)paintPic(pic,st.slots[i]);
      }
    }
    function paintPic(pic,s){
      const n=pic.querySelector('.slotn');pic.replaceChildren();
      const url=s&&st.thumb(s.b64);
      if(url){const img=el('img');img.alt='';img.decoding='async';img.src=url;pic.append(img);}
      else if(s)pic.append(el('span','nopic','saved'));
      else{const p=el('span','plus','+');p.setAttribute('aria-hidden','true');pic.append(p);}
      if(n)pic.append(n);
    }

    // ---------- views ----------
    function storageNote(){
      if(st.reason==='blocked')return el('p','svnote bad','This browser is not letting the page keep anything, so slots last only until this tab is closed. Use Import / Export to keep an avatar as text.');
      if(st.reason==='fresh')return el('p','svnote','Opened with ?fresh: slots are not read from or written to this browser, and last only until this tab is closed.');
      const m=st.migration;
      if(m&&!m.already&&(m.moved||m.full))return el('p','svnote',
        `Moved ${m.moved} avatar${m.moved===1?'':'s'} saved by the old editor into slots`+(m.full?`; ${m.full} did not fit (the old saves are still kept).`:'. The old saves are still kept.'));
      return null;
    }
    function renderSlots(){
      const picking=mode==='pick',cur=current(),stage=stageState();
      const head=el('div','svhead');head.append(el('h2',null,picking?'Save into which slot?':'My avatars'),el('span','svcount',`${st.count()} of ${SLOT_COUNT}`),el('span','svsp'));
      if(picking)head.append(button('×',{title:'Stop picking a slot',onClick:()=>{mode='browse';pending=null;setSay('');render();}}));
      const bar=el('div','svbar');
      if(picking)bar.append(el('span','svstate',pending?.kind==='import'?'Pick an empty one, or one to write over. The imported avatar goes there; the one on the stage stays.':'Pick an empty one, or one to write over.'));
      else{
        bar.append(button('Save',{cls:'go',title:stage.text,onClick:quickSave}),
          button('Save this one',{title:'Choose a slot to put the figure on the stage into',onClick:()=>startPick({kind:'save'},'Pick a slot to save into')}),
          button('Import / Export',{title:'Move a sona in or out as a block of text',onClick:()=>{view='transfer';setSay('');render();}}),
          el('span','svstate'+(stage.dirty?' dirty':''),stage.text));
      }
      const note=storageNote();
      const sayN=el('p','svsay'+(say.err?' err':''),say.text);sayN.setAttribute('role','status');
      const grid=el('div','slots');
      for(let i=0;i<SLOT_COUNT;i++){
        const s=st.slots[i],cell=el('div','slot'+(s?'':' empty')+(s&&cur&&norm(s.b64)===cur?' on':'')+(picking?' target':''));cell.dataset.slot=String(i);
        const pic=button('',{cls:'slotpic',title:picking?(s?`Write over slot ${i+1}`:`Save into slot ${i+1}`):(s?`Wear slot ${i+1}`:`Save this avatar into slot ${i+1}`),
          onClick:()=>picking?pick(i):s?wear(i):saveCurrent(i)});
        pic.dataset.act=picking?'pick':s?'wear':'save';
        pic.append(el('span','slotn',String(i+1)));paintPic(pic,s);cell.append(pic);
        if(s&&!picking){
          const nm=el('div','slotname'+(s.name?'':' unnamed'));
          nm.append(el('span','sname',s.name||`Slot ${i+1}`),button('✎',{cls:'spen',title:`Rename slot ${i+1}`,onClick:()=>rename(i,nm)}));
          const tools=el('div','slottools');
          tools.append(button('Save over',{title:'Save over this slot',onClick:()=>saveCurrent(i)}),
            button('Clear',{cls:'del',title:'Clear this slot',onClick:()=>clearSlot(i)}));
          cell.append(nm,tools);
        }
        grid.append(cell);
      }
      const foot=el('div','svfoot');
      foot.append(el('span',null,st.persistent?'Saved in this browser only. Clearing site data clears these.':'Not kept: this browser is not storing anything for the page.'));
      root.replaceChildren(head,bar,...(note?[note]:[]),sayN,grid,foot);
      fillThumbs();
    }
    function renderTransfer(){   // site `_g` (Import / Export dialog), as a page of this section
      const head=el('div','svhead');head.append(el('h2',null,'Import / Export'),el('span','svsp'),button('Back to slots',{onClick:()=>{view='slots';render();}}));
      let desc=null,code='';try{desc=ctx.desc();code=desc?C.codeFor(desc,origin):'';}catch{code='';}
      // Export
      const ex=el('div','xhalf');ex.append(el('h3',null,'Export'),el('p','xlead','The figure on the stage, as text. Paste it anywhere that carries words.'));
      const out=el('textarea');out.rows=5;out.readOnly=true;out.spellcheck=false;out.setAttribute('aria-label','Your sona as text');out.value=code?C.codeText(code):'';out.id='svOut';
      const exNote=el('span','xnote',code?'This is the figure on the stage right now.':'Nothing on the stage to export yet.');
      const exRow=el('div','xrow');
      exRow.append(button('Copy',{cls:'go',onClick:async()=>{exNote.textContent=await copyText(out);}}),
        button('Save as .txt',{onClick:()=>{exNote.textContent='Saved as '+download(new Blob([out.value],{type:'text/plain'}),`sona-${today()}.txt`);}}),
        button('Save the description (.bin)',{onClick:()=>{try{const b=C.base64ToBytes(code);exNote.textContent='Saved as '+download(new Blob([b],{type:'application/octet-stream'}),`sona-${today()}.bin`)+`, ${b.length} bytes.`;}
          catch(e){exNote.textContent='The description could not be written: '+String(e.message||e);}}}),
        button('Save as .json',{onClick:()=>{try{const j=JSON.parse(C.exportJSON(desc));j.original=code;
          exNote.textContent='Saved as '+download(new Blob([JSON.stringify(j,null,1)],{type:'application/json'}),`sona-${today()}.json`);}
          catch(e){exNote.textContent='The description could not be written: '+String(e.message||e);}}}),exNote);
      for(const b of exRow.querySelectorAll('button'))b.disabled=!code;
      ex.append(out,exRow);
      // Shopping list (site `Og`, via editor-flows shoppingList)
      const sl=el('div','xhalf');sl.append(el('h3',null,'Shopping list'),el('p','xlead','Everything on the figure with its marketplace id, for building it again on a real console.'));
      const list=el('textarea');list.rows=8;list.readOnly=true;list.spellcheck=false;list.setAttribute('aria-label','Shopping list');
      const slNote=el('span','xnote');
      import('../../editor-flows.js').then(F=>{try{list.value=desc?F.shoppingList(ctx.data.data.index,desc):'';}catch(e){console.warn('shopping list:',e);list.value='';}
        slNote.textContent=list.value?'Grouped by what has to be installed and what every console already has.':'Nothing on the stage yet.';});
      const slRow=el('div','xrow');
      slRow.append(button('Copy list',{cls:'go',onClick:async()=>{slNote.textContent=await copyText(list);}}),
        button('Save as .txt',{onClick:()=>{slNote.textContent='Saved as '+download(new Blob([list.value],{type:'text/plain'}),`sona-shopping-list-${today()}.txt`);}}),slNote);
      sl.append(list,slRow);
      // Import
      const im=el('div','xhalf');im.append(el('h3',null,'Import'),el('p','xlead','Paste a sona code, or open a .txt, .json or .bin you saved earlier. It is checked as you type.'));
      const input=el('textarea');input.rows=5;input.spellcheck=false;input.placeholder='Paste a sona code here';input.setAttribute('aria-label','Paste a sona code');input.id='svIn';
      const sayIn=el('span','xsay');sayIn.setAttribute('role','status');
      const file=el('input');file.type='file';file.accept='.txt,.json,.bin,text/plain,application/json,application/octet-stream';file.hidden=true;
      let found=null;
      const go=button('Choose a slot',{cls:'go',onClick:()=>{if(!found)return;
        startPick({kind:'import',b64:found.b64},st.firstFree()>=0?'Pick a slot for the imported sona.':'Every slot is full. Pick one to write over.');}});
      const wearNow=button('Wear it now',{title:'Put the imported avatar on the stage without saving it to a slot',onClick:async()=>{if(!found)return;
        if(slotHolding(current())<0){
          const r=await ask({title:'Unsaved changes',body:'The avatar on the stage has changes that are not in any slot. Wearing the imported one replaces it.',
            options:[{key:'drop',label:'Wear it anyway',danger:true}]});
          if(r!=='drop')return;
        }
        try{await ctx.commit(C.descFromBase64(found.b64));}catch(e){sayIn.textContent='That avatar could not be put on the stage.';sayIn.className='xsay bad';return;}
        origin=found.b64;st.setActive(-1);ctx.toast('Wearing the imported avatar');view='slots';setSay('Wearing the imported avatar. It is not in a slot yet.');render();}});
      go.disabled=wearNow.disabled=true;
      const check=()=>{
        found=null;go.disabled=wearNow.disabled=true;
        if(!input.value.trim()){sayIn.textContent='';sayIn.className='xsay';return;}
        try{const r=C.decodeSonaCode(input.value);found=r;go.disabled=wearNow.disabled=false;sayIn.textContent=C.looksGood(r.desc);sayIn.className='xsay ok';}
        catch{sayIn.textContent=C.NOT_A_CODE;sayIn.className='xsay bad';}
      };
      input.oninput=check;
      file.onchange=async e=>{
        const f=e.target.files&&e.target.files[0];e.target.value='';if(!f)return;
        try{const r=C.readAvatar(await f.arrayBuffer(),{name:f.name});input.value=C.codeText(r.b64);check();}
        catch(err){
          // A text file goes into the box as it is (as the site does), so people can see what was wrong with it.
          if(!/\.(json|bin)$/i.test(f.name)){try{input.value=await f.text();}catch{}check();if(input.value.trim())return;}
          found=null;go.disabled=wearNow.disabled=true;sayIn.textContent=/\.(json|bin)$/i.test(f.name)?String(err.message||err):C.NOT_A_CODE;sayIn.className='xsay bad';}
      };
      const imRow=el('div','xrow');imRow.append(button('Open a file',{onClick:()=>file.click()}),go,wearNow,sayIn);
      im.append(input,imRow,file);
      root.replaceChildren(head,ex,sl,im);
      setTimeout(()=>{try{input.focus();}catch{}},0);
    }
    function render(){if(!alive)return;view==='transfer'?renderTransfer():renderSlots();}
    render();
  },
  // While a confirm dialog is open, the controller stays inside it: D-pad moves between its buttons, A presses,
  // B cancels (instead of closing the panel).
  button(name){
    if(!askState)return false;
    const list=askState.buttons,i=list.indexOf(document.activeElement);
    if(name==='b'||name==='back'){askState.cancel();return true;}
    if(name==='a'){(list[i]||list[0]).click();return true;}
    if(['left','right','up','down'].includes(name)){const d=name==='right'||name==='down'?1:-1;list[(Math.max(i,0)+d+list.length)%list.length].focus();return true;}
    return true;
  },
  unmount(){try{this._cleanup?.();}catch{}this._cleanup=null;},
};

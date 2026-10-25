import type{WiiFont,WiiScene}from'./WiiNativeScene';
let cached:WiiFont|undefined;
/** Render the user's system font into an atlas; no Nintendo font is bundled. */
export function wiiSystemFont():WiiFont{
 if(cached)return cached;
 const canvas=document.createElement('canvas');canvas.width=512;canvas.height=256;
 const ctx=canvas.getContext('2d')!;ctx.font='26px Arial, sans-serif';ctx.textBaseline='alphabetic';ctx.fillStyle='#fff';
 const glyphs:WiiFont['glyphs']={};for(let i=32;i<127;i++){const char=String.fromCharCode(i),index=i-32,x=index%16*32,y=Math.floor(index/16)*40;ctx.fillText(char,x+2,y+29);glyphs[char]={page:0,x,y,left:0,advance:ctx.measureText(char).width,width:30};}
 return cached={pages:[canvas.toDataURL()],width:512,height:256,cellWidth:32,cellHeight:40,baseline:29,glyphs};
}
export function withWiiSystemFont(scene:WiiScene):WiiScene{return Object.keys(scene.fonts??{}).length?scene:{...scene,fonts:{themehubsystem:wiiSystemFont()}};}

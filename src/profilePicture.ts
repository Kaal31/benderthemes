import {getSettings,updateSettings} from "./settings";
export function profileAccountKey():string {
 const g=globalThis as any,u=g.App?.m_CurrentUser??g.currentUser??g.loginStore?.m_CurrentUser;
 const raw=u?.strSteamID??u?.steamid??u?.steamID;
 const id=(typeof raw==="string"||typeof raw==="number"?raw:raw?.ConvertTo64BitString?.())??u?.unAccountID??u?.strAccountName??g.loginStore?.m_strAccountName??u?.strPersonaName;
 return id?String(id):(g.__isThemePreview?"preview":"");
}
export function customProfilePicture():string|undefined {
 const key=profileAccountKey();return key?getSettings().profilePictures?.[key]:undefined;
}
export function setProfilePicture(image:string|undefined){
 const key=profileAccountKey();if(!key)throw new Error("Steam account is still loading. Try again in a moment.");
 updateSettings(s=>{const pics={...s.profilePictures};if(image)pics[key]=image;else delete pics[key];return {profilePictures:pics};});
}
async function preparePicture(blob:Blob){
 if(blob.size>10*1024*1024)throw new Error("Choose an image smaller than 10 MB.");
 const bitmap=await createImageBitmap(blob),canvas=document.createElement("canvas");canvas.width=canvas.height=256;
 const side=Math.min(bitmap.width,bitmap.height);canvas.getContext("2d")!.drawImage(bitmap,(bitmap.width-side)/2,(bitmap.height-side)/2,side,side,0,0,256,256);bitmap.close();
 setProfilePicture(canvas.toDataURL("image/png"));
}
export async function uploadProfilePicture(){
 try{
  if((globalThis as any).__isThemePreview){
   const input=document.createElement("input");input.type="file";input.accept="image/png,image/jpeg,image/webp";
   input.onchange=()=>{const file=input.files?.[0];if(file)preparePicture(file).catch(e=>alert(e.message));};input.click();return;
  }
  const {openFilePicker,callable}=await import("@decky/api");
  const picked=await openFilePicker(0 as any,"/home/deck/Pictures",true,true,undefined,["png","jpg","jpeg","webp"]);
  if(!picked?.realpath)return;
  const result=await callable<[string],{image?:string;error?:string}>("read_profile_picture")(picked.realpath);
  if(!result.image)throw new Error(result.error??"This image could not be opened.");
  await preparePicture(await (await fetch(result.image)).blob());
 }catch(e){alert(e instanceof Error?e.message:"This image could not be opened.");}
}

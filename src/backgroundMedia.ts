export type BackgroundMediaKind = "image" | "gif" | "video";
export function backgroundMediaKind(source:string|null|undefined):BackgroundMediaKind {
  if(!source)return "image";
  if(/^data:video\//i.test(source)||/\.(mp4|m4v|webm)(?:[?#]|$)/i.test(source))return "video";
  return /^data:image\/gif[;,]/i.test(source)||/\.gif(?:[?#]|$)/i.test(source)?"gif":"image";
}

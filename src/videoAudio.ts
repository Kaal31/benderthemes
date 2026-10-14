import { RefObject, useEffect } from "react";
import { duckMusic } from "./steam";
import { musicPlayer } from "./musicPlayer";
import { holdOtherMusic } from "./otherPlugins";

/** Acquire external ownership first: pausing our player must not restart external music. */
export function holdVideoAudio(): () => void {
  const releaseOthers=holdOtherMusic({includeGameTracks:true});
  const releasePlayer=musicPlayer.hold();
  duckMusic(true);
  let released=false;
  return()=>{
    if(released)return;
    released=true;
    // Our player may resume and acquire its own external hold before this one ends.
    releasePlayer();
    duckMusic(false);
    releaseOthers();
  };
}

/** Applies to trailers, segmented recordings and plain files; muted previews leave music alone. */
export function useVideoAudio(ref:RefObject<HTMLVideoElement|null>,enabled:boolean) {
  useEffect(()=>{
    const video=ref.current;
    if(!video||!enabled)return;
    let release:(()=>void)|undefined;
    const sync=()=>{
      const audible=!video.paused&&!video.ended&&!video.muted&&video.volume>0&&!video.error;
      if(audible&&!release)release=holdVideoAudio();
      else if(!audible&&release){release();release=undefined;}
    };
    const events=["play","playing","pause","ended","volumechange","error","emptied"];
    events.forEach(e=>video.addEventListener(e,sync));sync();
    return()=>{events.forEach(e=>video.removeEventListener(e,sync));release?.();};
  },[ref,enabled]);
}

import {createContext} from 'react';
/** Per-material texture tracks, independent of the pane's transform tracks. */
export const SwitchTextureMotionContext=createContext({channels:0,enabled:false});

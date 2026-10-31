import {createContext} from 'react';
/** Per-material texture tracks, independent of the pane's transform tracks. */
export const SwitchTextureMotionContext=createContext({channels:0,vertexMask:0,materialMask:0,enabled:false});

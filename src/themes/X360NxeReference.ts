// Numeric layout reference extracted from user-supplied ReLive Beta2 NXE scenes.
// No textures, fonts, sounds or third-party parser code are included here.
// XUI timeline frame positions are preserved; playback uses a 60 Hz adapter.
export const nxeReference = {
  "canvas": {
    "width": 852,
    "height": 480
  },
  "row": {
    "width": 272,
    "height": 32,
    "pitch": 30,
    "fontPt": 13,
    "textX": 4,
    "textY": 3
  },
  "focus": {
    "left": -4,
    "top": -2,
    "extraHeight": 2,
    "firstFrame": 5,
    "lastFrame": 13,
    "fromOpacity": 0.5,
    "toOpacity": 1,
    "fps": 60
  },
  "profile": {
    "title": {
      "x": 156.0,
      "y": 36.0,
      "width": 303.0,
      "height": 26.0
    },
    "list": {
      "x": 150.0,
      "y": 108.0,
      "width": 274.0,
      "height": 290.0
    },
    "detail": {
      "x": 434.0,
      "y": 100.0,
      "width": 269.0,
      "height": 302.0
    },
    "tabs": [
      {
        "x": 138.0,
        "y": 61.0,
        "width": 303.0
      },
      {
        "x": 442.0,
        "y": 61.0,
        "width": 268.0
      }
    ]
  },
  "preferences": {
    "title": {
      "x": 150.0,
      "y": 36.0,
      "width": 272.0,
      "height": 26.0
    },
    "firstRow": {
      "x": 150.0,
      "y": 69.0,
      "width": 272.0
    },
    "detail": {
      "x": 430.0,
      "y": 71.0,
      "width": 269.0,
      "height": 331.0
    }
  },
  // GameInfoScene.xur: list plus game metadata, not a library launch dialog.
  "gameInfo": {
    "title": {"x":150,"y":36,"width":272,"height":26},
    "list": {"x":148,"y":79,"width":272,"height":327},
    "detail": {"x":428,"y":71,"width":270,"height":332},
    "image": {"x":0,"y":0,"width":272,"height":62},
    "nameY":62,"statusY":83,"playtimeLabelY":104,"playtimeY":124,
    "lastPlayedLabelY":148,"lastPlayedY":166,"dividerY":225,"descriptionY":226
  },
  "fileBrowser": {
    "title": {
      "x": 150.0,
      "y": 36.0,
      "width": 272.0,
      "height": 26.0
    },
    "list": {
      "x": 153.0,
      "y": 72.0,
      "width": 545.0,
      "height": 312.0
    }
  }
} as const;
export function nxeRect(r:{x:number;y:number;width?:number;height?:number}){
 return {left:r.x*1280/nxeReference.canvas.width,top:r.y*720/nxeReference.canvas.height,...(r.width===undefined?{}:{width:r.width*1280/nxeReference.canvas.width}),...(r.height===undefined?{}:{height:r.height*720/nxeReference.canvas.height})};
}
export const nxeRowPitch=nxeReference.row.pitch*720/nxeReference.canvas.height;
export const nxeFocusDuration=(nxeReference.focus.lastFrame-nxeReference.focus.firstFrame)*1000/nxeReference.focus.fps;

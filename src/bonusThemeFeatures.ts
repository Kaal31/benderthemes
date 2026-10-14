// Our bonus looks only. Tags describe the supplied experience, not an arbitrary
// video's import support or whether the user currently has animations enabled.
export type BonusFeature = "interactive" | "video" | "animated" | "static";
export const BONUS_THEME_FEATURES: Readonly<Record<string, readonly BonusFeature[]>> = {
  onyx:["interactive","static"], silver:["interactive","static"],
  aero:["static"], aero2:["static"], dial:["static"],
  castle:["video"], republic:["video"], minecraft:["interactive"],
  pain:["static"], nazarick:["video"], iisu:["static"],
  "blue-glass":["interactive","static"], gameamp:["interactive","static"],
};
export const BONUS_FEATURE_LABELS: Record<BonusFeature,{label:string;description:string}> = {
  interactive:{label:"Interactive",description:"Extra interactive controls, such as a touch wheel, 3D player or movable dashboard elements."},
  video:{label:"Video background",description:"Includes a looping video backdrop, with a still image fallback. This does not mean arbitrary video import is supported."},
  animated:{label:"Animated",description:"Drawn motion and scene effects rather than a recorded video background."},
  static:{label:"Static",description:"The supplied backdrop is a still image or fixed surface; interface elements can still animate."},
};
export const bonusThemeFeatures = (id:string): readonly BonusFeature[] => Object.prototype.hasOwnProperty.call(BONUS_THEME_FEATURES,id) ? BONUS_THEME_FEATURES[id] : [];

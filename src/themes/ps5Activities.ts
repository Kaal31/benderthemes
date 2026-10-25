import { useAchievementList, AchList } from "../activity";
import { fmtLastPlayed, fmtPlaytime, Game } from "../library";

export interface Ps5ActivityCard {
  id: string;
  label: string;
  title: string;
  sub: string;
  extra?: string;
  progress?: number;
  images?: { image: string; name: string }[];
  run: () => void;
}

const number = (value: unknown): number | undefined => {
  if (typeof value !== "number" && typeof value !== "string") return undefined;
  if (value === "") return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

export function ps5ActivityCards(game: Game, earned: AchList, details: () => void, trophies: () => void): Ps5ActivityCard[] {
  const recentMinutes = number(game.overview?.minutes_playtime_last_two_weeks);
  const reviews = game.shortcut ? undefined : number(game.overview?.review_percentage_with_bombs);
  const critic = game.shortcut ? undefined : number(game.overview?.metacritic_score);
  const bytes = number(game.overview?.size_on_disk);
  const validReviews = reviews !== undefined && reviews >= 0 && reviews <= 100;
  const validCritic = critic !== undefined && critic > 0 && critic <= 100;
  const hasProgress = !game.shortcut && Number.isFinite(earned.total) && earned.total > 0 && Number.isFinite(earned.unlocked);
  const unlocked = hasProgress ? Math.max(0, Math.min(earned.unlocked, earned.total)) : 0;
  const percent = hasProgress ? Math.round(unlocked / earned.total * 100) : undefined;
  return [
    { id: "time", label: "Your time", title: game.playtime > 0 ? fmtPlaytime(game.playtime, game.lastPlayed, true) : "Time not recorded", sub: "Last played · " + fmtLastPlayed(game.lastPlayed), extra: recentMinutes && recentMinutes > 0 ? fmtPlaytime(recentMinutes, 0) + " in 2 weeks" : undefined, run: details },
    game.shortcut
      ? { id: "details", label: "Game details", title: "Non-Steam game", sub: "Details and plugin integrations", run: details }
      : { id: "achievements", label: "Achievements", title: hasProgress ? `${unlocked} / ${earned.total} unlocked` : "View achievements", sub: percent === undefined ? "Open your achievement collection" : `${percent}% complete`, progress: percent, images: earned.recent.filter(item => item.image).slice(0, 3).map(item => ({ image: item.image!, name: item.name })), run: trophies },
    validReviews || validCritic
      ? { id: "reviews", label: "Reviews", title: validReviews ? `${reviews}% positive` : `Metacritic · ${critic}`, sub: [validCritic && validReviews ? `Metacritic ${critic}` : undefined, game.installed && bytes && bytes > 0 ? `${(bytes / (1024 ** 3)).toFixed(1)} GB installed` : undefined].filter(Boolean).join(" · ") || "Open game details and reviews", run: details }
      : { id: "library", label: "Your library", title: game.installed ? "Ready to play" : "Not installed", sub: game.installed && bytes && bytes > 0 ? `${(bytes / (1024 ** 3)).toFixed(1)} GB installed` : game.installed ? "Manage game and view details" : "Open game details to install", run: details },
  ];
}

export function usePs5Activities(game: Game | undefined, details: () => void, trophies: () => void): Ps5ActivityCard[] {
  const earned = useAchievementList(game, 450);
  return game ? ps5ActivityCards(game, earned, details, trophies) : [];
}

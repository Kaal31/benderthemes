// The ThemeHub logo (four tiles, a home on the first): next to the title in every Hub style (Marketplace.tsx) and on
// the welcome card of the first-run setup (Onboarding.tsx). Drawn from the owner's 1474 px artwork (tiles 225-1249).
export const HubLogo = ({ className = "dht-hub-logo" }: { className?: string }) => (
  <svg className={className} viewBox="225 225 1025 1025" aria-hidden="true"><rect x="225" y="225" width="472" height="472" rx="112" fill="#3cdcff"/><rect x="778" y="225" width="472" height="472" rx="112" fill="#788bff"/><rect x="225" y="778" width="472" height="472" rx="112" fill="#ff4ed8"/><rect x="778" y="778" width="472" height="472" rx="112" fill="#ffb840"/><path d="M312 470 441 348Q460 332 479 348L608 470 575 506 460 401 346 506Z" fill="#0a0c1e"/><rect x="385" y="489" width="152" height="85" fill="#0a0c1e"/></svg>
);

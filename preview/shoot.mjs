import { chromium } from "playwright";
const themes = ["vita", "ps2", "ps3", "psp", "ps4", "ps5", "x360"];
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const p = await b.newPage({ viewport: { width: 1304, height: 880 } });
const errs = [];
p.on("pageerror", (e) => errs.push(e.message));
p.on("console", (m) => m.type() === "error" && errs.push(m.text()));
const url = "file://" + process.cwd() + "/preview/preview.html";
const steps = JSON.parse(process.argv[2] || "{}");
for (const t of process.argv[3] ? process.argv[3].split(",") : themes) {
  await p.goto(url + "?still=1&theme=" + t);
  await p.waitForTimeout(700);
  for (const k of steps[t] || []) { await p.keyboard.press(k); await p.waitForTimeout(250); }
  await p.waitForTimeout(600);
  await p.screenshot({ path: `/tmp/claude-0/shots/${t}${process.argv[4] || ""}.png` });
}
console.log(errs.length ? errs.join("\n") : "no errors");
await b.close();

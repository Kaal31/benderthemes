import deckyPlugin from "@decky/rollup";
import replace from "@rollup/plugin-replace";
import { readFileSync } from "node:fs";

export default deckyPlugin({
  plugins: [replace({ preventAssignment: true, __DHT_VERSION__: JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8')).version })],
})

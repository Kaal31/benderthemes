import assert from "node:assert/strict";
import { build } from "esbuild";

const result = await build({ entryPoints: ["src/ps3/rafLayers.ts"], bundle: true, write: false, platform: "node", format: "esm" });
const { backgroundActors } = await import(`data:text/javascript;base64,${Buffer.from(result.outputFiles[0].text).toString("base64")}`);
const scene = {
  actors: [{ id: "actor_background", model: "plane", material: "solid" }, { id: "snow", model: "plane", material: "alpha" }, { id: "world", model: "world", material: "solid" }],
  models: { plane: { mesh: "quad" }, world: { mesh: "complex" } },
  meshes: { quad: { vertexes: 4, indexes: [0, 1, 2, 2, 3, 0] }, complex: { vertexes: 100, indexes: [0, 1, 2] } },
  materials: { solid: { effect: "pure_texture", textures: [] }, alpha: { effect: "pure_texture_alpha_1", textures: [] } },
};
assert.deepEqual([...backgroundActors(scene)], ["actor_background"]);
assert.equal(backgroundActors({ ...scene, actors: [] }).size, 0);
assert.deepEqual([...backgroundActors({ ...scene, actors: [{ id: "BG01", model: "plane", material: "alpha" }] })], ["BG01"]);
console.log("PASS: PS3 background and transparent effect actor classification");

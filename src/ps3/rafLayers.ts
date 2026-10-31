import type { RafSceneData } from "./rafScene";

export type RafLayers = "all" | "background" | "effects";

export function backgroundActors(scene: RafSceneData): Set<string> {
  const result = new Set<string>();
  for (const actor of scene.actors) {
    const material = scene.materials[actor.material];
    const mesh = scene.meshes[scene.models[actor.model]?.mesh ?? ""];
    const name = `${actor.id ?? actor.name ?? ""} ${actor.model ?? ""} ${actor.material ?? ""} ${material?.textures.join(" ") ?? ""}`;
    const named = /(?:^|[_\s-])(?:bg\d*|background|backdrop|wallpaper)(?:$|[_\s.\/-])/i.test(name);
    const flat = mesh && mesh.vertexes <= 4 && mesh.indexes.length <= 6;
    const opaque = material && !/alpha|add|blend/i.test(material.effect);
    if (named || (flat && opaque)) result.add(actor.id ?? actor.name);
  }
  return result;
}

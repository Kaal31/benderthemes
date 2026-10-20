// Source-backed fixed-tick animation primitives; shared with the isolated validation model.
export const clone = value => structuredClone(value);
export function tickCover(state, target, selected = false, hz = 60) {
  let rate = (selected ? .07 : .1) * (hz === 50 ? 1.2 : 1);
  const distance2 = state.pos.reduce((sum, v, i) => sum + (target.pos[i] - v) ** 2, 0);
  if (distance2 < .5) rate *= .5;
  for (const key of ['pos', 'angle', 'scale'])
    state[key] = state[key].map((v, i) => v + (target[key][i] - v) * rate);
}
export function tickCamera(current, target) {
  return current.map((v, i) => v + (target[i] - v) * .2);
}
export function oscillation(tick, speed, amplitude, camera = false) {
  return amplitude.map((a, i) => a * (i === 1 && !camera ? Math.sin : Math.cos)(tick * .005 * speed[i]));
}
export function displayed(state, tick, speed, amplitude, center) {
  const result = clone(state);
  if (center) result.angle = result.angle.map((v, i) => v + oscillation(tick, speed, amplitude)[i]);
  return result;
}
// Native single-row shift transfers oscillation between the two center states.
// Caller supplies final edge targets after changing library selection.
export function navigate(states, targets, direction, tick, speed, amplitude) {
  const center = Math.floor(states.length / 2), osc = oscillation(tick, speed, amplitude);
  const moved = clone(states);
  moved[center].angle = moved[center].angle.map((v, i) => v + osc[i]);
  if (direction === 1) { moved.shift(); moved.push(clone(targets.at(-1))); }
  else { moved.pop(); moved.unshift(clone(targets[0])); }
  moved[center].angle = moved[center].angle.map((v, i) => v - osc[i]);
  return moved;
}
export function advance(model, elapsedMs) {
  model.remainder += elapsedMs;
  const step = 1000 / model.hz;
  while (model.remainder + 1e-8 >= step) {
    tickCover(model.state, model.target, model.selected, model.hz);
    model.ticks++;
    model.remainder -= step;
  }
}

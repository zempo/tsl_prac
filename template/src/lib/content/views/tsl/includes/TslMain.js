// @ts-nocheck
import { Fn, add, cos, mul } from "three/tsl";

export const pal = Fn(([t, a, b, c, d]) => {
  const TAU = Math.PI * 2;
  const phase = add(mul(c, t), d);
  const cosine = cos(mul(TAU, phase));
  return add(a, mul(b, cosine));
});

// @ts-nocheck
import { color } from "three/tsl";
import {
  cnoise,
  coswarp,
  line,
  modPolar,
  pal,
  PI,
  smoothMod,
  stroke,
  TAU,
  tslSwitch,
  uvRipple,
} from "./includes/TslMain.js";

/**
 * @param {Uniform<float>} _t: time
 * @param {Uniform<float>} _seed: seed
 * @param {Uniform<float>} perm: permutation
 * */
export const c_diffuse = (_t, _seed, perm = 0) => {
  let c_temp = color(0.82, 0.26, 0.8);
  let c_brain = c_temp;
  let c_bricks = c_temp;
  let c_camo = c_temp;
  let c_caustics = c_temp;
  let c_cave = c_temp;

  let c_out = tslSwitch(perm, [[0, c_brain]], c_temp);

  return c_out;
};

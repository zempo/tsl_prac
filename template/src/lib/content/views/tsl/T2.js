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
import { brainTex } from "./includes/TslAux.js";

/**
 * @param {Uniform<float>} _t: time
 * @param {Uniform<float>} _seed: seed
 * @param {Uniform<float>} perm: permutation
 * */
export const c_diffuse = (_t, _seed, perm = 0) => {
  // 46
  let c_temp = color(0.2, 0.6, 0.8);
  let c_brain = brainTex(2, 0.5, _seed);
  let c_bricks = c_temp;
  let c_camo = c_temp;
  let c_caustics = c_temp;
  let c_cave = c_temp;

  let c_out = tslSwitch(
    perm,
    [
      [0, c_brain],
      [1, c_bricks],
      [2, c_camo],
      [3, c_caustics],
      [4, c_cave],
    ],
    c_temp
  );

  return c_out;
};

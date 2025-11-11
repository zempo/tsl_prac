// @ts-nocheck
import { color, vec3 } from "three/tsl";
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
  let c_brain = brainTex({ seed: _seed });
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

// Create a separate function for normals
export const c_normal = (_t, _seed, perm = 0) => {
  let n_temp = vec3(0.5, 0.5, 1.0); // Default flat normal
  let n_brain = brainTex.normal({ seed: _seed }); // Get the normal from brainTex

  let n_out = tslSwitch(
    perm,
    [
      [0, n_brain],
      [1, n_temp],
      [2, n_temp],
      [3, n_temp],
      [4, n_temp],
    ],
    n_temp
  );

  return n_out;
};

//@ts-nocheck
import * as THREE from "three";
import {
  circleDecor,
  caustics,
  neonLights,
  isolayers,
} from "./includes/TslTex.js";
// import {
//   circleDecor,
//   neonLights,
//   isolayers,
//   caustics,
//   translator,
// } from "tsl-textures";
import {
  Fn,
  If,
  PI2,
  atan2,
  color,
  frontFacing,
  output,
  positionLocal,
  uniform,
  vec4,
  float,
  sin,
  cos,
  mul,
  add,
  vec3,
  uv,
  fract,
  abs,
  select,
  equal,
  log,
} from "three/tsl";
import {
  coswarp,
  line,
  pal,
  smoothMod,
  tslSwitch,
} from "./includes/TslMain.js";

export function fragC(initial = "crimson") {
  const uColor = uniform(color(initial));

  let frag = Fn(() => {
    output.assign(vec4(uColor, 1.0));
  });

  return output;
}

export const circ = (mat) => {};

export const red = Fn(({ time, intensity }) => {
  const r = float(1).add(cos(time)).mul(0.25);
  return vec4(r.mul(intensity), 0, 0, 1);
});

export const amb = Fn(({ color, time, intensity }) => {
  const r = float(color.r)
    .add(abs(cos(time)))
    .mul(0.25);
  const g = float(color.g)
    .add(abs(cos(time)))
    .mul(0.25);
  const b = float(color.b)
    .add(abs(cos(time)))
    .mul(0.25);
  return vec4(r.mul(intensity), g.mul(intensity), b.mul(intensity), 1);
});

/**
 * @param {Uniform<float>} _t: time
 * @param {Uniform<float>} _seed: seed
 * @param {Uniform<float>} perm: permutation
 * */
export const c_circ = (_t, _seed, perm = 0) => {
  // * uv
  let uv3 = vec3(uv(), 0.0); // promote uv() to vec3
  let uv_w = coswarp(uv3, 1, _t);

  let cp1 = pal(
    uv().x,
    color(1, 1, 1),
    color(0.5, 0.5, 0.5),
    color(1, 1, 1),
    color(0, 0.33, 0.7)
  );
  let cp2 = pal(
    uv().x,
    color(0.25, 0.25, 0.25),
    color(0.5, 0.5, 0.5),
    color(1, 1, 1),
    color(0.7, 0.33, 0)
  );
  let cp3 = pal(
    uv().y,
    color(0.3, 0.3, 0.5),
    color(0.3, 0.3, 0.5),
    color(0.8, 0.8, 0.5),
    color(0.1, 0.3, 0.7)
  );

  let c1 = circleDecor({
    scale: uniform(2),
    grains: uniform(0.2),
    complexity: uniform(1),
    blur: uniform(0.912),
    color: cp1,
    background: cp2,
    seed: _seed,
  });

  let c1_i = vec3(
    line(uv().x, fract(uv().mul(9.95).add(_t)).y, 0.085, 0.05).add(
      line(uv().y, fract(uv().mul(14.95).add(_t)).x, 0.085, 0.05)
    ),
    line(uv().y, fract(uv().mul(15).add(_t)).x, 0.085, 0.05),
    line(uv().x, fract(uv().mul(10).add(_t)).y, 0.085, 0.05).add(
      line(uv().y, fract(uv().mul(15.05).add(_t)).x, 0.085, 0.05)
    )
  );

  let c2 = isolayers({
    scale: uniform(2),
    layers: uniform(10),
    edge: uniform(0.5),
    darkness: uniform(0.5),
    color: new THREE.Color(16777200),
    background: new THREE.Color(16728128),
    seed: _seed,
  });

  let c2_i = vec3(
    line(uv().x, fract(uv().mul(9.95).add(_t)).y, 0.085, 0.05).add(
      line(uv().y, fract(uv().mul(14.95).add(_t)).x, 0.085, 0.05)
    ),
    line(uv().y, fract(uv().mul(15).add(_t)).x, 0.085, 0.05),
    line(uv().x, fract(uv().mul(10).add(_t)).y, 0.085, 0.05).add(
      line(uv().y, fract(uv().mul(15.05).add(_t)).x, 0.085, 0.05)
    )
  );

  let c3 = caustics({
    scale: uniform(2),
    speed: uniform(0),
    color: cp3,
    seed: _seed,
  });

  let p4 = sin(uv_w.x.mul(5.0)).mul(0.5).add(0.5);
  // p4 = smoothMod(p4, 2, 0.1);
  let c4 = vec3(fract(uv_w.mul(p4.mul(1.5))), p4);
  // fract(uv_w.mul(20)), p4
  // const c_out = select(
  //   equal(perm, 0),
  //   add(c1, c1_i), // if perm == 0
  //   add(c1, c1_i) // else (you can change this later)
  // );
  let a1 = c2;
  let a2 = add(c1, c1_i);
  let a3 = c3;
  let a4 = c4;
  let a5 = c4;
  let a6 = c4;
  let a7 = c4;
  let a8 = c4;
  let a9 = c4;
  let a10 = c4;

  let c_out = tslSwitch(
    perm,
    [
      [0, a1],
      [1, a2],
      [2, a3],
      [3, a4],
      [4, a5],
      [5, a6],
      [6, a7],
      [7, a8],
      [8, a9],
      [9, a10],
    ],
    a1
  );

  return c_out;
};

// Animated mix
// const t = sin(uTime.mul(0.5)).mul(0.5).add(0.5);
// const gradient = mix(color(0xff0000), color(0x0000ff), uv().x);
// const blended = mix(c1, c3, t);

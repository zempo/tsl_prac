// @ts-nocheck
import {
  Fn,
  min,
  sub,
  max,
  vec3,
  float,
  add,
  If,
  select,
  sin,
  cos,
  vec4,
  mul,
  cross,
  remap,
  pow,
  log2,
  mat4,
  smoothstep,
  positionGeometry,
  dFdx,
  dFdy,
  transformNormalToView,
  mx_noise_float,
  uniform,
  exp,
  mx_fractal_noise_float,
  mix,
  time,
  round,
  pow2,
  abs,
  or,
  acos,
  clamp,
  normalLocal,
  tangentLocal,
  Loop,
  floor,
  oneMinus,
  screenSize,
  screenUV,
  equirectUV,
  div,
  remapClamp,
  sqrt,
  mat2,
  mod,
  distance,
  radians,
  matcapUV,
  mx_worley_noise_float,
  sign,
  tan,
  screenCoordinate,
  reciprocal,
  vec2,
  mx_worley_noise_vec2,
  mx_fractal_noise_vec3,
  mx_worley_noise_vec3,
} from "three/tsl";

export const brainTex = Fn(({ scale = 2, smooth = 0.5, seed = 0 }) => {
  let pos = positionGeometry.mul(float(scale).div(3)).add(seed);
  let oct = exp(smooth.oneMinus().mul(2));
  let n = mx_fractal_noise_float(pos.mul(5), oct)
    .add(1)
    .div(2)
    .clamp(0, 1)
    .pow(2);

  // let c_n = mix()

  return vec3(n);
});
// return mix(params.color, params.background, n);

// var pos = positionGeometry
//   .mul(exp(params.scale.div(3)))
//   .add(params.seed)
//   .toVar();

// var octaves = exp(params.smooth.oneMinus().mul(2));

// var n = mx_fractal_noise_float(pos.mul(5), octaves)
//   .add(1)
//   .div(2)
//   .clamp(0, 1)
//   .pow(2);

// import * as THREE from "three";
// import { brain } from "tsl-textures";
// model.material.colorNode = brain ( {
// 	scale: 2,
// 	smooth: 0.5,
// 	wave: 0.5,
// 	speed: 2.5,
// 	color: new THREE.Color(16765136),
// 	background: new THREE.Color(5242880),
// 	seed: 0
// } );

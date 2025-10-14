//@ts-nocheck
import * as THREE from "three";
import { circleDecor, caustics, neonLights } from "./includes/TslLib.js";
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
} from "three/tsl";

export function fragC(initial = "crimson") {
  const uColor = uniform(color(initial));

  let frag = Fn(() => {
    output.assign(vec4(uColor, 1.0));
  });

  return output;
}

export const circ = (mat) => {};

export const red = Fn(({ time, intensity }) => {
  const r = float(1).add(cos(time)).mul(0.5);
  return vec4(r.mul(intensity), 0, 0, 1);
});

export const amb = Fn(({ color, time, intensity }) => {
  const r = float(color.r).add(cos(time)).mul(0.5);
  const g = float(color.g).add(cos(time)).mul(0.5);
  const b = float(color.b).add(cos(time)).mul(0.5);
  return vec4(r.mul(intensity), g.mul(intensity), b.mul(intensity), 1);
});

const pink = new THREE.Color(0xdbff90);
const green = new THREE.Color(0xd2f1a5);

// Use positional parameters correctly
const c1 = circleDecor(
  uniform(2),
  uniform(0.2),
  uniform(1),
  uniform(0.2),
  pink,
  green,
  uniform(10)
);

const c2 = circleDecor(
  uniform(2),
  uniform(0.2),
  uniform(1),
  uniform(0.2),
  color(0xdb7090),
  color(0xd2f1a5),
  uniform(10)
);

const c3 = caustics(uniform(2), uniform(0), color(0xfffaff), uniform(0));

const c4 = neonLights(
  uniform(1.5), // scale
  uniform(0.66), // thickness
  uniform(0), // speed
  color(0xff0000), // color1 (red)
  color(0x000000), // color2 (green)
  color(0x00ffff), // color3 (blue)
  color(0x000000), // background (black)
  uniform(0) // seed
);

// Animated mix
// const t = sin(uTime.mul(0.5)).mul(0.5).add(0.5);
// const gradient = mix(color(0xff0000), color(0x0000ff), uv().x);
// const blended = mix(c1, c3, t);

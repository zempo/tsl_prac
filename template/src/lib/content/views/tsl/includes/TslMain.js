// @ts-nocheck
import {
  Fn,
  add,
  cos,
  mul,
  sub,
  smoothstep,
  div,
  select,
  equal,
  pow,
  step,
  clamp,
  length,
  atan,
  vec2,
  vec3,
  sin,
} from "three/tsl";

const PI = Math.PI;
const TAU = Math.PI * 2;
const E = 2.71828182845904523536028747135266;
const PHI = 1.61803398874989484820458683436564;
const GAMMA = 0.57721566490153286060651209008240243;
const GOLDEN_RATIO = 1.61803398874989484820458683436564;
const GOLDEN_ANGLE = 2.39996322973; // 2π/φ ≈ 137.5° in radians

/**
 * Generates a smooth oscillating color palette or value pattern.
 *
 * Based on IQ’s palette function: `pal(t, a, b, c, d) = a + b * cos(2π(c * t + d))`.
 * Useful for creating cyclical color gradients or procedural animations.
 *
 * @param {Node<float>} t - The time or phase input (typically 0–1, can be animated).
 * @param {Node<float> | Node<Vector3>} a - Base offset (acts as the midpoint color or value).
 * @param {Node<float> | Node<Vector3>} b - Amplitude (range or contrast of oscillation).
 * @param {Node<float> | Node<Vector3>} c - Frequency multiplier controlling how fast colors cycle.
 * @param {Node<float> | Node<Vector3>} d - Phase shift to offset the cycle.
 * @returns {Node<float> | Node<Vector3>} The computed palette value or color at phase `t`.
 */
export const pal = Fn(([t, a, b, c, d]) => {
  const TAU = Math.PI * 2;
  const phase = add(mul(c, t), d);
  const cosine = cos(mul(TAU, phase));
  return add(a, mul(b, cosine));
});

// ********************** SHAPES / SDFs

/**
 * Creates a smooth anti-aliased line mask.
 *
 * @param {Node<float>} x - The center X coordinate.
 * @param {Node<float>} y - The sample Y coordinate.
 * @param {Node<float>} line_w - The line width.
 * @param {Node<float>} edge_w - The smooth edge width (controls softness).
 * @returns {Node<float>} A value from 0–1 representing the line intensity.
 */
export const line = Fn(([x, y, line_w, edge_w]) => {
  return sub(
    smoothstep(sub(sub(x, div(line_w, 2)), edge_w), sub(x, div(line_w, 2)), y),
    smoothstep(add(x, div(line_w, 2)), add(add(x, div(line_w, 2)), edge_w), y)
  );
});

/**
 * Draws a circular ring or outline with smooth edges.
 *
 * @param {Node<vec2>} pt - The input UV or position vector.
 * @param {Node<vec2>} center - The center of the circle.
 * @param {Node<float>} radius - The radius of the circle.
 * @param {Node<float>} line_width - The thickness of the circle outline.
 * @param {Node<float>} edge_thickness - The smooth transition width.
 * @returns {Node<float>} A smooth mask where 1.0 represents the circle line.
 */
export const circle = Fn(([pt, center, radius, line_width, edge_thickness]) => {
  const p = sub(pt, center);
  const len = length(p);
  const inner = smoothstep(
    sub(sub(radius, div(line_width, 2)), edge_thickness),
    sub(radius, div(line_width, 2)),
    len
  );
  const outer = smoothstep(
    add(radius, div(line_width, 2)),
    add(add(radius, div(line_width, 2)), edge_thickness),
    len
  );
  return sub(inner, outer);
});

//  ???????????????????????????????????????????????????????
//  ******************************************************* UV Warping

/**
 * Warps a 3D vector using layered cosine distortion, creating flowing motion.
 *
 * @param {Node<vec3>} trip - Input/output vector (mutated in place).
 * @param {Node<float>} warpsScale - Overall scale of the warp intensity.
 * @param {Node<float>} u_time - Animated time uniform.
 * @returns {Node<vec3>} The warped vector.
 */
export const coswarp = Fn(([trip, warpsScale, u_time]) => {
  let t = trip;
  t = add(
    t,
    mul(warpsScale, 0.1, cos(add(mul(3.0, t.yzx), mul(u_time, 0.25))))
  );
  t = add(
    t,
    mul(warpsScale, 0.05, cos(add(mul(11.0, t.yzx), mul(u_time, 0.25))))
  );
  t = add(
    t,
    mul(warpsScale, 0.025, cos(add(mul(17.0, t.yzx), mul(u_time, 0.25))))
  );
  return t;
});

/**
 * Applies a subtle radial ripple distortion to UV coordinates.
 *
 * @param {Node<vec2>} uv - The UV coordinates (mutated in place).
 * @param {Node<float>} intensity - Ripple strength.
 * @param {Node<float>} rate - Ripple phase or time parameter.
 * @returns {Node<vec2>} The modified UV coordinates.
 */
export const uvRipple = Fn(([uv, intensity, rate]) => {
  const p = sub(uv, 0.5);
  const cLength = length(p);
  const ripple = mul(
    div(p, cLength),
    cos(sub(mul(cLength, 15.0), mul(rate, 0.5)))
  );
  return add(uv, mul(ripple, intensity));
});

//  ???????????????????????????????????????????????????????
//  ******************************************************* Stroke / Mod

/**
 * Computes a smooth modulo function to avoid hard edges in angular repetition.
 *
 * @param {Node<float>} x - Input value.
 * @param {Node<float>} y - Modulus.
 * @param {Node<float>} e - Smoothness factor.
 * @returns {Node<float>} Smoothly wrapped value.
 */
export const smoothMod = Fn(([x, y, e]) => {
  const xy = div(x, y);
  const top = mul(cos(mul(PI, xy)), sin(mul(PI, xy)));
  const bot = pow(sin(mul(PI, xy)), 2.0);
  const at = atan(div(top, bot));
  return sub(mul(y, 0.5), mul(div(1.0, PI), at));
});

/**
 * Re-maps coordinates into polar space with angular repetition.
 *
 * @param {Node<vec2>} p - The input 2D vector.
 * @param {Node<float>} repetitions - Number of angular repetitions.
 * @returns {Node<vec2>} The transformed polar coordinates.
 */
export const modPolar = Fn(([p, repetitions]) => {
  const angle = div(mul(2.0, PI), repetitions);
  let a = add(atan(p.y, p.x), div(angle, 2.0));
  const r = length(p);
  a = sub(smoothMod(a, angle, 0.3), div(angle, 2.0));
  return mul(vec2(cos(a), sin(a)), r);
});

/**
 * Produces a hard or soft-edged linear stroke mask.
 *
 * @param {Node<float>} x - The input coordinate.
 * @param {Node<float>} s - Stroke center position.
 * @param {Node<float>} w - Stroke width.
 * @returns {Node<float>} A smooth step-like stroke mask between 0.0 and 1.0.
 */
export const stroke = Fn(([x, s, w]) => {
  const d = sub(step(s, add(x, mul(w, 0.5))), step(s, sub(x, mul(w, 0.5))));
  return clamp(d, 0.0, 1.0);
});

//  ???????????????????????????????????????????????????????
//  ******************************************************* TSL HELPERS

/**
 * A small TSL helper to emulate GLSL-style switch statements.
 * @param {Node} value - The node or uniform to test.
 * @param {Array<[number|Node, Node]>} cases - Array of [matchValue, resultNode].
 * @param {Node} defaultCase - Node to return if none match.
 */
export const tslSwitch = (value, cases, defaultCase) => {
  return cases.reduceRight(
    (acc, [match, result]) => select(equal(value, match), result, acc),
    defaultCase
  );
};

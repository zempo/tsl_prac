//@ts-nocheck
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
  modelPosition,
  normalView,
  positionGeometry,
  positionViewDirection,
  positionWorldDirection,
  log2,
  pow,
  smoothstep,
  oscSawtooth,
  oscTriangle,
  spherizeUV,
  vec2,
  clamp,
  dot,
  Loop,
  sub,
  sqrt,
  div,
  length,
} from "three/tsl";
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

const p9 = Fn(({ time }) => {
  let uv_9 = positionWorldDirection.mul(8.0).sub(vec2(20.0));
  let ac9 = uv_9;
  let c9 = float(1);
  let int = float(0.05);
  let len = float(10);

  Loop(len, ({ i }) => {
    let _lt = time.mul(sub(0.5, div(2.0, float(i.add(1))))); // fixed _tl/_lt consistency
    ac9.assign(
      uv_9.add(
        vec2(
          cos(_lt.sub(ac9.x)).add(sin(_lt.add(ac9.y))),
          sin(_lt.sub(ac9.y)).add(cos(_lt.add(ac9.x)))
        )
      )
    );
    c9.addAssign(
      div(
        1.0,
        length(
          vec2(
            uv_9.x.div(sin(ac9.x.add(_lt)).div(int)),
            uv_9.y.div(cos(ac9.y.add(_lt)).div(int))
          )
        )
      )
    );
  });

  c9.divAssign(len);
  c9.assign(sub(1.5, sqrt(c9)));
  let c9_out = vec3(c9.mul(c9).mul(c9).mul(c9).mul(c9)).add(
    vec3(mul(0.2, sin(time).add(0.5)), 0.2, 0.4)
  );

  return c9_out;
});

/**
 * @param {Uniform<float>} _t: time
 * @param {Uniform<float>} _seed: seed
 * @param {Uniform<float>} perm: permutation
 * */
export const c_diffuse = (_t, _seed, perm = 0) => {
  // * uv
  let uv3 = vec3(uv(), 0.0); // promote uv() to vec3
  let uv_w = coswarp(uv3, 1, _t);
  const u = uv();
  const angle = u.x.mul(TAU);
  let uv_poles = vec2(cos(angle), sin(angle));
  let pW = positionWorldDirection;
  let pW_b = vec2(
    pW.x.add(cos(add(pW.y.mul(12), _t.mul(0.25)))),
    pW.y.add(sin(add(pW.x.mul(10), _t.mul(0.25))))
  );

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
    cnoise(pW.mul(0.5).add(mul(_t, 0.2))).mul(pW.y, -1),
    color(0.12, 0.3, 1.0),
    color(0.15, 0.15, 0.5),
    color(2.0, 0.97, 0.63),
    color(0.7, 0.3, 0.1)
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
  // let c1 = cp1;

  let p1_i = mul(
    cnoise(pW_b.mul(0.5)),
    line(0, fract(pW_b.y.mul(1.99).add(_t)).mul(cos(10)), 0.5, 0.05)
  );
  let p1_ii = mul(
    cnoise(pW_b.mul(0.5)),
    line(0, fract(pW_b.y.mul(2).add(_t)).mul(cos(10)), 0.5, 0.05)
  );
  let p1_iii = mul(
    cnoise(pW_b.mul(0.5)),
    line(0, fract(pW_b.y.mul(2.01).add(_t)).mul(cos(10)), 0.5, 0.05)
  );
  let c1_i = vec3(p1_i, p1_ii, p1_iii);

  //   line(pW.x, fract(pW.mul(9.95).add(_t)).y, 0.085, 0.05).add(
  //   line(pW.y, fract(pW.mul(14.95).add(_t)).x, 0.085, 0.05)
  // ),
  // line(pW.y, fract(pW.mul(15).add(_t)).x, 0.085, 0.05),
  // line(pW.x, fract(pW.mul(10).add(_t)).y, 0.085, 0.05).add(
  //   line(pW.y, fract(pW.mul(15.05).add(_t)).x, 0.085, 0.05)
  // )

  //     color: new THREE.Color(16777200),
  // background: new THREE.Color(16728128),
  let c2 = isolayers({
    scale: uniform(2),
    layers: uniform(10),
    edge: uniform(0.5),
    darkness: uniform(0.5),
    color: vec3(1.0, 1.0, 0.87),
    background: vec3(1.0, 0.05, 0.05),
    seed: _seed,
  });
  // let c2 = vec3(uv(), 0.2);

  let c2_i = vec3(
    line(uv_poles.x, fract(uv_poles.mul(9.95).add(_t)).y, 0.085, 0.05).add(
      line(uv_poles.y, fract(uv_poles.mul(14.95).add(_t)).x, 0.085, 0.05)
    ),
    line(uv_poles.y, fract(uv_poles.mul(15).add(_t)).x, 0.085, 0.05),
    line(uv_poles.x, fract(uv_poles.mul(10).add(_t)).y, 0.085, 0.05).add(
      line(uv_poles.y, fract(uv_poles.mul(15.05).add(_t)).x, 0.085, 0.05)
    )
  );

  let c3 = caustics({
    scale: uniform(2),
    speed: uniform(0),
    color: cp3,
    seed: _seed,
  });
  // let c3 = vec3(1);

  let p4 = sin(pW.x.mul(5.0).add(_t)).mul(0.5).add(0.5);
  // p4 = smoothMod(p4, 1, 1);
  // let c4 = vec3(fract(uv_w.mul(p4.mul(2.15))).add(0.5), p4);
  let c4 = vec3(
    fract(uv_w.mul(p4.mul(2.15))).x,
    fract(uv_w.mul(p4.mul(2.15))).y,
    uv().y
  );

  let seg5 = mul(float(2.0), add(TAU, add(float(6.0), mul(TAU, sin(_t)))));
  // let pos5 = uv();
  let uv_5i = fract(uv().mul(3)).sub(0.5);
  let p5 = modPolar(uv_5i, seg5);
  let c5 = pal(
    p5.x.add(_t).add(p5.y),
    color(0.6941, 0.2235, 0.2627),
    color(0.5765, 0.3451, 0.2275),
    color(0.5882, 0.5882, 0.3961),
    color(0.1255, 0.4235, 0.3765)
  )
    .mul(0.25)
    .add(c3.mul(0.25));

  let seg6 = mul(float(0.1), add(TAU, add(float(200.0), mul(TAU, sin(_t)))));
  // let pos5 = uv();
  let uv_rip = uvRipple(uv(), 2, _t.mul(0.25));
  let uv_6i = fract(uv_rip.mul(3)).sub(0.5);
  let p6 = modPolar(uv_6i, seg6);
  let c6 = pal(
    p6.x.add(_t).add(p6.y),
    color(float(0.17).sub(cos(_t.mul(0.5))), 0.63, 0.11),
    color(0.3, 0.3, 0.5),
    color(0.8, 0.8, 0.5),
    color(0.1, 0.3, 0.7)
  ).mul(0.5);

  // oscTriangle(timerGlobal.mul(0.5))
  let p7 = smoothstep(
    0.99,
    1,
    stroke(uv_6i.x, sin(uv_6i.y.mul(oscTriangle(_t.mul(0.25)))), 0.5)
  );
  let c7 = vec3(uv().y, p7, float(1).sub(uv().y));

  let p8 = cnoise(uv_poles.mul(uv().y.mul(3)).add(_t));
  let c8 = pal(
    float(1).sub(p8),
    cp2,
    color(1.0, 1.0, 1.0),
    color(1.13, 1.13, 1.13),
    color(0.15, 1.0, 0.01)
  );

  // fract(uv_w.mul(20)), p4
  // const c_out = select(
  //   equal(perm, 0),
  //   add(c1, c1_i), // if perm == 0
  //   add(c1, c1_i) // else (you can change this later)
  // );
  let a1 = color(c2);
  let a2 = color(sub(c1, c1_i));
  let a3 = color(c3);
  let a4 = c4;
  let a5 = c5;
  let a6 = c6;
  let a7 = c7;
  let a8 = c8;
  let a9 = p9(_t);
  let a10 = c4;
  let a11 = c4;
  let a12 = c4;
  let a13 = c4;

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
      [10, a11],
      [11, a12],
      [12, a13],
    ],
    a1
  );
  // let c_out = a13;

  return c_out;
};

/**
 * @param {Uniform<float>} _t: time
 * @param {Uniform<vec3>} _c: diffuse color
 * */
export const c_metal = (_t, _c) => {
  const luma = dot(_c, vec3(0.299, 0.587, 0.114)); // perceptual brightness
  return clamp(
    cnoise(modelPosition.mul(luma)).mul(luma.mul(0.2)).add(0.5),
    0.0,
    1.0
  );
};

/**
 * @param {Uniform<float>} _t: time
 * @param {Uniform<vec3>} _c: diffuse color
 * */
export const c_sheen = (_t, _c) => {
  const luma = clamp(dot(_c, vec3(0.299, 0.587, 0.114)), 0.0, 1.0);
  return color(0.7, 0.5, 0.3).mul(luma);
};

// Animated mix
// const t = sin(uTime.mul(0.5)).mul(0.5).add(0.5);
// const gradient = mix(color(0xff0000), color(0x0000ff), uv().x);
// const blended = mix(c1, c3, t);

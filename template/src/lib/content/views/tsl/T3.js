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
  cos,
} from "three/tsl";

export function fragC(initial = "crimson") {
  const uColor = uniform(color(initial));

  let frag = Fn(() => {
    output.assign(vec4(uColor, 1.0));
  });

  return output;
}

export const red = Fn(({ time, intensity }) => {
  const r = float(1).add(cos(time)).mul(0.5);
  return vec4(r.mul(intensity), 0, 0, 1);
});

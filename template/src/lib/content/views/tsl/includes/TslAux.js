// @ts-nocheck
import { Color, Vector3 } from "three";
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

// ** !
function prepare(userParams, defaults) {
  var propertyNames = [];
  var inputObj = userParams;

  // Same input format handling
  if (
    userParams &&
    typeof userParams === "object" &&
    !Array.isArray(userParams)
  ) {
    propertyNames = Object.keys(userParams);
  } else {
    for (var item of userParams) {
      if (item && typeof item === "object") {
        propertyNames = Object.keys(item);
        inputObj = item;
        break;
      }
    }
  }

  var params = { ...defaults };

  // Merge user params
  for (var key of propertyNames) {
    if (typeof inputObj[key] !== "undefined") params[key] = inputObj[key];
  }

  // Safe type conversion - only convert non-TSL types
  for (var name of Object.keys(params)) {
    const value = params[name];

    // Skip if already a TSL type (check for TSL type markers)
    if (isTSLType(value)) {
      continue; // Leave TSL types alone
    }

    // Only convert raw JavaScript types
    if (typeof value === "number") {
      params[name] = float(value);
    } else if (value instanceof Color) {
      params[name] = vec3(value.r, value.g, value.b);
    } else if (value instanceof Vector3) {
      params[name] = vec3(value.x, value.y, value.z);
    }
    // Add other conversions as needed
  }

  return params;
}

// Helper function to detect TSL types
function isTSLType(value) {
  if (!value || typeof value !== "object") return false;

  // Check for TSL type indicators (depends on TSL implementation)
  return (
    value._isTSLType === true || // Common TSL marker
    value.constructor?.name?.includes("TSL") || // Constructor name
    value.constructor?.name?.includes("Shader") || // Shader type
    typeof value.toGLSL === "function" || // TSL conversion method
    typeof value.compile === "function" // TSL compilation method
  );
}

function SetTex(jsFunc, defaults, layout = null) {
  // Initialize with null values
  var opacity = null;
  var roughness = null;
  var normal = null;

  const fn = Fn(jsFunc, layout);
  const customProps = new Map();
  customProps.set("defaults", defaults);
  customProps.set("opacity", opacity);
  customProps.set("roughness", roughness);
  customProps.set("normal", normal);

  // Create a target with FnNode prototype
  const target = function () {};

  // Fix: Better prototype handling
  if (fn && fn.call) {
    Object.setPrototypeOf(target, Object.getPrototypeOf(fn.call));
  }

  return new Proxy(target, {
    get(target, prop, receiver) {
      if (prop === "defaults") {
        return customProps.get("defaults");
      }

      if (prop === "opacity") {
        return customProps.get("opacity");
      }

      if (prop === "roughness") {
        return customProps.get("roughness");
      }

      if (prop === "normal") {
        return customProps.get("normal");
      }

      if (prop === "fn") {
        return fn;
      }

      // Fix: Better forwarding
      if (fn && (prop in fn || typeof fn[prop] !== "undefined")) {
        return Reflect.get(fn, prop, receiver);
      }

      return Reflect.get(target, prop, receiver);
    },

    set(target, prop, value, receiver) {
      if (prop === "defaults") {
        customProps.set("defaults", value);
        return true;
      }

      if (prop === "opacity") {
        customProps.set("opacity", value);
        return true;
      }

      if (prop === "roughness") {
        customProps.set("roughness", value);
        return true;
      }

      if (prop === "normal") {
        customProps.set("normal", value);
        return true;
      }

      // Fix: Only set on fn if it exists
      if (fn) {
        return Reflect.set(fn, prop, value, receiver);
      }

      return Reflect.set(target, prop, value, receiver);
    },

    apply(target, thisArg, args) {
      // Fix: Safe application
      if (fn && typeof fn === "function") {
        return Reflect.apply(fn, thisArg, args);
      }
      throw new Error("SetTex: Underlying function is not callable");
    },

    getOwnPropertyDescriptor(target, prop) {
      // Fix: Return proper descriptors for custom properties
      if (prop === "defaults") {
        return {
          value: customProps.get("defaults"),
          writable: true,
          enumerable: true,
          configurable: true,
        };
      }

      if (prop === "opacity") {
        const value = customProps.get("opacity");
        return {
          value: value,
          writable: true,
          enumerable: true,
          configurable: true,
        };
      }

      if (prop === "roughness") {
        const value = customProps.get("roughness");
        return {
          value: value,
          writable: true,
          enumerable: true,
          configurable: true,
        };
      }

      if (prop === "normal") {
        const value = customProps.get("normal");
        return {
          value: value,
          writable: true,
          enumerable: true,
          configurable: true,
        };
      }

      // Fix: Safe property descriptor forwarding
      if (fn) {
        const desc = Reflect.getOwnPropertyDescriptor(fn, prop);
        if (desc) return desc;
      }

      return Reflect.getOwnPropertyDescriptor(target, prop);
    },

    // Fix: Add missing handler for proper proxy behavior
    ownKeys(target) {
      const fnKeys = fn ? Reflect.ownKeys(fn) : [];
      const customKeys = ["defaults", "opacity", "roughness", "normal", "fn"];
      return [...new Set([...fnKeys, ...customKeys])];
    },

    has(target, prop) {
      const customProps = ["defaults", "opacity", "roughness", "normal", "fn"];
      if (customProps.includes(prop)) return true;
      return fn ? Reflect.has(fn, prop) : false;
    },
  });
} // SetTex

let brainInit = {
  scale: 3,
  smooth: 0.95,
  seed: 0,
  color: vec3(0.9176, 0.5647, 0.5647),
  bgd: vec3(0.3059, 0.0745, 0.0745),
  pulse_wave: 1.05,
  pulse_speed: 1.5,
};

/**
 * @typedef {Object} BrainTexProps
 * @property {number|float} [scale=2] - Overall scale of the brain pattern. Larger values = more detail.
 * @property {number|float} [smooth=0.5] - Smoothness factor for noise (0-1 range). Lower = more granular.
 * @property {number|float} [seed=0] - Random seed for procedural variation.
 * @property {vec3|Array} [color=vec3(0.9176, 0.5647, 0.5647)] - Primary vein color as RGB vec3 or array.
 * @property {vec3|Array} [bgd=vec3(0.3059, 0.0745, 0.0745)] - Background tissue color as RGB vec3 or array.
 * @property {number|float} [pulse_wave=0.5] - Pulse wave intensity for animated effects.
 * @property {number|float} [pulse_speed=2.5] - Speed of pulse animation.
 *
 * Creates a brain-like procedural texture using fractal noise
 * @param {BrainTexProps} props - Configuration properties for the brain texture
 * @returns {vec3} - RGB color output representing brain tissue patterns
 *
 * @example
 * // Basic usage with defaults
 * const brain = brainTex();
 *
 * @example
 * // Customized brain texture
 * const customBrain = brainTex({
 *   scale: 3.0,
 *   smooth: 0.3,
 *   color: [0.9, 0.4, 0.4],
 *   bgd: [0.2, 0.1, 0.1]
 * });
 */
var brainTex = SetTex((params) => {
  params = prepare(params, brainInit);

  let pos = positionGeometry
    .mul(exp(params.scale.div(3)))
    .add(params.seed)
    .toVar();

  let octaves = exp(params.smooth.oneMinus().mul(2)); // Use same variable name
  let n = mx_fractal_noise_float(pos.mul(5), octaves) // Use same octaves
    .add(1)
    .div(2)
    .clamp(0, 1)
    .pow(2);

  let c_n = mix(params.color, params.bgd, n);

  return c_n;
}, brainInit);

brainTex.normal = SetTex((params) => {
  params = prepare(params, brainInit);

  // Use EXACTLY the same position and octave calculations
  var pos = positionGeometry
    .mul(exp(params.scale.div(3)))
    .add(params.seed)
    .toVar();

  var octaves = exp(params.smooth.oneMinus().mul(2)); // Same as color!

  var eps = 0.01;
  var n = mx_fractal_noise_float(pos.mul(5), octaves); // Same noise pattern
  var dx = mx_fractal_noise_float(pos.add(vec3(eps, 0, 0)).mul(5), octaves)
    .sub(n)
    .div(eps);
  var dy = mx_fractal_noise_float(pos.add(vec3(0, eps, 0)).mul(5), octaves)
    .sub(n)
    .div(eps);

  var dTime = mx_noise_float(pos.mul(params.pulse_wave.mul(5)))
    .add(1)
    .div(2)
    .mul(6.28);

  let scaleDerivatives = 4;
  let normalVec = vec3(
    dx.mul(scaleDerivatives), // Scale up derivatives
    dy.mul(scaleDerivatives), // Scale up derivatives
    time.mul(params.pulse_speed).add(dTime).sin().add(n, 1).sub(1.0) // Ensure Z is centered around 0
  );

  // Add extra processing for new TSL system
  normalVec = normalVec.normalize();
  // normalVec = normalVec.mul(0.5).add(0.5); // Convert to [0,1] range if needed
  return normalVec;
}, brainInit);

export { brainTex };
// // Test the normal function directly
// const testNormal = brainTex.normal();
// console.log("Normal function test result:", testNormal);
// console.log("Normal result type:", typeof testNormal);
// console.log("Normal result properties:", Object.keys(testNormal));

// // Test with parameters
// const testParams = prepare({}, brainInit);
// const testNormalWithParams = brainTex.normal(testParams);
// console.log("Normal with params:", testNormalWithParams);

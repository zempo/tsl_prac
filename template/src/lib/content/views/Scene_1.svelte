<script>
  // @ts-nocheck
  import * as THREE from "three";
  import { T, useTask } from "@threlte/core";
  import { OrbitControls } from "@threlte/extras";
  import { mix, sin, uniform, color, uv } from "three/tsl";
  import { MeshPhysicalNodeMaterial } from "three/webgpu";
  import { fragC, red } from "./tsl/T1.js";
  import { onMount } from "svelte";

  // Import the specific functions you need
  // import { circleDecor, caustics, neonLights } from "tsl-textures";
  import { circleDecor, caustics, neonLights } from "./tsl/tsltex_local.js";
  import { pal } from "./tsl/includes/TslMain.js";

  let uTime = uniform(0);
  let uSeed = uniform(0);
  let uIntensity = uniform(1);

  useTask((delta) => {
    uTime.value += delta;
    uSeed.value += 0.1 * delta;
  });

  /**
 *     uniform(2),
    uniform(0.2),
    uniform(1),
    uniform(0.2),
    pink,
    green,
    uniform(10)
 * **/

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

  const cL = circleDecor({
    scale: uniform(2),
    grains: uniform(0.2),
    complexity: uniform(1),
    blur: uniform(0.912),
    color: cp1,
    background: cp2,
    seed: uSeed,
  });

  const mat = new MeshPhysicalNodeMaterial({
    colorNode: cL,
    // emissiveNode: red(uTime, uIntensity), // Your custom function
    roughness: 0.9,
    metalness: 0.3,
  });
</script>

<T.Mesh material={mat}>
  <T.SphereGeometry />
</T.Mesh>
<T.PerspectiveCamera position.z={5} makeDefault>
  <OrbitControls autoRotate enableDamping autoRotateSpeed={1} />
</T.PerspectiveCamera>
<T.AmbientLight intensity={2} />

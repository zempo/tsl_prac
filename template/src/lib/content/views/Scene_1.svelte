<script>
  // @ts-nocheck
  import * as THREE from "three";
  import { T, useTask } from "@threlte/core";
  import { OrbitControls } from "@threlte/extras";
  import { mix, uniform } from "three/tsl";
  import { MeshPhysicalNodeMaterial } from "three/webgpu";
  import { amb, c_circ, fragC, red } from "./tsl/T1.js";
  import { onMount } from "svelte";

  // Import the specific functions you need
  // import { circleDecor, caustics, neonLights } from "tsl-textures";
  import { circleDecor, caustics, neonLights } from "./tsl/includes/TslTex.js";
  import { line, pal } from "./tsl/includes/TslMain.js";
  import { sc1 } from "../store/delta/sc1.svelte.js";

  let uTime = uniform(0);
  let uSeed = uniform(0);
  let uIntensity = uniform(0.15);

  useTask((delta) => {
    uTime.value += delta;
    uSeed.value += 0.05 * delta;
  });

  const uPerm = uniform(sc1.perm);
  let cL = c_circ(uTime, uSeed, uPerm);
  const mat = new MeshPhysicalNodeMaterial({
    colorNode: cL,
    // emissiveNode: amb(cL, uTime, uIntensity), // Your custom function
    roughness: 0.9,
    metalness: 0.3,
    // emissive: cp1,
    emissiveIntensity: 0.12,
  });

  $effect(() => {
    // mat.colorNode = c_circ(uTime, uSeed, uniform(sc1.perm));
    uPerm.value = sc1.perm;
  });
</script>

<T.Mesh material={mat}>
  <T.SphereGeometry />
</T.Mesh>
<T.PerspectiveCamera position.z={5} makeDefault>
  <OrbitControls autoRotate enableDamping autoRotateSpeed={1} />
</T.PerspectiveCamera>
<T.AmbientLight intensity={2} />

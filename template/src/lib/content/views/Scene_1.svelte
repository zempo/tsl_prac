<script>
  // @ts-nocheck
  import * as THREE from "three";
  import { T, useTask } from "@threlte/core";
  import { OrbitControls, useGltf, useDraco } from "@threlte/extras";
  import { uniform } from "three/tsl";
  import { MeshPhysicalNodeMaterial } from "three/webgpu";
  import { amb, c_diffuse, c_metal, c_sheen } from "./tsl/T1.js";
  import { onMount } from "svelte";

  // Import the specific functions you need
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
  let cDiff = c_diffuse(uTime, uSeed, uPerm);
  let cMetal = c_metal(uTime, cDiff);
  const mat = new MeshPhysicalNodeMaterial({
    colorNode: cDiff,
    // emissiveNode: amb(cL, uTime, uIntensity), // Your custom function
    roughness: 0.09,
    // sheenNode: color(0.8, 0.3, 0.2),
    // iridescence: 0.193,
    // iridescenceNode: iridescenceNode,
    // emissive: cp1,
    // metalnessNode: cMetal,
    // sheenNode: c_sheen(uTime, cDiff),
    // sheenRoughness: 0.1,
    // sheen: 1,
    emissiveIntensity: 0.12,
    side: THREE.DoubleSide,
  });

  $effect(() => {
    // mat.colorNode = c_circ(uTime, uSeed, uniform(sc1.perm));
    uPerm.value = sc1.perm;
  });

  const dracoLoader = useDraco(); // Creates a cached instance of DracoLoader
  const gltf = useGltf("/models/util/quad_sphere.glb", { dracoLoader });

  // gltf.subscribe(($gltf) => {
  //   if ($gltf) {
  //     console.log("Nodes:", $gltf.nodes);
  //     console.log("Materials:", $gltf.materials);
  //   }
  // });
</script>

{#if $gltf}
  <T.Mesh
    material={mat}
    geometry={$gltf.nodes["quad_sphere"].geometry}
    position={[-2, 0, 0]}
  ></T.Mesh>
{/if}
<T.Mesh material={mat} position={[0, 0, 0]}>
  <T.BoxGeometry />
</T.Mesh>
<T.Mesh material={mat} position={[2, 0, 0]}>
  <T.SphereGeometry />
</T.Mesh>
<T.PerspectiveCamera position.z={5} makeDefault>
  <OrbitControls autoRotate enableDamping autoRotateSpeed={1} />
</T.PerspectiveCamera>
<T.AmbientLight intensity={2} />

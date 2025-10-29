<script>
  // @ts-nocheck
  import * as THREE from "three";
  import { T, useTask } from "@threlte/core";
  import { OrbitControls, useGltf, useDraco } from "@threlte/extras";
  import { uniform, vec3, mul } from "three/tsl";
  import { MeshPhysicalNodeMaterial } from "three/webgpu";
  import { amb, c_diffuse, c_metal, c_sheen, metal_factor } from "./tsl/T1.js";
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

  // const uPerm = uniform(sc1.perm);
  let cDiff = c_diffuse(uTime, uSeed, sc1.uPerm);
  let cMetal = c_metal(uTime, cDiff);
  const redEmissive = vec3(1, 0, 0);
  const emissiveMap = mul(redEmissive, cMetal);
  const mat = new MeshPhysicalNodeMaterial({
    colorNode: cDiff,
    roughness: 0.5,
    metalnessNode: sc1.uPerm_m, // Use metalnessNode, not metalness
    roughnessNode: sc1.uPerm_r, // Use metalnessNode, not metalness
    metalnessMap: cMetal,
    side: THREE.DoubleSide,
  });

  $effect(() => {
    sc1.uPerm.value = sc1.perm;
    sc1.uPerm_m.value = sc1.perm_metal;
    sc1.uPerm_r.value = sc1.perm_rough;
    // console.log(sc1.uPerm_m.value);
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
<!-- <T.AmbientLight intensity={2} />
<T.DirectionalLight intensity={3.4} /> -->

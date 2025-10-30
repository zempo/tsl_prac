<script>
  // @ts-nocheck
  import * as THREE from "three";
  import { T, useTask } from "@threlte/core";
  import { OrbitControls, useGltf, useDraco } from "@threlte/extras";
  import { uniform, vec3, mul } from "three/tsl";
  import { MeshPhysicalNodeMaterial } from "three/webgpu";
  import { c_diffuse } from "./tsl/T2.js";
  import { onMount } from "svelte";

  import { sc2 } from "../store/delta/sc2.svelte.js";

  let uTime = uniform(0);
  let uSeed = uniform(0);

  useTask((delta) => {
    uTime.value += delta;
    uSeed.value += 0.05 * delta;
  });

  // const uPerm = uniform(sc2.perm);
  let cDiff = c_diffuse(uTime, uSeed, sc2.uPerm);

  const mat = new MeshPhysicalNodeMaterial({
    colorNode: cDiff,
    roughness: 0.9,
    metalness: 0.2,
    side: THREE.DoubleSide,
  });

  $effect(() => {
    sc2.uPerm.value = sc2.perm;
    // sc2.uPerm_m.value = sc2.perm_metal;
    // sc2.uPerm_r.value = sc2.perm_rough;
  });

  const dracoLoader = useDraco(); // Creates a cached instance of DracoLoader
  const gltf = useGltf("/models/util/quad_sphere.glb", { dracoLoader });
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

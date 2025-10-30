<script>
  // @ts-nocheck
  import * as THREE from "three";
  import { T, useTask } from "@threlte/core";
  import { OrbitControls, useGltf, useDraco } from "@threlte/extras";
  import { uniform, vec3, mul } from "three/tsl";
  import { MeshPhysicalNodeMaterial } from "three/webgpu";
  import { c_diffuse } from "./tsl/T3.js";
  import { onMount } from "svelte";

  import { sc3 } from "../store/delta/sc3.svelte.js";

  let uTime = uniform(0);
  let uSeed = uniform(0);

  useTask((delta) => {
    uTime.value += delta;
    uSeed.value += 0.05 * delta;
  });

  // const uPerm = uniform(sc3.perm);
  let cDiff = c_diffuse(uTime, uSeed, sc3.uPerm);

  const mat = new MeshPhysicalNodeMaterial({
    colorNode: cDiff,
    roughness: 0.9,
    metalness: 0.2,
    side: THREE.DoubleSide,
  });

  $effect(() => {
    sc3.uPerm.value = sc3.perm;
    // sc3.uPerm_m.value = sc3.perm_metal;
    // sc3.uPerm_r.value = sc3.perm_rough;
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

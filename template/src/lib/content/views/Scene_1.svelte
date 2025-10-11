<script>
  import * as THREE from "three";
  import { T, useTask } from "@threlte/core";
  import { OrbitControls, useTexture } from "@threlte/extras";
  import { fragC, red } from "./tsl/T1.js";
  import { add, color, cos, log, mix, sin, uniform, uv } from "three/tsl";
  import { MeshPhysicalNodeMaterial } from "three/webgpu";
  import {
    circleDecor,
    neonLights,
    isolayers,
    caustics,
    translator,
  } from "tsl-textures";

  let uTime = uniform(0);
  let uIntensity = uniform(1);
  let uScale = uniform(2);
  let uGrains = uniform(0.2);
  let uComplexity = uniform(1);
  let uBlur = uniform(0.2);
  let uColor = color(new THREE.Color(0x000000));
  let uBg = color(new THREE.Color(0xffffff));
  let uSeed = uniform(0.0);

  const mat = new MeshPhysicalNodeMaterial({
    emissiveNode: red(uTime, uIntensity),
  });

  useTask((delta) => {
    uTime.value += delta;
    uSeed.value += delta * 0.2;
  });

  let c1 = circleDecor(
    uScale,
    uGrains,
    uComplexity,
    uBlur,
    uColor,
    uBg,
    uSeed // this must be a `Node` uniform
  );
  let c2 = neonLights(
    1.5,
    0.66,
    0,
    new THREE.Color(16711680),
    new THREE.Color(65280),
    new THREE.Color(255),
    new THREE.Color(0),
    0
  );

  let c3 = isolayers(
    2,
    10,
    0.5,
    0,
    new THREE.Color(16777200),
    new THREE.Color(16728128),
    0
  );

  let c4 = caustics(2, 0, new THREE.Color(5286080), 0);

  mat.colorNode = mix(
    mix(c1, c2, sin(uTime.mul(0.5))),
    mix(c3, c4, sin(uTime.mul(0.5))),
    sin(uTime.mul(0.25))
  );

  mat.positionNode = translator(
    new THREE.Vector3(-0.5, 0, 0.2),
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector2(0, 0),
    0.7
  );

  mat.normalNode = translator.normal(
    new THREE.Vector3(-0.5, 0, 0.2),
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector2(0, 0),
    0.7
  );

  // New-style call (positional args, not an object)

  const texture = useTexture("/texture/pixel-sky.png").then((tex) => {
    let tColor = tex;
    const factor = sin(cos(uTime)).mul(0.5).add(0.5); // normalize to 0–1
    // mat.colorNode = mix(c3, tex, factor);
  });
</script>

<T.Mesh material={mat}>
  <T.SphereGeometry />
  <!-- {#await texture then map}
    <T is={mat} {map} />
  {/await} -->
</T.Mesh>
<T.PerspectiveCamera position.z={5} makeDefault>
  <OrbitControls autoRotate enableDamping autoRotateSpeed={1} />
</T.PerspectiveCamera>
<T.AmbientLight intensity={2} />

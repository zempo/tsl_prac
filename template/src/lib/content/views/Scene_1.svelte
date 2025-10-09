<script>
  import { T, useTask } from "@threlte/core";
  import { OrbitControls } from "@threlte/extras";
  import { fragC, red } from "./tsl/T3.js";
  import { uniform } from "three/tsl";

  let uTime = uniform(0);
  let uIntensity = uniform(1);

  // Example: animate the color every 2 seconds
  // setInterval(() => {
  //   uColor.value.set(Math.random() * 0xffffff);
  // }, 2000);
  useTask((delta) => {
    uTime.value += delta;
  });
</script>

<T.Mesh>
  <T.BoxGeometry />
  <T.MeshPhysicalNodeMaterial emissiveNode={red(uTime, uIntensity)} />
</T.Mesh>
<T.PerspectiveCamera position.z={5} makeDefault>
  <OrbitControls autoRotate autoRotateSpeed={1} />
</T.PerspectiveCamera>
<T.AmbientLight intensity={2} />

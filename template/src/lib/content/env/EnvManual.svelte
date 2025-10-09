<script>
  import { T } from "@threlte/core";
  import { envMain } from "../store/env.svelte";
</script>

<T.AmbientLight args={[envMain.l_c1, 2.3]} />
<T.DirectionalLight
  args={[envMain.l_c2, 2]}
  position={[5, 10, 5]}
  castShadow
  shadow.mapSize.width={envMain.shadow_res}
  shadow.mapSize.height={envMain.shadow_res}
  shadow.camera.far={20}
  shadow.camera.left={-10}
  shadow.camera.top={10}
  shadow.camera.right={10}
  shadow.camera.bottom={-10}
  shadow.bias={0.0001}
/>

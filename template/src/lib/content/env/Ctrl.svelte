<script>
  import { T, useTask, useThrelte } from "@threlte/core";
  import { OrbitControls } from "@threlte/extras";
  const { scene, dom, invalidate } = useThrelte();
</script>

<T.PerspectiveCamera position.z={50} makeDefault>
  <OrbitControls
    autoRotate
    enableZoom={false}
    autoRotateSpeed={1}
    onchange={invalidate}
  />
</T.PerspectiveCamera>

<script>
  import { Canvas, T } from "@threlte/core";
  import { WebGPURenderer } from "three/webgpu";
  import Scene from "./Scene.svelte";
  let renderMode = $state("manual");
</script>

<div
  style="position:relative; height:100vh; width:100vw; background-color: #123311"
>
  <Canvas
    {renderMode}
    createRenderer={(canvas) => {
      const renderer = new WebGPURenderer({
        canvas,
        antialias: true,
        forceWebGL: false,
      });
      renderer.init().then(() => {
        renderMode = "on-demand";
      });
      return renderer;
    }}
  >
    <Scene />
  </Canvas>
</div>

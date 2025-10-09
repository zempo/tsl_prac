<script>
  import { Canvas, T, extend } from "@threlte/core";
  import {
    DirectionalLight,
    MeshPhysicalNodeMaterial,
    MeshStandardMaterial,
    WebGPURenderer,
  } from "three/webgpu";
  import { sceneTree } from "./tree";
  import { sceneMain } from "../store/main.svelte";
  import { envMain } from "../store/env.svelte";
  import EnvManual from "../env/EnvManual.svelte";
  import Tweaks from "./Tweaks.svelte";

  extend({ DirectionalLight, MeshPhysicalNodeMaterial, MeshStandardMaterial });

  let renderMode = $state("manual");
</script>

<Tweaks />

<div
  style="position:relative; height:{sceneMain.canvas_size.h}vh; width:{sceneMain
    .canvas_size.w}vw; background-color: {sceneMain.canvas_bgd}"
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
    {@render scenes()}
  </Canvas>
</div>

{#snippet scenes()}
  {#each sceneTree.scenes as sc, idx}
    {#if idx === sceneMain.useScene}
      <sc.content />
      {#if envMain.useEnv === 3 && !sc.customEnv}
        <EnvManual />
      {/if}
    {/if}
  {/each}
{/snippet}

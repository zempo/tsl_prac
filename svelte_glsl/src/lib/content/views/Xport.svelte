<script>
  // @ts-nocheck
  import * as THREE from "three";
  import { Canvas, T } from "@threlte/core";
  import { OrbitControls, CameraControls, Gizmo } from "@threlte/extras";
  import Tweaks from "./Tweaks.svelte";
  import "../../style/global.scss";
  import EnvTex from "../env/EnvTex.svelte";
  import EnvSky from "../env/EnvSky.svelte";
  import EnvManual from "../env/EnvManual.svelte";
  import Grid from "../env/Grid.svelte";
  import { grid } from "../store/grid.svelte";
  import { sceneTree } from "./tree";
  // import PostProcessing from './env/PostProcessing.svelte';
  // import Composite from "../env/Composite.svelte";
  import { sceneMain } from "../store/main.svelte";
  import { envMain } from "../store/env.svelte.js";

  const { giz } = sceneMain;

  $effect(() => {
    if (sceneMain.ortho_ref) {
      sceneMain.ortho_ref.zoom = sceneMain.ortho_zoom;
      sceneMain.ortho_ref.updateProjectionMatrix();
    }
  });
</script>

<Tweaks />

<div
  style="position:relative; height:{sceneMain.canvas_size.h}vh; width:{sceneMain
    .canvas_size.w}vw; background-color: {sceneMain.canvas_bgd}"
>
  <Canvas>
    {@render body()}
  </Canvas>
</div>

<!-- *switch between renderer types -->
{#snippet body()}
  {@render env_comp()}
  {@render camera()}
  {@render scenes()}
  <!-- <EnvManual /> -->
{/snippet}

{#snippet env_comp()}
  {#if envMain.useEnv == 2}
    <EnvTex url="/texture/env/spruit_sunrise.hdr" />
  {:else if envMain.useEnv == 1}
    <EnvSky />
  {:else if envMain.useEnv == 0}
    <EnvManual />
  {:else}
    <!-- ?? scene might/might not include custom env -->
    <!-- ?? backup in scenes snippet -->
  {/if}
  {#if grid.grid_on}
    <Grid />
  {/if}
{/snippet}

{#snippet camControls()}
  <CameraControls bind:ref={sceneMain.cam_controls}>
    {#if sceneMain.tweaks_on}
      <Gizmo
        type={giz.type}
        speed={giz.speed}
        placement={giz.placement}
        size={giz.size}
        cameraControls={sceneMain.cam_controls}
      />
    {/if}
  </CameraControls>
  <!-- <OrbitControls enableDamping autoRotate autoRotateSpeed={0.25}
  ></OrbitControls> -->
  <!-- <OrbitControls
    autoRotate
    enableZoom={true}
    autoRotateSpeed={1}
    onchange={invalidate}
  /> -->
{/snippet}

{#snippet camera()}
  {#if sceneMain.cam_type === 0}
    <T.PerspectiveCamera
      makeDefault
      fov={sceneMain.cam_fov}
      position={sceneMain.cam_init}
    >
      {@render camControls()}
    </T.PerspectiveCamera>
  {:else}
    <T.OrthographicCamera
      bind:ref={sceneMain.ortho_ref}
      makeDefault
      position={sceneMain.ortho_init}
      args={[-20, 20, 20, -20, 0.1, 100]}
      zoom={sceneMain.ortho_zoom}
    >
      {@render camControls()}
    </T.OrthographicCamera>
  {/if}
{/snippet}

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

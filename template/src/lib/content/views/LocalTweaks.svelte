<script>
  import { sc1 } from "../store/delta/sc1.svelte.js";
  import { sc2 } from "../store/delta/sc2.svelte.js";
  import { sc3 } from "../store/delta/sc3.svelte.js";
  import { sceneMain } from "./../store/main.svelte.js";
  import {
    Folder,
    Color,
    TabGroup,
    TabPage,
    Separator,
    Slider,
    List,
    Button,
    Monitor,
  } from "svelte-tweakpane-ui";
</script>

{@render tw(sceneMain.useScene)}

{#snippet tw(idx = 0)}
  <!-- <Monitor value={sceneMain.useScene}  /> -->
  {#if idx === 0}
    <!--  -->
  {/if}
  {#if idx === 1}
    <Slider
      bind:value={sc1.perm}
      min={0}
      max={12}
      step={1}
      format={(v) => v.toFixed(0)}
      label="Permutation Idx"
    />
  {/if}
  {#if idx === 2}
    <Slider
      bind:value={sc2.perm}
      min={0}
      max={46}
      step={1}
      format={(v) => v.toFixed(0)}
      label="Texture Idx"
    />
  {/if}
  {#if idx === 3}
    <Slider
      bind:value={sc3.perm}
      min={0}
      max={10}
      step={1}
      format={(v) => v.toFixed(0)}
      label="Light Idx"
    />
  {/if}
{/snippet}

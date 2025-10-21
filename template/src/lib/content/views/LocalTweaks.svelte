<script>
  import { sc1 } from "../store/delta/sc1.svelte.js";
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
  {#if idx === 0}
    <Monitor value={sceneMain.useScene} />
  {/if}
  {#if idx === 1}
    <!-- <Button -->
    <Slider
      bind:value={sc1.perm}
      min={0}
      max={12}
      step={1}
      format={(v) => v.toFixed(0)}
      label="Permutation Idx"
    />
  {/if}
{/snippet}

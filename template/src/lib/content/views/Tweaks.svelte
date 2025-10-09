<script>
  import {
    Pane,
    Color,
    Separator,
    Folder,
    FpsGraph,
    Button,
    List,
    TabGroup,
    TabPage,
    Slider,
    Checkbox,
    Monitor,
  } from "svelte-tweakpane-ui";
  import { sceneMain } from "./../store/main.svelte.js";
  import { sc_entries, sceneTree } from "./tree";
</script>

{#if sceneMain.tweaks_on}
  <Pane title="🎡 TSThrelte Project" position="fixed" width={450}>
    <!-- {@render camTweaks()}
		{@render worldTweaks()}
		{@render sceneTweak()}
		{@render renderTweaks()} -->
    {@render sceneTweaks()}
  </Pane>
{/if}

{#snippet sceneTweaks()}
  <Folder title="🎬 Scene Tweaks">
    <Monitor bind:value={sceneMain.sceneOf} label="Scene Count:" />
    <List bind:value={sceneMain.useScene} options={sc_entries} />
    <!-- <LocalTweaks /> -->
  </Folder>
{/snippet}

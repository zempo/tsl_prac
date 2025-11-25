<script>
  // @ts-nocheck
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
  import { envMain } from "../store/env.svelte.js";
  import { sc_entries, sceneTree } from "./tree";
  import LocalTweaks from "./LocalTweaks.svelte";
  import { skyPresets } from "../env/skypresets.js";
  import { grid } from "../store/grid.svelte.js";
  import { MathUtils } from "three";

  const sky_entries = Object.entries(skyPresets);

  let { cam_controls } = $props();
</script>

<svelte:window onkeydown={(e) => sceneMain.shortcuts(e, cam_controls)} />

{#if sceneMain.tweaks_on}
  <Pane title="🎡 TSThrelte Project" position="fixed" width={450}>
    {@render camTweaks()}
    <!-- {@render worldTweaks()} -->
    <!-- {@render sceneTweak()} -->
    <!-- {@render renderTweaks()} -->
    {@render sceneTweaks()}
    <!-- {@render gridTweak()} -->
  </Pane>
{/if}

{#snippet sceneTweaks()}
  <Folder title="🎬 Scene Tweaks">
    <Monitor bind:value={sceneMain.sceneOf} label="Project Scene:" />
    <List bind:value={sceneMain.useScene} options={sc_entries} />
    <LocalTweaks />
    <Separator />
    <Color bind:value={envMain.l_c1} label="Amb Color" />
    <Color bind:value={envMain.l_c2} label="Dir Color" />
  </Folder>
{/snippet}

{#snippet camTweaks()}
  <Folder title="📽️ Camera Tweaks" expanded={sceneMain.cam_tweaks}>
    <Button title={sceneMain.cam_str} on:click={() => sceneMain.toggleCam()} />
    <Button
      title="Turn Gizmo {sceneMain.composite_on ? 'On' : 'Off'}"
      on:click={() => sceneMain.toggleGiz()}
    />
    <FpsGraph interval={50} label="FPS" rows={5} />
    <TabGroup>
      <TabPage title="Rotation">
        <Folder title="Theta 🔄">
          <Button
            title="rotate 90°"
            on:click={() => {
              cam_controls?.rotate(90 * MathUtils.DEG2RAD, 0, true);
            }}
          />
          <Button
            title="rotate -90°"
            on:click={() => {
              cam_controls?.rotate(-90 * MathUtils.DEG2RAD, 0, true);
            }}
          />
        </Folder>
        <Folder title="Phi 🔃">
          <Button
            title="up 45°"
            on:click={() => {
              cam_controls?.rotate(0, -45 * MathUtils.DEG2RAD, true);
            }}
          />
          <Button
            title="down 45°"
            on:click={() => {
              cam_controls?.rotate(0, 45 * MathUtils.DEG2RAD, true);
            }}
          />
        </Folder>
      </TabPage>
      <TabPage title="👁️ View / Focus">
        <Button
          title="2x in"
          on:click={() => {
            cam_controls?.zoom(cam_controls.camera.zoom / 2, true);
          }}
        />
        <Button
          title="2x out"
          on:click={() => {
            cam_controls?.zoom(-cam_controls.camera.zoom / 2, true);
          }}
        />
        {#if sceneMain.cam_type === 0}
          <Slider
            bind:value={sceneMain.cam_fov}
            min={5}
            max={175}
            step={5}
            label="👁️ FOV"
          />
        {:else}
          <Slider
            bind:value={sceneMain.ortho_zoom}
            min={5}
            max={175}
            step={5}
            label="👁️ Ortho Initial"
          />
        {/if}
      </TabPage>
    </TabGroup>
  </Folder>
{/snippet}

{#snippet worldTweaks()}
  <Folder title="🏕️ World Tweaks" expanded={envMain.env_tweaks}>
    <List
      bind:value={envMain.useEnv}
      label="Environment"
      options={{ "💡 Basic": 0, "🌇 Sky": 1, "🖼️ Hdr": 2, "🛋️ Scene": 3 }}
    />
    <Monitor
      value={sceneTree.scenes[sceneMain.useScene].customEnv}
      label="🧬 Unique Env"
    />
    <Separator />
    {#if envMain.useEnv == 0}
      <Color bind:value={envMain.l_c1} label="Amb Color" />
      <Color bind:value={envMain.l_c2} label="Dir Color" />
      <!-- <Slider label="Shadow Res" bind:value={envMain.shadow_res} min={256} max={4096} step={256} /> -->
    {/if}
    {#if envMain.useEnv == 1}
      {@render skyTweak()}
    {/if}
    <Separator />
    {@render gridTweak()}
  </Folder>
{/snippet}

{#snippet skyTweak()}
  <Folder title="Skybox" expanded={false}>
    <Slider
      label="Turbidity"
      bind:value={envMain.sky.turbidity}
      min={0}
      max={20}
    />
    <Slider
      label="Rayleigh"
      bind:value={envMain.sky.rayleigh}
      min={0}
      max={10}
    />
    <Slider
      label="Azimuth"
      bind:value={envMain.sky.azimuth}
      min={-180}
      max={180}
    />
    <Slider
      label="Elevation"
      bind:value={envMain.sky.elevation}
      min={-20}
      max={90}
    />
    <Slider
      label="Mie Coefficient"
      bind:value={envMain.sky.mieCoefficient}
      min={0}
      max={0.1}
    />
    <Slider
      label="Mie Directional G"
      bind:value={envMain.sky.mieDirectionalG}
      min={0}
      max={1}
    />
    <Slider
      label="Exposure"
      bind:value={envMain.sky.exposure}
      min={0}
      max={2}
    />
    <Folder title="Presets">
      {#each sky_entries as [title, preset]}
        <Button
          {title}
          on:click={() => {
            // applyPreset(preset)
            envMain.applyPreset(preset);
          }}
        />
      {/each}
    </Folder>
  </Folder>
{/snippet}

{#snippet gridTweak()}
  <Checkbox bind:value={grid.grid_on} label="🌐 Show Grid" />
  {#if grid.grid_on}
    <Folder title="🧇 Grid Tweaks" expanded={false}>
      <Folder title="🍙 Cell">
        <Slider
          bind:value={grid.cell.size}
          label="Size"
          step={0.5}
          min={1}
          max={5}
        />
        <Color bind:value={grid.cell.color} label="Color" />
        <Slider
          bind:value={grid.cell.stroke}
          label="Stroke"
          step={0.1}
          min={1}
          max={10}
        />
      </Folder>
      <Folder title="🍱 Section">
        <Slider
          bind:value={grid.section.size}
          label="Size"
          step={1}
          min={1}
          max={50}
        />
        <Color bind:value={grid.section.color} label="Color" />
        <Slider
          bind:value={grid.section.stroke}
          label="Stroke"
          step={0.1}
          min={1}
          max={10}
        />
      </Folder>
      <Folder title="🌐 Coords">
        <TabGroup>
          <TabPage title="GridType">
            <List
              bind:value={grid.coord.gridType}
              options={grid.coord_types}
              label="GridType"
            />
            <List
              bind:value={grid.coord.plane}
              label="Grid Rotation"
              options={grid.coord.plane_types}
            />
            {#if grid.coord.gridType == "lines"}
              <List
                bind:value={grid.line_axis}
                options={grid.line_axis_types}
                label="axis"
              />
            {/if}
            <!-- {#if grid.coord.gridType == 'polar' || grid.coord.gridType == 'circular'}
      <Slider
        bind:value={grid.polar_radius}
        label="max radius"
        step={1}
        min={0}
        max={15}
      />
    {/if} -->
            {#if grid.coord.gridType == "polar"}
              <Slider
                bind:value={grid.cell.polar}
                label="Cell {grid.cell_div}"
                step={1}
                min={0}
                max={18}
              />
              <Slider
                bind:value={grid.section.polar}
                label="Section {grid.section_div}"
                step={1}
                min={0}
                max={18}
              />
            {/if}
            <Slider
              bind:value={grid.coord.offset}
              label="Offset"
              step={0.1}
              min={-10}
              max={10}
            />
            <Checkbox bind:value={grid.coord.inf} label="♾️ Infinite Grid" />
          </TabPage>
          <TabPage title="Appearance">
            <Color bind:value={grid.coord.bgd} label="Grid Bgd" />
            <Slider
              bind:value={grid.coord.alpha}
              label="Grid Alpha"
              step={0.01}
              min={0}
              max={1}
            />
          </TabPage>
        </TabGroup>
      </Folder>
    </Folder>
    <Separator />
  {/if}
{/snippet}

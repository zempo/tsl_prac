import Scene_0 from "./Scene_0.svelte";
import Scene_1 from "./Scene_1.svelte";
import Scene_2 from "./Scene_2.svelte";
import Scene_3 from "./Scene_3.svelte";
// import Scene_4 from './Scene_4.svelte';
// import Scene_5 from './Scene_5.svelte';

export const sceneTree = {
  scenes: [
    {
      title: "Intro",
      notes: "",
      content: Scene_0,
      customEnv: false,
    },
    {
      title: "TSL_ref",
      notes: "",
      content: Scene_1,
      customEnv: false,
    },
    {
      title: "TSL_tex",
      notes: "",
      content: Scene_2,
      customEnv: false,
    },
    {
      title: "TSL_lighting",
      notes: "",
      content: Scene_3,
      customEnv: false,
    },
  ],
};

export const sc_entries = sceneTree.scenes.reduce((acc, sc, idx) => {
  acc[sc.title] = Number(idx);
  return acc;
}, {});

/**
 *
 * *outline
 * sc6: html /	text
 * sc7: meshreflector
 * sc8: iridescent shader
 *
 * */

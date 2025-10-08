import * as THREE from "three";
import { sceneTree } from "../views/tree";
import { grid } from "./grid.svelte";
import { bloc } from "./bloc.svelte";
import { comp } from "./composite.svelte";
import { envMain } from "./env.svelte";
// import { sc1 } from './delta/sc1.svelte';
// import { sc3 } from './delta/sc3.svelte';
// import { sc4 } from './delta/sc4.svelte';
// import { sc5 } from './delta/sc5.svelte';
// import { sc2 } from './delta/sc2.svelte';

/**
 * * Shared Scenes state
 * */
/* eslint-disable no-undef */
class SceneMain {
  tweaks_on = $state(true);
  composite_on = $state(true);
  composite_str = $derived(
    this.composite_on ? "Use Debug View" : "Use Composite View"
  );

  useScene = $state(0);
  sceneCount = $state(sceneTree.scenes.length);
  sceneOf = $derived.by(() => {
    return `${this.useScene + 1} of ${this.sceneCount}`;
  });

  last_bgd = $state("#0e1625");
  canvas_bgd = $state("#0e1625");
  canvas_size = $state({
    w: 100,
    h: 100,
  });

  giz = $state({
    _on: true,
    speed: 1,
    type: "sphere",
    placement: "top-left",
    size: 125,
  });
  giz_scene = $state(new THREE.Scene());
  giz_ref = $state(null);

  cam_tweaks = $state(false);
  cam_type = $state(0);
  cam_str = $derived.by(() => {
    return this.cam_type === 1 ? "Use Perspective" : "Use Ortho Camera";
  });
  cam_init = $state([-3, 1.5, 5]);
  cam_fov = $state(50);
  ortho_ref = $state();
  ortho_init = $state([20, 20, 20]);
  ortho_zoom = $state(60);
  toggleCam() {
    this.cam_type = this.cam_type === 1 ? 0 : 1;
  }

  cam_controls = $state();

  shadow_res = $state(4096);

  toggleGiz() {
    this.composite_on = !this.composite_on;
  }

  resetCam(controls = this.cam_controls) {
    this.cam_type = 0;
    this.cam_fov = 50;
    // controls?.setLookAt(0, 0, 5, 0, 0, 0, true); // v2
    // controls?.normalizeRotations().setLookAt(0, 0, 5, 0, 0, 0, true); // v3
    controls?.setTarget(0, 0, 0, true);
    controls?.reset(true);
  }

  resetMain() {
    this.giz._on = true;
    this.resetCam(this.cam_controls);
    comp.resetComp();
    envMain.resetEnv();
    grid.resetGrid();

    this.canvas_bgd = this.last_bgd;
    this.canvas_size.h = 100;
    this.canvas_size.w = 100;
  }

  last = $state("");
  shortcuts(e, ...props) {
    let key = e.key;
    if (
      this.last === "Control" &&
      (e.key === "ArrowLeft" || e.key === "ArrowRight")
    ) {
      if (e.key === "ArrowRight") {
        this.useScene = Number((this.useScene + 1) % this.sceneCount);
      } else {
        this.useScene = Number(
          (this.useScene - 1 + this.sceneCount) % this.sceneCount
        );
      }
    }

    switch (key) {
      // *camera
      case "c":
        if (this.last !== "Control" && this.last !== "Alt") {
          this.cam_tweaks = !this.cam_tweaks;
        }
        if (this.last === "Alt") {
          this.toggleCam();
        }
        if (this.last === "Control") {
          this.toggleGiz();
        }
        break;
      // *env
      case "w":
        envMain.env_tweaks = !envMain.env_tweaks;
        break;
      // *tweaks
      case "t":
        this.tweaks_on = !this.tweaks_on;
        break;
      case "l":
        console.log(this.cam_controls);
        break;
      // *reset
      case "r":
        this.resetMain();
        break;
      default:
        break;
    }

    this.last = key;
  }
}

export const sceneMain = new SceneMain();

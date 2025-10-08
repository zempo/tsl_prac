import { sceneMain } from '../main.svelte';

class SC1 {
	localLook() {
		sceneMain.resetCam();
		sceneMain.cam_controls?.dolly(-12, true);

		sceneMain.last_bgd = sceneMain.canvas_bgd;
		// sceneMain.canvas_bgd = '#2c2a2f';
	}
	dispose() {
		// sceneMain.canvas_bgd = sceneMain.last_bgd;
	}
}

export const sc1 = new SC1();

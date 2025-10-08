import { sceneMain } from './main.svelte';

// *Bloc Logic, here

// * TransformControls
class Trans {
	mode = $state('translate');
	transform_ref = $state();
	updating = $state(false);
	updateStr = $derived(this.updating ? '🟠 Apply Transform... 🟠' : '✅ Transform Set! ✅');

	preventCameraControls(event) {
		// This prevents the camera controls from receiving the event
		event.stopPropagation();
		event.preventDefault();
	}

	disableCameraControls() {
		if (sceneMain.cam_controls) {
			// Store the original state
			sceneMain.cam_controls._originalEnabled = sceneMain.cam_controls.enabled;
			sceneMain.cam_controls.enabled = false;
		}
	}

	enableCameraControls() {
		if (sceneMain.cam_controls && sceneMain.cam_controls._originalEnabled !== undefined) {
			sceneMain.cam_controls.enabled = sceneMain.cam_controls._originalEnabled;
		}
	}

	// *onmount
	resolveControlsConflicts() {
		if (this.transform_ref) {
			// Listen for transform control events
			this.transform_ref.addEventListener('mouseDown', () => {
				this.updating = true;
				this.disableCameraControls();

				// Add event listeners to prevent camera controls from receiving events
				document.addEventListener('mousemove', this.preventCameraControls, {
					passive: false,
					capture: true
				});
				document.addEventListener('touchmove', this.preventCameraControls, {
					passive: false,
					capture: true
				});
			});

			this.transform_ref.addEventListener('mouseUp', () => {
				// console.log('Transform ended - enabling camera controls');
				this.enableCameraControls();

				// Remove event listeners
				document.removeEventListener('mousemove', this.preventCameraControls, { capture: true });
				document.removeEventListener('touchmove', this.preventCameraControls, { capture: true });
			});

			// Also handle other events that might indicate transformation
			this.transform_ref.addEventListener('objectChange', () => {
				// This event fires when the object is being transformed
			});
		}
	}
	// *ondestroy
	revertControls() {
		document.removeEventListener('mousemove', this.preventCameraControls, { capture: true });
		document.removeEventListener('touchmove', this.preventCameraControls, { capture: true });
	}

	resetTrans() {
		if (this.transform_ref) {
			this.transform_ref.object.position.set(0, 1, 0);
			this.transform_ref.object.rotation.set(0, 0, 0);
			this.transform_ref.object.scale.set(1, 1, 1);
			this.mode = 'translate';
			this.updating = false;
		}
	}

	applyTrans() {
		this.updating = false;
		const obj = this.transform_ref.object;
		const newTransform = {
			pos: obj.position.clone(),
			scale: obj.scale.clone(),
			rot: obj.rotation.clone()
		};
		return newTransform;
		//  object to transform, transform_ref
	}
}

export const trans = new Trans();

class Bloc {
	resetBloc() {
		trans.resetTrans();
	}
}

export const bloc = new Bloc();

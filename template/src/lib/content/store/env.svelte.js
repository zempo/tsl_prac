import { skyPresets } from '../env/skypresets';

class EnvMain {
	useEnv = $state(0);
	lastEnv = $state(0);
	env_tweaks = $state(true);
	shadow_res = $state(4096);
	l_c1 = $state('#ffffff');
	l_c2 = $state('#fbf7d4');

	sky = $state({
		azimuth: 0,
		elevation: 0,
		exposure: 0,
		mieCoefficient: 0,
		mieDirectionalG: 0,
		rayleigh: 0,
		turbidity: 0
	});
	applyPreset(p) {
		this.sky.azimuth = p.azimuth;
		this.sky.elevation = p.elevation;
		this.sky.exposure = p.exposure;
		this.sky.mieCoefficient = p.mieCoefficient;
		this.sky.mieDirectionalG = p.mieDirectionalG;
		this.sky.rayleigh = p.rayleigh;
		this.sky.turbidity = p.turbidity;
	}

	env_type = $state('cube');
	env_url = $state('/texture/env/maps/0/nx.png');

	resetEnv() {
		// this.useEnv = 0;
		this.applyPreset(skyPresets.sunset);
		this.env_tweaks = true;
		this.shadow_res = 4096;
		this.l_c1 = '#ffffff';
		this.l_c2 = '#fbf7d4';
	}
}

export const envMain = new EnvMain();

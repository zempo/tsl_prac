import { BlendFunction, KernelSize, ToneMappingMode } from 'postprocessing';

class Composite {
	tone = $state({
		mode: ToneMappingMode.AGX,
		adaptive: false,
		resolution: 256,
		maxLuminance: 4.0,
		whitePoint: 8,
		middleGrey: 0.6,
		minLuminance: 0.01,
		averageLuminance: 1.0,
		adaptationRate: 1.0,
		blendFunction: BlendFunction.SRC
	});

	/**
@property — {Number} LINEAR - No tone mapping, only exposure.

@property — {Number} REINHARD - Simple Reinhard tone mapping.

@property — {Number} REINHARD2 - Modified Reinhard tone mapping.

@property — {Number} REINHARD2_ADAPTIVE - Simulates the optic nerve responding to the amount of light it is receiving.

@property — {Number} UNCHARTED2 - Uncharted 2 tone mapping. http://filmicworlds.com/blog/filmic-tonemapping-operators.

@property — {Number} OPTIMIZED_CINEON - Deprecated. Use CINEON instead.

@property — {Number} CINEON - Optimized filmic operator by Jim Hejl and Richard Burgess-Dawson.

@property — {Number} ACES_FILMIC - ACES tone mapping with a scale of 1.0/0.6.

@property — {Number} AGX - Filmic tone mapping. Requires three r160 or higher. https://github.com/EaryChow/AgX.

@property — {Number} NEUTRAL - Neutral tone mapping by Khronos. 
	 * 
	 * */
	tone_modes = $state({
		LINEAR: ToneMappingMode.LINEAR,
		REINHARD: ToneMappingMode.REINHARD,
		REINHARD2: ToneMappingMode.REINHARD2,
		REINHARD2_ADAPTIVE: ToneMappingMode.REINHARD2_ADAPTIVE,
		UNCHARTED2: ToneMappingMode.UNCHARTED2,
		'⚠️⚠️ OPTIMIZED_CINEON (deprecated)': ToneMappingMode.OPTIMIZED_CINEON,
		CINEON: ToneMappingMode.CINEON,
		ACES_FILMIC: ToneMappingMode.ACES_FILMIC,
		AGX: ToneMappingMode.AGX,
		NEUTRAL: ToneMappingMode.NEUTRAL
	});

	bloom = $state({
		intensity: 0.1,
		luminanceThreshold: 0.15,
		height: 512,
		width: 512,
		luminanceSmoothing: 0.08,
		mipmapBlur: true,
		kernelSize: KernelSize.MEDIUM
	});

	dof = $state({
		focusDistance: 0.1,
		focalLength: 10,
		bokehScale: 10,
		height: 1080
	});

	tint = $state({
		r: 0,
		g: 0,
		b: 0
	});

	resetComp() {
		this.bloom.intensity = 0.1;
		this.bloom.luminanceThreshold = 0.15;
		this.bloom.height = 512;
		this.bloom.width = 512;
		this.bloom.luminanceSmoothing = 0.08;
		this.bloom.mipmapBlur = true;
		this.bloom.kernelSize = KernelSize.MEDIUM;

		this.dof.focusDistance = 0.1;
		this.dof.focalLength = 10;
		this.dof.bokehScale = 10;
		this.dof.height = 1080;

		this.tint.r = 0;
		this.tint.g = 0;
		this.tint.b = 0;

		this.tone.mode = ToneMappingMode.AGX;
		this.tone.adaptive = false;
		this.tone.resolution = 256;
		this.tone.maxLuminance = 4.0;
		this.tone.whitePoint = 4.0;
		this.tone.middleGrey = 0.6;
		this.tone.minLuminance = 0.01;
		this.tone.averageLuminance = 1.0;
		this.tone.adaptationRate = 1.0;
		this.tone.blendFunction = BlendFunction.SRC;
	}
}

export const comp = new Composite();

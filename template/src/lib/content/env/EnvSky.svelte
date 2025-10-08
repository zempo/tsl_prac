<script>
	import { Spring } from 'svelte/motion';
	import { skyPresets } from './skypresets';
	import { T, useThrelte } from '@threlte/core';
	import { Sky } from '@threlte/extras';
	import { envMain } from '../store/env.svelte';

	// const { sky } = sceneMain;
	const { renderer, invalidate } = useThrelte();

	const presetSpring = new Spring(skyPresets.sunset, {
		damping: 0.95,
		precision: 0.0001,
		stiffness: 0.05
	});

	let setEnvironment = $state(true);

	envMain.applyPreset(skyPresets.sunset);

	$effect(() => {
		presetSpring.set({ ...envMain.sky });
	});
	$effect(() => {
		renderer.toneMappingExposure = envMain.sky.exposure;
		invalidate();
	});
</script>

<Sky {setEnvironment} {...presetSpring.current} />
{#if envMain.sky.exposure < 0.5}
	<T.AmbientLight args={[0xffffff, 0.75]} />
{/if}

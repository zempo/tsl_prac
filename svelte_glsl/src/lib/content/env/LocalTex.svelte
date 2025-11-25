<script>
	import * as THREE from 'three';
	import { useLoader, useThrelte, T } from '@threlte/core';
	import { Environment, useTexture } from '@threlte/extras';
	import { envMain } from '../store/env.svelte';
	const { scene } = useThrelte();

	let {
		loader = THREE.TextureLoader,
		url = '/texture/env/maps/blockadesLabsSkybox/scifi_white_sky_scrapers_in_clouds_at_day_time.jpg',
		bBlur = 0.01,
		eInt = 1,
		bInt = 1
	} = $props();

	const map = useLoader(loader).load(url, {
		transform(result) {
			// scene.encoding = THREE.sRGBEncoding;
			result.mapping = THREE.EquirectangularReflectionMapping;
			result.colorSpace = THREE.SRGBColorSpace;
			// scene.background = result;
			// scene.environment = result;
			scene.backgroundBlurriness = bBlur;
			scene.environmentIntensity = eInt;
			scene.backgroundIntensity = bInt;
			return result;
		}
	});
</script>

{#await map then texture}
	<Environment isBackground={envMain.useEnv === 3} {texture} />
	{#if envMain.useEnv === 3}
		<T.DirectionalLight
			args={[envMain.l_c2, 2]}
			position={[5, 10, 5]}
			castShadow
			shadow.mapSize.width={envMain.shadow_res}
			shadow.mapSize.height={envMain.shadow_res}
			shadow.camera.far={20}
			shadow.camera.left={-10}
			shadow.camera.top={10}
			shadow.camera.right={10}
			shadow.camera.bottom={-10}
			shadow.bias={0.0001}
		/>
	{/if}
{/await}

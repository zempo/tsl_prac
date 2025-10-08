<script>
	import * as THREE from 'three';
	import { Environment } from '@threlte/extras';
	import { T, useLoader, useThrelte } from '@threlte/core';
	import { RGBELoader } from 'three/examples/jsm/Addons.js';
	import { envMain } from '../store/env.svelte';

	const { scene } = useThrelte();

	let { url = '' } = $props();

	const { load } = useLoader(RGBELoader);
	const map = load(url, {
		transform(result) {
			// scene.encoding = THREE.sRGBEncoding;
			result.mapping = THREE.EquirectangularReflectionMapping;
			scene.backgroundBlurriness = 0.24;
			scene.environmentIntensity = 1;
			scene.backgroundIntensity = 1;
			return result;
		}
	});
</script>

{#await map then texture}
	<Environment isBackground={envMain.useEnv === 2} {texture} />
	<T.DirectionalLight
		args={[envMain.l_c2, 1]}
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
{/await}

<!-- 

const params = {
  e_map: 0,
  e_strength: 4,
  b_strength: 1,
  b_rot: 0,
  b_blur: 0,
};

const cubeTextureLoader = new THREE.CubeTextureLoader();
// LDR cube texture
const environmentMap = cubeTextureLoader.load([
  `/environmentMaps/${params.e_map}/px.png`,
  `/environmentMaps/${params.e_map}/nx.png`,
  `/environmentMaps/${params.e_map}/py.png`,
  `/environmentMaps/${params.e_map}/ny.png`,
  `/environmentMaps/${params.e_map}/pz.png`,
  `/environmentMaps/${params.e_map}/nz.png`,
]);

env_gui
  .add(params, "e_map", { Allycatz: 0, Auditorium: 1, "Country Roads": 2 })
  .name("Environment")
  .onChange((v) => {
    const newEnv = cubeTextureLoader.load([
      `/environmentMaps/${v}/px.png`,
      `/environmentMaps/${v}/nx.png`,
      `/environmentMaps/${v}/py.png`,
      `/environmentMaps/${v}/ny.png`,
      `/environmentMaps/${v}/pz.png`,
      `/environmentMaps/${v}/nz.png`,
    ]);
    gsap
      .timeline()
      .to(scene, {
        backgroundBlurriness: 1,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          scene.environment = newEnv;
          scene.background = newEnv;
        },
      })
      .to(scene, {
        backgroundBlurriness: 0,
        duration: 0.3,
        ease: "power2.out",
      });
  });

-->

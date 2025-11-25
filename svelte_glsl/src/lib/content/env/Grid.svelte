<script>
	import { grid } from '../store/grid.svelte';
	import { Grid } from '@threlte/extras';

	// import { T } from '@threlte/core';
	// import { PlaneGeometry } from 'three';
	// import { SimplexNoise } from 'three/examples/jsm/Addons.js';

	// $inspect(grid.position);
</script>

<!-- ! Basic Grid -->
<!-- 
<Grid
  position.y={-10}
  sectionThickness={1}
  infiniteGrid
  cellColor="#dddddd"
  sectionColor="#ffffff"
  sectionSize={10}
  cellSize={2}
/>
-->

{#if grid.useGeo}
	<!-- ?? <Grid><T is={terrainGeo}/><Grid/> -->
{:else}
	<Grid
		position={grid.position}
		plane={grid.coord.plane}
		cellColor={grid.cell.color}
		cellSize={grid.cell.size}
		cellThickness={grid.cell.stroke}
		sectionColor={grid.section.color}
		sectionSize={grid.section.size}
		sectionThickness={grid.section.stroke}
		followCamera={false}
		infiniteGrid={grid.coord.inf}
		gridSize={grid.coord.size}
		backgroundColor={grid.coord.bgd}
		backgroundOpacity={grid.coord.alpha}
		type={grid.coord.gridType}
		axis={grid.line_axis}
		maxRadius={grid.polar_radius}
		cellDividers={grid.cell.polar}
		sectionDividers={grid.section.polar}
	/>
{/if}

class GridMain {
	grid_on = $state(true);

	cell = $state({
		size: 1,
		color: '#cccccc',
		stroke: 1.4,
		polar: 12
	});

	section = $state({
		size: 5,
		color: '#ff3e00',
		stroke: 4,
		polar: 4
	});

	coord_types = $state({
		polar: 'polar',
		grid: 'grid',
		lines: 'lines',
		circular: 'circular'
	});

	coord = $state({
		size: [20, 20],
		plane: 'xz',
		plane_types: ['xz', 'xy', 'zy'],
		offset: 0,
		inf: false,
		bgd: '#4f4c71',
		alpha: 0.2,
		topology: 'plane',
		gridType: 'polar'
	});

	position = $derived.by(() => {
		let pos = [0, 0, 0];
		let offIdx = 1;
		if (this.coord.plane === 'xy') offIdx = 2;
		if (this.coord.plane === 'zy') offIdx = 0;
		pos[offIdx] = this.coord.offset;
		return pos;
	});

	polar_radius = $derived(Math.max(...this.coord.size) / 2);

	cell_div = $derived(`(${180 / this.cell.polar}° Segments)`);
	section_div = $derived(`(${180 / this.section.polar}° Segments)`);

	line_axis_types = $state({ x: 'x', y: 'y', z: 'z' });
	line_axis = $state('x');

	useGeo = $state(false);

	resetGrid() {
		this.grid_on = true;
		this.cell.size = 1;
		this.cell.color = '#cccccc';
		this.cell.stroke = 1.4;
		this.cell.polar = 12;

		this.section.size = 5;
		this.section.color = '#ff3e00';
		this.section.stroke = 4;
		this.section.polar = 4;

		this.coord.size = [20, 20];
		this.coord.plane = 'xz';
		this.coord.offset = 0;
		this.coord.inf = false;
		this.coord.bgd = '#4f4c71';
		this.coord.alpha = 0.2;
		this.coord.topology = 'plane';
		this.coord.gridType = 'polar';

		this.line_axis = 'x';
	}
}

export const grid = new GridMain();

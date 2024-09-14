import plugin from 'tailwindcss/plugin';

const radialGradientPlugin = plugin(
	function ({ matchUtilities, theme }) {
		matchUtilities(
			{
				// map to bg-radient-[*]
				'bg-gradient': value => ({
					'background-image': `radial-gradient(${value},var(--tw-gradient-stops))`,
				}),
			},
			{ values: theme('radialGradients') }
		)
	},
	{
		theme: {
			radialGradients: _presets(),
		},
	}
);

/**
 * utility class presets
 */
function _presets() {
	const shapes = ['circle', 'ellipse'];
	const pos = {
		c: 'center',
		t: 'top',
		b: 'bottom',
		l: 'left',
		r: 'right',
		tl: 'top left',
		tr: 'top right',
		bl: 'bottom left',
		br: 'bottom right',
	};
	let result: any = {};
	for (const shape of shapes)
		for (const [posName, posValue] of Object.entries(pos))
			result[`${shape}-${posName}`] = `${shape} at ${posValue}`;

	return result;
}

export default radialGradientPlugin;

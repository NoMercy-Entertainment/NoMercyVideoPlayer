/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const plugin = require('tailwindcss/plugin');

/** @type {import('tailwindcss').Config} */
module.exports = {
	mode: 'jit',
	prefix: 'nm-',
	content: [
		'./src/**/*.{js,ts}',
		'./index.html',
		'./index.js',
	],
	darkMode: 'media',
	theme: {
		screens: {
			sm: '640px',
			md: '768px',
			lg: '1024px',
			xl: '1280px',
			'2xl': '1536px',
			'3xl': '1800px',
			'4xl': '1920px',
			'5xl': '2200px',
			tv: {
				min: '960px',
				max: '960px',
			},
		},
		extend: {
			width: {
				available: [
					'100%',
					'-webkit-fill-available',
					'-moz-available',
					'stretch',
				],
			},
			height: {
				available: [
					'100%',
					'-webkit-fill-available',
					'-moz-available',
					'stretch',
				],
			},
			minHeight: {
				available: [
					'100%',
					'-webkit-fill-available',
					'-moz-available',
					'stretch',
				],
			},
			maxHeight: {
				available: [
					'100%',
					'-webkit-fill-available',
					'-moz-available',
					'stretch',
				],
			},
		},
	},
	variants: {
		extend: {
			last: ['translate-x', 'translate-y'],
		},
	},
	plugins: [
		// require('@tailwindcss/forms'),
		require('tailwindcss-children'),
		plugin(({ addVariant }) => {
			addVariant('range-track', [
				'&::-webkit-slider-runnable-track',
				'&::-moz-range-track',
				'&::-ms-track',
			]);
			addVariant('range-thumb', [
				'&::-webkit-slider-thumb',
				'&::-moz-range-thumb',
				'&::-ms-thumb',
			]);
		}),
	],
};

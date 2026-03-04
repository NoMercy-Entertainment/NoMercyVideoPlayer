import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

// noinspection JSUnusedGlobalSymbols
export default defineConfig({
	base: '/',
	publicDir: resolve(__dirname, 'public'),
	plugins: [dts()],
	build: {
		sourcemap: false,
		minify: 'terser',
		target: 'es2022',
		rollupOptions: {
			input: ['./src/index.ts'],
			external: [
				'hls.js',
				'webvtt-parser',
				'tailwind-merge',
			],
			output: {
				globals: {
					'hls.js': 'Hls',
					'webvtt-parser': 'WebVTTParser',
					'tailwind-merge': 'tailwindMerge',
				},
			},
		},
		lib: {
			entry: resolve(__dirname, 'src/index.ts'),
			name: 'nmplayer',
			formats: ['es', 'cjs', 'umd', 'iife'],
			fileName: 'nomercy-video-player',
		},
	},
	clearScreen: true,
});
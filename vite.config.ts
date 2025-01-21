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
		target: 'modules',
		rollupOptions: {
			input: ['./src/index.ts'],
		},
		lib: {
			entry: resolve(__dirname, 'src/index.ts'),
			name: 'nmplayer',
			formats: ['umd', 'iife'],
			fileName: 'nomercy-video-player',
		},
	},
	clearScreen: true,
});
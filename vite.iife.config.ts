/// <reference types="vitest" />
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { nomercyTranslationsPlugin } from '@nomercy-entertainment/nomercy-player-core/vite-plugin';
import { defineConfig } from 'vite';

const kitRoot = fileURLToPath(new URL('../nomercy-player-kit/src', import.meta.url));

export default defineConfig({
	base: '/',
	plugins: [nomercyTranslationsPlugin()],
	resolve: {
		alias: [
			{
				find: '@nomercy-entertainment/nomercy-player-core/vite-plugin',
				replacement: `${kitRoot}/vite-plugin.ts`,
			},
			{
				find: /^@nomercy-entertainment\/nomercy-player-core\/(.*)$/,
				replacement: `${kitRoot}/$1.ts`,
			},
			{
				find: '@nomercy-entertainment/nomercy-player-core',
				replacement: `${kitRoot}/index.ts`,
			},
		],
	},
	build: {
		outDir: 'dist',
		emptyOutDir: false,
		sourcemap: false,
		minify: 'oxc',
		target: 'es2022',
		rollupOptions: {
			// hls.js stays external — CDN consumers add it via a separate <script>.
			// @nomercy-entertainment/nomercy-player-core is bundled: CDN users have
			// no package manager, so the kit must travel with the player.
			external: ['hls.js'],
			output: {
				globals: {
					'hls.js': 'Hls',
				},
			},
		},
		lib: {
			entry: resolve(__dirname, 'src/iife-entry.ts'),
			name: 'nmplayer',
			formats: ['iife'],
			fileName: () => 'nomercy-video-player.iife.js',
		},
	},
	clearScreen: true,
});

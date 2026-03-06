/// <reference types="vitest" />
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

/**
 * Separate build config for the IIFE bundle.
 * Uses src/iife.ts which Object.assigns named exports onto
 * the callable factory, then exports only default — so the
 * output `var nmplayer = ...` is directly callable.
 */
export default defineConfig({
	build: {
		sourcemap: false,
		minify: 'terser',
		target: 'es2022',
		emptyOutDir: false,
		lib: {
			entry: resolve(__dirname, 'src/iife.ts'),
			name: 'nmplayer',
			formats: ['iife'],
			fileName: 'nomercy-video-player',
		},
		rollupOptions: {
			output: {
				exports: 'default',
			},
		},
	},
});

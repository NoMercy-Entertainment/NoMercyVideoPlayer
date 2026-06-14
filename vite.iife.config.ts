// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

/// <reference types="vitest" />
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { nomercyTranslationsPlugin } from '@nomercy-entertainment/nomercy-player-core/vite-plugin';
import { defineConfig } from 'vite';

const coreRoot = fileURLToPath(new URL('../nomercy-player-core/src', import.meta.url));
// Monorepo: bundle the core from its live TypeScript source. Standalone / CI:
// no sibling checkout, so resolve the core from the installed
// @nomercy-entertainment/nomercy-player-core package and bundle that.
const useCoreSource = existsSync(coreRoot);

export default defineConfig({
	base: '/',
	plugins: [nomercyTranslationsPlugin()],
	resolve: {
		alias: useCoreSource
			? [
					{
						find: '@nomercy-entertainment/nomercy-player-core/vite-plugin',
						replacement: `${coreRoot}/vite-plugin.ts`,
					},
					{
						find: /^@nomercy-entertainment\/nomercy-player-core\/(.*)$/,
						replacement: `${coreRoot}/$1.ts`,
					},
					{
						find: '@nomercy-entertainment/nomercy-player-core',
						replacement: `${coreRoot}/index.ts`,
					},
				]
			: [],
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

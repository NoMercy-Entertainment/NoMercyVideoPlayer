// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

/// <reference types="vitest" />
import type { Alias } from 'vite';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { nomercyTranslationsPlugin } from '@nomercy-entertainment/nomercy-player-core/vite-plugin';
import { defineConfig } from 'vite';

const corePackageRoot = fileURLToPath(new URL('../nomercy-player-core', import.meta.url));
// Monorepo: bundle the core from its live TypeScript source. Standalone / CI:
// no sibling checkout, so the core resolves from the installed
// @nomercy-entertainment/nomercy-player-core package and its dist is bundled.
const useCoreSource = existsSync(resolve(corePackageRoot, 'src'));

// Aliases derive from the core's exports map so directory-index subpaths
// (plugins/key-handler/index.ts) and remapped ones (streams/* -> adapters/stream/*)
// resolve exactly like the published package. Longest find first: string aliases
// prefix-match, so the bare package name must not shadow its own subpaths.
function coreSourceAliases(): Alias[] {
	const coreManifest = JSON.parse(readFileSync(resolve(corePackageRoot, 'package.json'), 'utf8')) as {
		exports: Record<string, string | { import?: string }>;
	};
	const aliases: Alias[] = [];
	for (const [subpath, target] of Object.entries(coreManifest.exports)) {
		const importTarget = typeof target === 'string' ? target : target.import;
		if (!importTarget?.startsWith('./dist/')) {
			continue;
		}
		const sourceFile = resolve(corePackageRoot, importTarget.replace('./dist/', 'src/').replace(/\.js$/, '.ts'));
		if (!existsSync(sourceFile)) {
			throw new Error(`core export "${subpath}" maps to ${importTarget}, but ${sourceFile} is missing`);
		}
		aliases.push({ find: `@nomercy-entertainment/nomercy-player-core${subpath.slice(1)}`, replacement: sourceFile });
	}
	return aliases.sort((first, second) => second.find.length - first.find.length);
}

export default defineConfig({
	base: '/',
	plugins: [nomercyTranslationsPlugin()],
	resolve: {
		alias: useCoreSource ? coreSourceAliases() : [],
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

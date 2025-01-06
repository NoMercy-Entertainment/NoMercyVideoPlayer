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
		rollupOptions: {
			input: ['./index.html'],
			treeshake: true,
			output: {
				// inlineDynamicImports: false,
				dir: 'dist',
				entryFileNames: '[name].js',
				chunkFileNames: '[name].js',
				assetFileNames: '[name].[ext]',
				manualChunks: {
					index: ['./src/index.ts'],
					setup: ['./setup.ts'],
					plugin: ['./src/plugin.ts'],
					translations: ['./src/translations.ts'],
					helpers: ['./src/helpers.ts'],
					base: ['./src/base.ts'],
					keyHandlerPlugin: ['./src/plugins/keyHandlerPlugin.ts'],
					octopusPlugin: ['./src/plugins/octopusPlugin.ts'],
					sabrePlugin: ['./src/plugins/sabrePlugin.ts'],
					templatePlugin: ['./src/plugins/templatePlugin.ts'],
				},
			},
		},
		lib: {
			entry: resolve(__dirname, 'src/index.ts'),
			name: 'NoMercyPlayer',
			formats: ['es'],
			fileName: 'no-mercy-player',
		},
	},
	server: {
		port: 5501,
		host: '0.0.0.0',
		hmr: {
			port: 5501,
			protocol: 'wss',
			host: 'vscode.nomercy.tv',
			clientPort: 443,
			path: '/vite/',
		},
	},
	preview: {
		port: 5501,
		host: '0.0.0.0',
	},
	clearScreen: true,
});

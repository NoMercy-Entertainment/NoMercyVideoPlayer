"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const vite_1 = require("vite");
const vite_plugin_dts_1 = __importDefault(require("vite-plugin-dts"));
// noinspection JSUnusedGlobalSymbols
exports.default = (0, vite_1.defineConfig)({
    base: '/',
    publicDir: (0, path_1.resolve)(__dirname, 'public'),
    plugins: [(0, vite_plugin_dts_1.default)()],
    build: {
        sourcemap: false,
        minify: 'terser',
        target: 'modules',
        rollupOptions: {
            input: ['./src/index.ts'],
        },
        lib: {
            entry: (0, path_1.resolve)(__dirname, 'src/index.ts'),
            name: 'nmplayer',
            formats: ['umd', 'iife'],
            fileName: 'nomercy-video-player',
        },
    },
    clearScreen: true,
});

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OctopusPlugin = void 0;
// @ts-nocheck
const subtitles_octopus_1 = __importDefault(require("../../public/js/octopus/subtitles-octopus"));
const plugin_1 = __importDefault(require("../plugin"));
class OctopusPlugin extends plugin_1.default {
    initialize(player) {
        this.player = player;
        // Initialize the plugin with the player
    }
    use() {
        // this.player.on('item', this.destroy.bind(this));
        this.player.on('captionsChanged', this.opus.bind(this));
    }
    dispose() {
        // this.player.off('item', this.destroy.bind(this));
        this.player.off('captionsChanged', this.opus.bind(this));
        this.destroy();
    }
    destroy() {
        this.player.octopusInstance?.dispose();
        this.player.octopusInstance = null;
    }
    async opus() {
        this.destroy();
        const subtitleURL = this.player.getSubtitleFile() ? `${this.player.options.basePath ?? ''}${this.player.getSubtitleFile()}` : null;
        if (!subtitleURL)
            return;
        const tag = subtitleURL?.match(/\w+\.\w+\.\w+$/u)?.[0];
        let [, , ext] = tag ? tag.split('.') : [];
        if (!ext) {
            const parts = subtitleURL.split('.');
            ext = parts.at(-1) || '';
        }
        if (ext != 'ass' && ext != 'ssa')
            return;
        if (subtitleURL) {
            await this.player.fetchFontFile();
            const fontFiles = this.player.fonts
                ?.map((f) => `${this.player.options.basePath ?? ''}${f.file}`);
            this.player.getElement()
                .querySelectorAll('.libassjs-canvas-parent')
                .forEach(el => el.remove());
            const options = {
                video: this.player.getVideoElement(),
                subUrl: subtitleURL,
                fonts: fontFiles,
                lossyRender: this.player.options.lossyRender,
                accessToken: this.player.options.accessToken,
                targetFps: this.player.options.targetFps,
                debug: this.player.options.debug,
                blendRender: this.player.options.blendRender,
                lazyFileLoading: this.player.options.lazyFileLoading,
                renderAhead: this.player.options.renderAhead,
                workerUrl: '/js/octopus/subtitles-octopus-worker.js',
                legacyWorkerUrl: '/js/octopus/subtitles-octopus-worker-legacy.js',
                fallbackFont: '/js/octopus/default.ttf',
                onReady: async () => {
                    // this.player.play();
                },
                onError: (event) => {
                    console.error('opus error', event);
                },
            };
            console.log(options);
            if (subtitleURL && subtitleURL.includes('.ass')) {
                this.player.octopusInstance = new subtitles_octopus_1.default(options);
            }
        }
    }
    ;
}
exports.OctopusPlugin = OctopusPlugin;
exports.default = OctopusPlugin;

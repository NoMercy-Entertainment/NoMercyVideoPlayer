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
    player;
    resizeObserver;
    initialize(player) {
        this.player = player;
    }
    use() {
        this.player.on('captionsChanged', this.opus.bind(this));
        this.resizeObserver = new ResizeObserver(() => {
            this.resize();
        });
        this.resizeObserver.observe(this.player.container);
    }
    dispose() {
        this.player.off('captionsChanged', this.opus.bind(this));
        this.resizeObserver?.disconnect();
        this.destroy();
    }
    destroy() {
        this.player.octopusInstance?.worker?.terminate();
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
                ?.map((f) => encodeURI(`${this.player.options.basePath ?? ''}${f.file}`));
            this.player.getElement()
                .querySelectorAll('.libassjs-canvas-parent')
                .forEach(el => el.remove());
            const options = {
                video: this.player.getVideoElement(),
                subUrl: encodeURI(subtitleURL),
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
                    this.resize();
                },
                onError: (event) => {
                    console.error('opus error', event);
                },
            };
            if (subtitleURL && subtitleURL.includes('.ass')) {
                this.player.octopusInstance = new subtitles_octopus_1.default(options);
            }
        }
    }
    ;
    resize() {
        if (!this.player?.octopusInstance?.canvasParent || !this.subtitleOverlay)
            return;
        this.player.octopusInstance.canvasParent.style.width = this.subtitleOverlay.style.width;
        this.player.octopusInstance.canvasParent.style.height = this.subtitleOverlay.style.height;
        this.player.octopusInstance.canvasParent.style.position = this.subtitleOverlay.style.position;
        this.player.octopusInstance.canvasParent.style.top = this.subtitleOverlay.style.top;
        this.player.octopusInstance.canvasParent.style.left = this.subtitleOverlay.style.left;
        this.player.octopusInstance.canvasParent.style.transform = this.subtitleOverlay.style.transform;
    }
}
exports.OctopusPlugin = OctopusPlugin;
exports.default = OctopusPlugin;

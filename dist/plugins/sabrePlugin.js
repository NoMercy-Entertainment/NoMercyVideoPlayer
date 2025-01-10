"use strict";
// @ts-ignore
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SabrePlugin = void 0;
const plugin_1 = __importDefault(require("../plugin"));
class SabrePlugin extends plugin_1.default {
    constructor() {
        super(...arguments);
        this.player = {};
        this.frameCallbackHandle = null;
    }
    initialize(player) {
        this.player = player;
        this.player.appendScriptFilesToDocument([
            'https://storage.nomercy.tv/laravel/player/js/sabre/cptable.js',
            'https://storage.nomercy.tv/laravel/player/js/sabre/cputils.js',
            'https://storage.nomercy.tv/laravel/player/js/sabre/opentype.min.js',
            'https://storage.nomercy.tv/laravel/player/js/sabre/sabre.min.js',
        ]);
    }
    use() {
        this.player.on('item', this.sabre.bind(this));
        this.player.on('captionsChanged', this.sabre.bind(this));
    }
    dispose() {
        this.player.off('item', this.sabre.bind(this));
        this.player.off('captionsChanged', this.sabre.bind(this));
        this.destroy();
    }
    destroy() {
        if (this.frameCallbackHandle) {
            this.player.getVideoElement().cancelVideoFrameCallback(this.frameCallbackHandle);
            this.frameCallbackHandle = null;
        }
        const sabreContainer = this.player.getElement().querySelector('.sabre-canvas-container');
        if (sabreContainer) {
            sabreContainer.remove();
        }
    }
    async sabre() {
        if (this.frameCallbackHandle) {
            this.player.getVideoElement().cancelVideoFrameCallback(this.frameCallbackHandle);
            this.frameCallbackHandle = null;
        }
        await this.player.fetchFontFile();
        await new Promise((resolve) => {
            function waitForLoad() {
                if (window.sabre) {
                    resolve();
                    return;
                }
                setTimeout(waitForLoad, 30);
            }
            waitForLoad();
        });
        const sabreContainer = this.player.createElement('div', 'sabre-canvas-container', true)
            .addClasses([
            'absolute',
            'inset-0',
            'pointer-events-none',
            'w-full',
            'h-full',
            'z-10',
        ])
            .prependTo(this.player.getVideoElement().parentElement);
        const video = this.player.getVideoElement();
        const sabreCanvas = this.player.createElement('canvas', 'sabre-canvas', true)
            .addClasses([
            'w-full',
            'h-full',
        ])
            .get();
        let sabreRenderer;
        function updateCanvas(first) {
            let videoWidth = video.videoWidth;
            let videoHeight = video.videoHeight;
            const elementWidth = video.offsetWidth;
            const elementHeight = video.offsetHeight;
            const pixelRatio = window.devicePixelRatio || 1;
            if (!first && videoWidth === elementWidth / pixelRatio && videoHeight == elementHeight / pixelRatio) {
                sabreContainer.style.paddingLeft = `${(sabreContainer.offsetWidth - videoWidth) / 2}px`;
                sabreContainer.style.paddingTop = `${(sabreContainer.offsetHeight - videoHeight) / 2}px`;
                return;
            }
            const elementRatio = elementWidth / elementHeight;
            const ratioWidthHeight = videoWidth / videoHeight;
            const ratioHeightWidth = videoHeight / videoWidth;
            if (isNaN(elementRatio) || isNaN(ratioWidthHeight) || isNaN(ratioHeightWidth))
                return;
            if (elementRatio <= ratioWidthHeight) {
                videoWidth = elementWidth;
                videoHeight = elementWidth * ratioHeightWidth;
            }
            else if (elementRatio > ratioWidthHeight) {
                videoHeight = elementHeight;
                videoWidth = elementHeight * ratioWidthHeight;
            }
            sabreCanvas.width = videoWidth * pixelRatio;
            sabreCanvas.height = videoHeight * pixelRatio;
            sabreCanvas.style.width = `${videoWidth}px`;
            sabreCanvas.style.height = `${videoHeight}px`;
            sabreRenderer.setViewport(videoWidth * pixelRatio, videoHeight * pixelRatio);
            sabreContainer.style.paddingLeft = `${(sabreContainer.offsetWidth - videoWidth) / 2}px`;
            sabreContainer.style.paddingTop = `${(sabreContainer.offsetHeight - videoHeight) / 2}px`;
        }
        const renderFrame = (_now, metaData) => {
            updateCanvas(false);
            if (sabreRenderer.checkReadyToRender()) {
                sabreRenderer.drawFrame(metaData.mediaTime, sabreCanvas, 'bitmap');
            }
            this.frameCallbackHandle = video.requestVideoFrameCallback(renderFrame);
        };
        sabreContainer.appendChild(sabreCanvas);
        const sabre = window.sabre;
        const fonts = [];
        const fontFiles = this.player.fonts
            ?.map((f) => `${this.player.options.basePath ?? ''}${f.file}${this.player.options.accessToken ? `?token=${this.player.options.accessToken}` : ''}`);
        fontFiles.push('https://github.com/NoMercy-Entertainment/media/raw/refs/heads/master/Anime/Anime/No-Rin.(2014)/No-Rin.S00E00/fonts/ARIAL.TTF');
        await Promise.all(fontFiles.map(font => this.player.getFileContents({
            url: font,
            options: {
                type: 'arrayBuffer',
            },
            callback: (data) => {
                fonts.push(window.opentype.parse(data));
            },
        })));
        const textTrackUrl = this.player.getSubtitleFile() ?? null;
        if (textTrackUrl) {
            await this.player.getFileContents({
                url: textTrackUrl,
                options: {
                    type: 'arrayBuffer',
                },
                callback: (data) => {
                    const options = {
                        fonts: fonts,
                        subtitles: data,
                    };
                    sabreRenderer = new sabre.SABRERenderer(options);
                    updateCanvas(true);
                    sabreRenderer.setColorSpace(1, video.videoWidth, video.videoHeight);
                    this.frameCallbackHandle = video.requestVideoFrameCallback(renderFrame.bind(this.player));
                },
            });
        }
    }
}
exports.SabrePlugin = SabrePlugin;
exports.default = SabrePlugin;

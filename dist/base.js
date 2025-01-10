"use strict";
// noinspection JSUnusedGlobalSymbols
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Base = void 0;
const media_session_1 = __importDefault(require("@nomercy-entertainment/media-session"));
class Base {
    constructor() {
        this.eventElement = {};
        this.container = {};
        this.videoElement = {};
        this.overlay = {};
        this.subtitleOverlay = {};
        this.subtitleText = {};
        this.translations = {};
        this.playerId = '';
        this.setupTime = 0;
        // State
        this.message = {};
        // Options
        this.options = {
            muted: false,
            autoPlay: false,
            controls: false,
            debug: false,
            accessToken: '',
            basePath: '',
            playbackRates: [0.5, 1, 1.5, 2],
            stretching: 'uniform',
            controlsTimeout: 3000,
            displayLanguage: 'en',
            preload: 'auto',
            playlist: [],
            disableMediaControls: false,
            disableControls: false,
            disableTouchControls: false,
            doubleClickDelay: 300,
        };
        this.hasPipEventHandler = false;
        this.hasTheaterEventHandler = false;
        this.hasBackEventHandler = false;
        this.hasCloseEventHandler = false;
        this.events = [];
        this.eventElement = document.createElement('div');
        this.mediaSession = new media_session_1.default();
    }
    emit(event, data) {
        this.eventElement?.dispatchEvent?.(new CustomEvent(event, {
            detail: data,
        }));
    }
    on(event, callback) {
        this.eventHooks(event, true);
        this.eventElement?.addEventListener(event, (e) => callback(e.detail));
        this.events.push({ type: event, fn: callback });
    }
    off(event, callback) {
        this.eventHooks(event, false);
        if (callback) {
            this.eventElement.removeEventListener(event, callback);
        }
        if (event === 'all') {
            this.events.forEach((e) => {
                this.eventElement.removeEventListener(e.type, e.fn);
            });
            return;
        }
        this.events.filter(e => e.type === event).forEach((e) => {
            this.eventElement.removeEventListener(e.type, e.fn);
        });
    }
    once(event, callback) {
        this.eventHooks(event, true);
        this.eventElement?.addEventListener(event, e => callback(e.detail), { once: true });
    }
    /**
     * Sets the enabled state of various event hooks.
     * @param event - The event to enable/disable.
     * @param enabled - Whether the event should be enabled or disabled.
     */
    eventHooks(event, enabled) {
        if (event == 'pip') {
            this.hasPipEventHandler = enabled;
        }
        else if (event == 'theaterMode') {
            this.hasTheaterEventHandler = enabled;
        }
        else if (event == 'back') {
            this.hasBackEventHandler = enabled;
        }
        else if (event == 'close') {
            this.hasCloseEventHandler = enabled;
        }
    }
}
exports.Base = Base;

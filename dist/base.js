"use strict";
// noinspection JSUnusedGlobalSymbols
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Base = void 0;
const playerStorage_1 = __importDefault(require("./playerStorage"));
const media_session_1 = __importDefault(require("@nomercy-entertainment/media-session"));
class Base {
    constructor() {
        this.eventTarget = {};
        this.container = {};
        this.videoElement = {};
        this.overlay = {};
        this.subtitleOverlay = {};
        this.subtitleSafeZone = {};
        this.subtitleArea = {};
        this.subtitleText = {};
        this.storage = new playerStorage_1.default();
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
            customStorage: playerStorage_1.default.prototype.storage,
        };
        this.hasPipEventHandler = false;
        this.hasTheaterEventHandler = false;
        this.hasBackEventHandler = false;
        this.hasCloseEventHandler = false;
        this.events = [];
        this.eventTarget = new EventTarget();
        this.mediaSession = new media_session_1.default();
    }
    emit(event, data) {
        this.eventTarget?.dispatchEvent?.(new CustomEvent(event, {
            detail: data,
        }));
    }
    on(event, callback) {
        this.eventHooks(event, true);
        const cb = (e) => callback(e.detail);
        cb.original = callback; // Store original callback reference
        this.eventTarget.addEventListener(event, cb);
        this.events.push({ type: event, fn: cb });
    }
    off(event, callback) {
        this.eventHooks(event, false);
        if (callback) {
            // Find event with matching original callback
            const eventObj = this.events.find(e => e.type === event && e.fn.original === callback);
            if (eventObj) {
                this.eventTarget.removeEventListener(event, eventObj.fn);
                const index = this.events.findIndex(e => e === eventObj);
                if (index > -1) {
                    this.events.splice(index, 1);
                }
            }
            return;
        }
        if (event === 'all') {
            this.events.forEach((e) => {
                this.eventTarget.removeEventListener(e.type, e.fn);
            });
            this.events = []; // Clear all events
            return;
        }
        // Remove all events of specific type
        const eventsToRemove = this.events.filter(e => e.type === event);
        eventsToRemove.forEach((e) => {
            this.eventTarget.removeEventListener(e.type, e.fn);
            const index = this.events.findIndex(event => event === e);
            if (index > -1) {
                this.events.splice(index, 1);
            }
        });
    }
    once(event, callback) {
        this.eventHooks(event, true);
        const cb = (e) => callback(e.detail);
        this.eventTarget.addEventListener(event, cb, { once: true });
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

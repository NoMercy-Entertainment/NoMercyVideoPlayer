import { SetupConfig, TimeData, Track, CurrentTrack } from './index.d';
import { NMPlayer } from './index';

export declare class Base {
    eventElement: HTMLDivElement;
    container: HTMLDivElement;
    videoElement: HTMLVideoElement;
    overlay: HTMLDivElement;
    subtitleOverlay: HTMLDivElement;
    subtitleText: HTMLSpanElement;
    translations: {
        [key: string]: string;
    };
    playerId: string;
    setupTime: number;
    message: NodeJS.Timeout;
    options: Partial<SetupConfig>;
    hasPipEventHandler: boolean;
    hasTheaterEventHandler: boolean;
    hasBackEventHandler: boolean;
    hasCloseEventHandler: boolean;
    constructor();
    /**
     * Trigger an event on the player.
     * @param event type of event to trigger
     * @param data  data to pass with the event
     */
    emit(event: 'all', data?: any): void;
    emit(event: 'ready', data?: any): void;
    emit(event: 'setupError', data?: any): void;
    emit(event: 'playlist', data?: any): void;
    emit(event: 'item', data?: any): void;
    emit(event: 'playlistComplete', data?: any): void;
    emit(event: 'nextClick', data?: any): void;
    emit(event: 'bufferChange', data?: any): void;
    emit(event: 'play', data?: any): void;
    emit(event: 'pause', data?: any): void;
    emit(event: 'buffer', data?: any): void;
    emit(event: 'idle', data?: any): void;
    emit(event: 'complete', data?: any): void;
    emit(event: 'error', data?: any): void;
    emit(event: 'warning', data?: any): void;
    emit(event: 'autostartNotAllowed', data?: any): void;
    emit(event: 'firstFrame', data?: any): void;
    emit(event: 'playAttemptFailed', data?: any): void;
    emit(event: 'playbackRateChanged', data?: any): void;
    emit(event: 'seek', data?: any): void;
    emit(event: 'seeked', data?: any): void;
    emit(event: 'time', data: TimeData): void;
    emit(event: 'mute', data?: any): void;
    emit(event: 'volume', data?: any): void;
    emit(event: 'fullscreen', data?: any): void;
    emit(event: 'resize', data?: any): void;
    emit(event: 'levels', data: ReturnType<NMPlayer['getQualityLevels']>): void;
    emit(event: 'levelsChanged', data: CurrentTrack): void;
    emit(event: 'levelsChanging', data: CurrentTrack): void;
    emit(event: 'visualQuality', data?: any): void;
    emit(event: 'captionsList', data?: any): void;
    emit(event: 'captionsChanged', data?: any): void;
    emit(event: 'audioTracks', data?: Track[]): void;
    emit(event: 'audioTrackChanged', data?: CurrentTrack): void;
    emit(event: 'controls', data?: any): void;
    emit(event: 'displayClick', data?: any): void;
    emit(event: 'float', data?: any): void;
    emit(event: 'containerViewable', data?: any): void;
    emit(event: 'viewable', data?: any): void;
    emit(event: 'adClick', data?: any): void;
    emit(event: 'adCompanions', data?: any): void;
    emit(event: 'adComplete', data?: any): void;
    emit(event: 'adError', data?: any): void;
    emit(event: 'adImpression', data?: any): void;
    emit(event: 'adTime', data?: any): void;
    emit(event: 'adSkipped', data?: any): void;
    emit(event: 'beforePlay', data?: any): void;
    emit(event: 'beforeComplete', data?: any): void;
    emit(event: 'meta', data?: any): void;
    emit(event: 'cast', data?: any): void;
    emit(event: 'castIntercepted', data?: any): void;
    emit(eventType: 'display-message', value: string): void;
    emit(event: string, data?: any): void;
    /**
     * Adds an event listener to the player.
     * @param event - The event to listen for.
     * @param callback - The function to execute when the event occurs.
     */
    on(event: 'all', callback: () => void): void;
    on(event: 'ready', callback: () => void): void;
    on(event: 'setupError', callback: () => void): void;
    on(event: 'playlist', callback: () => void): void;
    on(event: 'item', callback: () => void): void;
    on(event: 'playlistComplete', callback: () => void): void;
    on(event: 'nextClick', callback: () => void): void;
    on(event: 'bufferChange', callback: () => void): void;
    on(event: 'play', callback: () => void): void;
    on(event: 'pause', callback: () => void): void;
    on(event: 'buffer', callback: () => void): void;
    on(event: 'idle', callback: () => void): void;
    on(event: 'complete', callback: () => void): void;
    on(event: 'error', callback: () => void): void;
    on(event: 'warning', callback: () => void): void;
    on(event: 'autostartNotAllowed', callback: () => void): void;
    on(event: 'firstFrame', callback: () => void): void;
    on(event: 'playAttemptFailed', callback: () => void): void;
    on(event: 'playbackRateChanged', callback: () => void): void;
    on(event: 'seek', callback: () => void): void;
    on(event: 'seeked', callback: () => void): void;
    on(event: 'time', callback: () => void): void;
    on(event: 'absolutePositionReady', callback: () => void): void;
    on(event: 'mute', callback: () => void): void;
    on(event: 'volume', callback: () => void): void;
    on(event: 'fullscreen', callback: () => void): void;
    on(event: 'resize', callback: () => void): void;
    on(event: 'levels', callback: (data: ReturnType<NMPlayer['getQualityLevels']>) => void): void;
    on(event: 'levelsChanged', callback: (data: CurrentTrack) => void): void;
    on(event: 'levelsChanging', callback: (data: CurrentTrack) => void): void;
    on(event: 'visualQuality', callback: () => void): void;
    on(event: 'captionsList', callback: () => void): void;
    on(event: 'captionsChanged', callback: () => void): void;
    on(event: 'audioTracks', callback: (data: Track[]) => void): void;
    on(event: 'audioTrackChanged', callback: (data: CurrentTrack) => void): void;
    on(event: 'controls', callback: () => void): void;
    on(event: 'displayClick', callback: () => void): void;
    on(event: 'float', callback: () => void): void;
    on(event: 'containerViewable', callback: () => void): void;
    on(event: 'viewable', callback: () => void): void;
    on(event: 'adClick', callback: () => void): void;
    on(event: 'adCompanions', callback: () => void): void;
    on(event: 'adComplete', callback: () => void): void;
    on(event: 'adError', callback: () => void): void;
    on(event: 'adImpression', callback: () => void): void;
    on(event: 'adTime', callback: () => void): void;
    on(event: 'adSkipped', callback: () => void): void;
    on(event: 'beforePlay', callback: () => void): void;
    on(event: 'beforeComplete', callback: () => void): void;
    on(event: 'meta', callback: () => void): void;
    on(event: 'cast', callback: () => void): void;
    on(event: 'castIntercepted', callback: () => void): void;
    on(event: 'float', callback: () => void): void;
    on(event: 'float', callback: () => void): void;
    on(event: 'display-message', callback: (value: string) => void): void;
    on(event: string, callback: () => void): void;
    /**
     * Removes an event listener from the player.
     * @param event - The event to remove.
     * @param callback - The function to remove.
     */
    off(event: 'all', callback: () => void): void;
    off(event: 'ready', callback: () => void): void;
    off(event: 'setupError', callback: () => void): void;
    off(event: 'playlist', callback: () => void): void;
    off(event: 'item', callback: () => void): void;
    off(event: 'playlistComplete', callback: () => void): void;
    off(event: 'nextClick', callback: () => void): void;
    off(event: 'bufferChange', callback: () => void): void;
    off(event: 'play', callback: () => void): void;
    off(event: 'pause', callback: () => void): void;
    off(event: 'buffer', callback: () => void): void;
    off(event: 'idle', callback: () => void): void;
    off(event: 'complete', callback: () => void): void;
    off(event: 'error', callback: () => void): void;
    off(event: 'warning', callback: () => void): void;
    off(event: 'autostartNotAllowed', callback: () => void): void;
    off(event: 'firstFrame', callback: () => void): void;
    off(event: 'playAttemptFailed', callback: () => void): void;
    off(event: 'playbackRateChanged', callback: () => void): void;
    off(event: 'seek', callback: () => void): void;
    off(event: 'seeked', callback: () => void): void;
    off(event: 'time', callback: () => void): void;
    off(event: 'absolutePositionReady', callback: () => void): void;
    off(event: 'mute', callback: () => void): void;
    off(event: 'volume', callback: () => void): void;
    off(event: 'fullscreen', callback: () => void): void;
    off(event: 'resize', callback: () => void): void;
    off(event: 'levels', callback: () => void): void;
    off(event: 'levelsChanged', callback: () => void): void;
    off(event: 'levelsChanging', callback: () => void): void;
    off(event: 'visualQuality', callback: () => void): void;
    off(event: 'captionsList', callback: () => void): void;
    off(event: 'captionsChanged', callback: () => void): void;
    off(event: 'audioTracks', callback: () => void): void;
    off(event: 'audioTrackChanged', callback: () => void): void;
    off(event: 'controls', callback: () => void): void;
    off(event: 'displayClick', callback: () => void): void;
    off(event: 'float', callback: () => void): void;
    off(event: 'containerViewable', callback: () => void): void;
    off(event: 'viewable', callback: () => void): void;
    off(event: 'adClick', callback: () => void): void;
    off(event: 'adCompanions', callback: () => void): void;
    off(event: 'adComplete', callback: () => void): void;
    off(event: 'adError', callback: () => void): void;
    off(event: 'adImpression', callback: () => void): void;
    off(event: 'adTime', callback: () => void): void;
    off(event: 'adSkipped', callback: () => void): void;
    off(event: 'beforePlay', callback: () => void): void;
    off(event: 'beforeComplete', callback: () => void): void;
    off(event: 'meta', callback: () => void): void;
    off(event: 'cast', callback: () => void): void;
    off(event: 'castIntercepted', callback: () => void): void;
    off(event: 'float', callback: () => void): void;
    off(event: 'float', callback: () => void): void;
    off(event: 'display-message', callback: () => void): void;
    off(event: string, callback: () => void): void;
    /**
     * Adds an event listener to the player that will only be called once.
     * @param event - The event to listen for.
     * @param callback - The function to execute when the event occurs.
     */
    once(event: 'all', callback: () => void): void;
    once(event: 'hls', callback: () => void): void;
    once(event: 'ready', callback: () => void): void;
    once(event: 'setupError', callback: () => void): void;
    once(event: 'playlist', callback: () => void): void;
    once(event: 'item', callback: () => void): void;
    once(event: 'playlistComplete', callback: () => void): void;
    once(event: 'nextClick', callback: () => void): void;
    once(event: 'bufferChange', callback: () => void): void;
    once(event: 'play', callback: () => void): void;
    once(event: 'pause', callback: () => void): void;
    once(event: 'buffer', callback: () => void): void;
    once(event: 'idle', callback: () => void): void;
    once(event: 'complete', callback: () => void): void;
    once(event: 'error', callback: () => void): void;
    once(event: 'warning', callback: () => void): void;
    once(event: 'autostartNotAllowed', callback: () => void): void;
    once(event: 'firstFrame', callback: () => void): void;
    once(event: 'playAttemptFailed', callback: () => void): void;
    once(event: 'playbackRateChanged', callback: () => void): void;
    once(event: 'seek', callback: () => void): void;
    once(event: 'seeked', callback: () => void): void;
    once(event: 'time', callback: () => void): void;
    once(event: 'absolutePositionReady', callback: () => void): void;
    once(event: 'mute', callback: () => void): void;
    once(event: 'volume', callback: () => void): void;
    once(event: 'fullscreen', callback: () => void): void;
    once(event: 'resize', callback: () => void): void;
    once(event: 'levels', callback: (data: ReturnType<NMPlayer['getQualityLevels']>) => void): void;
    once(event: 'levelsChanged', callback: (data: CurrentTrack) => void): void;
    once(event: 'levelsChanging', callback: (data: CurrentTrack) => void): void;
    once(event: 'visualQuality', callback: () => void): void;
    once(event: 'captionsList', callback: () => void): void;
    once(event: 'captionsChanged', callback: () => void): void;
    once(event: 'audioTracks', callback: (data: Track[]) => void): void;
    once(event: 'audioTrackChanged', callback: (data: CurrentTrack) => void): void;
    once(event: 'controls', callback: () => void): void;
    once(event: 'displayClick', callback: () => void): void;
    once(event: 'float', callback: () => void): void;
    once(event: 'containerViewable', callback: () => void): void;
    once(event: 'viewable', callback: () => void): void;
    once(event: 'adClick', callback: () => void): void;
    once(event: 'adCompanions', callback: () => void): void;
    once(event: 'adComplete', callback: () => void): void;
    once(event: 'adError', callback: () => void): void;
    once(event: 'adImpression', callback: () => void): void;
    once(event: 'adTime', callback: () => void): void;
    once(event: 'adSkipped', callback: () => void): void;
    once(event: 'beforePlay', callback: () => void): void;
    once(event: 'beforeComplete', callback: () => void): void;
    once(event: 'meta', callback: () => void): void;
    once(event: 'cast', callback: () => void): void;
    once(event: 'castIntercepted', callback: () => void): void;
    once(event: 'float', callback: () => void): void;
    once(event: 'float', callback: () => void): void;
    once(event: 'display-message', callback: (value: string) => void): void;
    once(event: string, callback: () => void): void;
    /**
     * Sets the enabled state of various event hooks.
     * @param event - The event to enable/disable.
     * @param enabled - Whether the event should be enabled or disabled.
     */
    eventHooks(event: any, enabled: boolean): void;
}

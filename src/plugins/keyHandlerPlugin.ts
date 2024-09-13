import Plugin from '../Plugin';
import { NMPlayer } from '../index';

export class KeyHandlerPlugin extends Plugin {
	player: any;

	initialize(player: NMPlayer) {
		this.player = player;
		// Initialize the plugin with the player
	}

	use() {
		if (this.player.options.disableControls) return;

		document.removeEventListener('keyup', this.keyHandler.bind(this), false);
		document.addEventListener('keyup', this.keyHandler.bind(this), false);
	}

	/**
     * Handles keyboard events and executes the corresponding function based on the key binding.
     * @param {KeyboardEvent} event - The keyboard event to handle.
     */
	keyHandler(event: KeyboardEvent) {
		if (document.activeElement?.nodeName == 'INPUT' ) return;
		
		const keys = this.keyBindings();
		let keyTimeout = false;

		if (this.player.getElement().getBoundingClientRect().width == 0) return;

		if (!keyTimeout && this.player) {
			keyTimeout = true;

			if (keys.some(k => k.key === event.key && k.control === event.ctrlKey)) {
				event.preventDefault();
				keys.find(k => k.key === event.key && k.control === event.ctrlKey)?.function();
			} else {
				// alert(event.key);
			}
		}
		setTimeout(() => {
			keyTimeout = false;
		}, 300);
	}

	keyBindings() {
		return [
			{
				name: 'Play',
				key: 'MediaPlay',
				control: false,
				function: () => !this.player.options.disableMediaControls && this.player.play(),
			},
			{
				name: 'Pause',
				key: 'MediaPause',
				control: false,
				function: () => !this.player.options.disableMediaControls && this.player.pause(),
			},
			{
				name: 'Toggle playback',
				key: ' ',
				control: false,
				function: () => this.player.togglePlayback(),
			},
			{
				name: 'Toggle playback',
				key: 'MediaPlayPause',
				control: false,
				function: () => !this.player.options.disableMediaControls && this.player.togglePlayback(),
			},
			{
				name: 'Stop',
				key: 'MediaStop',
				control: false,
				function: () => !this.player.options.disableMediaControls && this.player.stop(),
			},
			{
				name: 'Rewind',
				key: 'ArrowLeft',
				control: false,
				function: () => !this.player.isTv() && this.player.rewindVideo(),
			},
			{
				name: 'Rewind',
				key: 'MediaRewind',
				control: false,
				function: () => !this.player.options.disableMediaControls && this.player.rewindVideo(),
			},
			{
				name: 'Fast forward',
				key: 'ArrowRight',
				control: false,
				function: () => !this.player.isTv() && this.player.forwardVideo(),
			},
			{
				name: 'Fast forward',
				key: 'MediaFastForward',
				control: false,
				function: () => !this.player.options.disableMediaControls && this.player.forwardVideo(),
			},
			{
				name: 'Previous item',
				key: 'MediaTrackPrevious',
				control: false,
				function: () => !this.player.options.disableMediaControls && this.player.previous(),
			},
			{
				name: 'Previous item',
				key: 'p',
				control: false,
				function: () => this.player.previous(),
			},
			{
				name: 'Next item',
				key: 'MediaTrackNext',
				control: false,
				function: () => !this.player.options.disableMediaControls && this.player.next(),
			},
			{
				name: 'Next item',
				key: 'n',
				control: false,
				function: () => this.player.next(),
			},
			{
				name: 'Cycle subtitle tracks',
				key: 'Subtitle',
				control: false,
				function: () => this.player.cycleSubtitles(),
			},
			{
				name: 'Cycle subtitle tracks',
				key: '5',
				control: false,
				function: () => this.player.cycleSubtitles(),
			},
			{
				name: 'Cycle subtitle tracks',
				key: 'v',
				control: false,
				function: () => this.player.cycleSubtitles(),
			},
			{
				name: 'Cycle audio tracks',
				key: 'Audio',
				control: false,
				function: () => this.player.cycleAudioTracks(),
			},
			{
				name: 'Cycle audio',
				key: 'b',
				control: false,
				function: () => this.player.cycleAudioTracks(),
			},
			{
				name: 'Forward 30 seconds',
				key: 'ColorF0Red',
				control: false,
				function: () => this.player.forwardVideo(30),
			},
			{
				name: 'Forward 60 seconds',
				key: 'ColorF1Green',
				control: false,
				function: () => this.player.forwardVideo(60),
			},
			{
				name: 'Forward 90 seconds',
				key: 'ColorF2Yellow',
				control: false,
				function: () => this.player.forwardVideo(90),
			},
			{
				name: 'Forward 120 seconds',
				key: 'ColorF3Blue',
				control: false,
				function: () => this.player.forwardVideo(120),
			},
			{
				name: 'Forward 30 seconds',
				key: '3',
				control: false,
				function: () => this.player.forwardVideo(30),
			},
			{
				name: 'Forward 60 seconds',
				key: '6',
				control: false,
				function: () => this.player.forwardVideo(60),
			},
			{
				name: 'Forward 90 seconds',
				key: '9',
				control: false,
				function: () => this.player.forwardVideo(90),
			},
			{
				name: 'Forward 120 seconds',
				key: '1',
				control: false,
				function: () => this.player.forwardVideo(120),
			},
			{
				name: 'Fullscreen',
				key: 'f',
				control: false,
				function: () => this.player.toggleFullscreen(),
			},
			{
				name: 'Volume up',
				key: 'ArrowUp',
				control: false,
				function: () => !this.player.isTv() && !this.player.isMobile() && this.player.volumeUp(),
			},
			{
				name: 'Volume down',
				key: 'ArrowDown',
				control: false,
				function: () => !this.player.isTv() && !this.player.isMobile() && this.player.volumeDown(),
			},
			{
				name: 'Mute',
				key: 'm',
				control: false,
				function: () => this.player.toggleMute(),
			},
			{
				name: 'Cycle aspect ratio',
				key: 'BrowserFavorites',
				control: false,
				function: () => this.player.cycleAspectRatio(),
			},
			{
				name: 'Show info',
				key: 'Info',
				control: false,
				function: () => {
					// player.showInfo();
				},
			},
		].map((control, i) => ({
			...control,
			id: i,
		}));
	}
}

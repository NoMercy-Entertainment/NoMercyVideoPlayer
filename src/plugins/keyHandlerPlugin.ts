import Plugin from '../plugin';
import { NMPlayer } from '../types';

export interface KeyHandlerPluginArgs {
}

export class KeyHandlerPlugin extends Plugin {
	player: NMPlayer<KeyHandlerPluginArgs> = <NMPlayer<KeyHandlerPluginArgs>>{};
	private boundKeyHandler: (event: KeyboardEvent) => void = () => { };

	initialize(player: NMPlayer<KeyHandlerPluginArgs>) {
		this.player = player;
		this.boundKeyHandler = this.keyHandler.bind(this);
	}

	use() {
		if (this.player.options.disableControls) return;
		document.addEventListener('keyup', this.boundKeyHandler, false);
	}

	dispose() {
		document.removeEventListener('keyup', this.boundKeyHandler);
	}

	/**
	 * Handles keyboard events and executes the corresponding function based on the key binding.
	 * @param {KeyboardEvent} event - The keyboard event to handle.
	 */
	keyHandler(event: KeyboardEvent) {
		if (document.activeElement?.nodeName == 'INPUT') return;

		const keys = this.keyBindings();
		let keyTimeout = false;

		if (this.player.getVideoElement().getBoundingClientRect().width == 0) return;

		if (!keyTimeout && this.player) {
			keyTimeout = true;

			const match = keys.find(k =>
				k.key === event.key
				&& k.control === event.ctrlKey
				&& k.shift === event.shiftKey
				&& k.alt === event.altKey,
			);

			if (match) {
				event.preventDefault();
				match.function();
			}
		}
		setTimeout(() => {
			keyTimeout = false;
		}, 300);
	}

	handleSeek(seconds: number) {
		if (seconds > 0) {
			this.player.forwardVideo(seconds);
		} else {
			this.player.rewindVideo(Math.abs(seconds));
		}
	}

	handleSpeedUp() {
		const speeds = this.player.getSpeeds();
		const current = this.player.getSpeed();
		const idx = speeds.indexOf(current);
		if (idx < speeds.length - 1) {
			const speed = speeds[idx + 1];
			this.player.setSpeed(speed);
			this.player.displayMessage(`${speed}x`);
		}
	}

	handleSpeedDown() {
		const speeds = this.player.getSpeeds();
		const current = this.player.getSpeed();
		const idx = speeds.indexOf(current);
		if (idx > 0) {
			const speed = speeds[idx - 1];
			this.player.setSpeed(speed);
			this.player.displayMessage(`${speed}x`);
		}
	}

	handleNormalSpeed() {
		this.player.setSpeed(1);
		this.player.displayMessage('1x');
	}

	handleFrameAdvance() {
		if (!this.player.isPlaying) {
			const current = this.player.getCurrentTime();
			this.player.seek(current + (1 / 30));
		}
	}

	handleShowTime() {
		const current = this.player.getCurrentTime();
		const duration = this.player.getDuration();
		const remaining = duration - current;

		const fmt = (s: number) => {
			const h = Math.floor(s / 3600);
			const m = Math.floor((s % 3600) / 60);
			const sec = Math.floor(s % 60);
			return h > 0
				? `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
				: `${m}:${String(sec).padStart(2, '0')}`;
		};

		this.player.displayMessage(`${fmt(current)} / -${fmt(remaining)}`);
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
				name: 'Stop',
				key: 's',
				control: false,
				function: () => this.player.stop(),
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
				name: 'Previous chapter',
				key: 'P',
				control: false,
				shift: true,
				alt: false,
				function: () => this.player.previousChapter(),
			},
			{
				name: 'Next chapter',
				key: 'N',
				control: false,
				shift: true,
				alt: false,
				function: () => this.player.nextChapter(),
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
				name: 'Cycle audio tracks',
				key: '2',
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
				name: 'Toggle fullscreen',
				key: 'F11',
				control: false,
				function: () => this.player.toggleFullscreen(),
			},
			{
				name: 'Exit fullscreen',
				key: 'Escape',
				control: false,
				function: () => {
					if (this.player.getFullscreen()) {
						this.player.setFullscreen(false);
					}
				},
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
				name: 'Cycle aspect ratio',
				key: 'a',
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

			// VLC-style speed controls
			{
				name: 'Speed up',
				key: ']',
				control: false,
				function: () => this.handleSpeedUp(),
			},
			{
				name: 'Speed down',
				key: '[',
				control: false,
				function: () => this.handleSpeedDown(),
			},
			{
				name: 'Normal speed',
				key: '=',
				control: false,
				function: () => this.handleNormalSpeed(),
			},

			// VLC-style modifier seeking
			{
				name: 'Seek back 3s',
				key: 'ArrowLeft',
				control: false,
				shift: true,
				alt: false,
				function: () => this.handleSeek(-3),
			},
			{
				name: 'Seek forward 3s',
				key: 'ArrowRight',
				control: false,
				shift: true,
				alt: false,
				function: () => this.handleSeek(3),
			},
			{
				name: 'Seek back 10s',
				key: 'ArrowLeft',
				control: false,
				shift: false,
				alt: true,
				function: () => this.handleSeek(-10),
			},
			{
				name: 'Seek forward 10s',
				key: 'ArrowRight',
				control: false,
				shift: false,
				alt: true,
				function: () => this.handleSeek(10),
			},
			{
				name: 'Seek back 1 min',
				key: 'ArrowLeft',
				control: true,
				shift: false,
				alt: false,
				function: () => this.handleSeek(-60),
			},
			{
				name: 'Seek forward 1 min',
				key: 'ArrowRight',
				control: true,
				shift: false,
				alt: false,
				function: () => this.handleSeek(60),
			},

			// Frame advance & time display
			{
				name: 'Next frame',
				key: 'e',
				control: false,
				function: () => this.handleFrameAdvance(),
			},
			{
				name: 'Show time',
				key: 't',
				control: false,
				function: () => this.handleShowTime(),
			},

			// Subtitle font size
			{
				name: 'Subtitle size up',
				key: '+',
				control: false,
				shift: true,
				alt: false,
				function: () => this.player.emit('subtitle-size-up'),
			},
			{
				name: 'Subtitle size up (numpad)',
				key: '+',
				control: false,
				function: () => this.player.emit('subtitle-size-up'),
			},
			{
				name: 'Subtitle size down',
				key: '-',
				control: false,
				function: () => this.player.emit('subtitle-size-down'),
			},
		].map((control, i) => ({
			shift: false,
			alt: false,
			...control,
			id: i,
		}));
	}
}

export default KeyHandlerPlugin;

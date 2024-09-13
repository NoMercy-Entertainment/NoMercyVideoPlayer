import Plugin from '../Plugin';
import type { Chapter, NMPlayer, PlaylistItem, Position, PreviewTime, VolumeState } from '../index.d';
import { buttons, Icon } from './UIPlugin/buttons';
import { humanTime } from '../helpers';
import * as styles from './UIPlugin/styles';
import { WebVTTParser } from 'webvtt-parser';

export class DesktopUIPlugin extends Plugin {
	player: NMPlayer = <NMPlayer>{};
	overlay: HTMLDivElement = <HTMLDivElement>{};

	topBar: HTMLDivElement = <HTMLDivElement>{};
	bottomRow: HTMLDivElement = <HTMLDivElement>{};
	frame: HTMLDivElement = <HTMLDivElement>{};

	chapters: any[] = [];

	timer: NodeJS.Timeout = <NodeJS.Timeout>{};
	isMouseDown = false;
	// progressBar: HTMLDivElement = <HTMLDivElement>{}; // sliderBar

	isScrubbing = false;
	menuOpen = false;
	mainMenuOpen = false;
	languageMenuOpen = false;
	subtitlesMenuOpen = false;
	qualityMenuOpen = false;
	speedMenuOpen = false;
	playlistMenuOpen = false;
	theaterModeEnabled = false;
	pipEnabled = false;

	// leftTap: NodeJS.Timeout = <NodeJS.Timeout>{};
	// rightTap: NodeJS.Timeout = <NodeJS.Timeout>{};
	// leeway = 300;
	// seekInterval = 10;

	previewTime: PreviewTime[] = [];

	sliderPopImage: HTMLDivElement = <HTMLDivElement>{};
	chapterBar: HTMLDivElement = <HTMLDivElement>{};
	bottomBar: HTMLDivElement = <HTMLDivElement>{};
	topRow: HTMLDivElement = <HTMLDivElement>{};
	nextUp: HTMLDivElement & {
        firstChild: HTMLButtonElement,
        lastChild: HTMLButtonElement
    } = <HTMLDivElement & {
        firstChild: HTMLButtonElement,
        lastChild: HTMLButtonElement
    }>{};

	currentTimeFile = '';
	buttons: Icon = <Icon>{};
	tooltip: HTMLDivElement = <HTMLDivElement>{};
	sliderBar: HTMLDivElement = <HTMLDivElement>{};

	currentScrubTime = 0;

	imageBaseUrl = '';

	timeout: NodeJS.Timeout = <NodeJS.Timeout>{};
	// episodeScrollContainer: HTMLDivElement = <HTMLDivElement>{};
	// selectedSeason: number | undefined;

	currentMenu: 'language'|'episode'|'pause'|'quality'|'seek'|null = null;
	thumbs: {
        time: PreviewTime,
        el: HTMLDivElement
    }[] = [];

	image = '';
	disablePauseScreen = false;
	disableOverlay = false;
	seekContainer: HTMLDivElement = <HTMLDivElement>{};
	shouldSlide = false;
	thumbnail: HTMLDivElement = <HTMLDivElement>{};
	// thumbnailWidth = 256;
	// thumbnailHeight = 144;
	controlsVisible: boolean = false;
	menuFrame: HTMLDialogElement = <HTMLDialogElement>{};
	mainMenu: HTMLDivElement = <HTMLDivElement>{};

	initialize(player: NMPlayer) {
		this.player = player;
		this.overlay = player.overlay;
		this.buttons = buttons();
		this.imageBaseUrl = player.options.basePath ? '' : 'https://image.tmdb.org/t/p/w185';
		// Initialize the plugin with the player
	}

	use() {

		this.topBar = this.createTopBar(this.overlay);
		// this.player.addClasses(topBar, [
		// 	'nm-px-2',
		// 	'nm-pt-4',
		// 	'nm-pl-6',
		// 	'nm-pr-8',
		// ]);

		this.createBackButton(this.topBar);
		this.createCloseButton(this.topBar);
		this.createDivider(this.topBar);

		const currentItem = this.createTvCurrentItem(this.topBar);
		this.player.addClasses(currentItem, [
			'nm-px-2',
			'nm-pt-2',
			'nm-z-0',
		]);

		if (!this.player.options.disableTouchControls) {
			this.createCenter(this.overlay);
		}

		this.bottomBar = this.createBottomBar(this.overlay);

		this.bottomBar.onmouseleave = (e) => {
			const playerRect = this.player.getVideoElement()?.getBoundingClientRect();
			if (!playerRect || (e.x > playerRect.left && e.x < playerRect.right && e.y > playerRect.top && e.y < playerRect.bottom)) return;
			this.player.emit('hide-tooltip');
		};

		this.topRow = this.createTopRow(this.bottomBar);

		this.player.addClasses(this.topRow, ['nm-mt-4']);

		this.bottomRow = this.createBottomRow(this.bottomBar);

		this.createProgressBar(this.topRow);

		this.createPlaybackButton(this.bottomRow);

		this.createPreviousButton(this.bottomRow);

		this.createSeekBackButton(this.bottomRow);

		this.createSeekForwardButton(this.bottomRow);

		this.createNextButton(this.bottomRow);

		this.createVolumeButton(this.bottomRow);

		this.createTime(this.bottomRow, 'current', ['nm-ml-2']);
		this.createDivider(this.bottomRow);
		this.createTime(this.bottomRow, 'remaining', ['nm-mr-2']);

		this.createTheaterButton(this.bottomRow);
		this.createPIPButton(this.bottomRow);

		this.createPlaylistsButton(this.bottomRow);

		this.createSpeedButton(this.bottomRow);
		this.createCaptionsButton(this.bottomRow);
		this.createAudioButton(this.bottomRow);
		this.createQualityButton(this.bottomRow);
		this.createSettingsButton(this.bottomRow);

		this.createFullscreenButton(this.bottomRow);

		this.frame = this.createMenuFrame(this.bottomRow);

		this.createMainMenu(this.frame);

		this.createToolTip(this.overlay);

		this.createEpisodeTip(this.overlay);

		this.createNextUp(this.overlay);

		this.modifySpinner(this.overlay);

		this.eventHandlers();

		this.player.plugins.desktopUIPlugin = {} as any;
		let obj = this;
		do {
			Object.getOwnPropertyNames(obj).forEach((key) => {
				const value = (this as any)[key];
				if (typeof value === 'function') {
					this.player.plugins.desktopUIPlugin[key] = value.bind(this);
				} else {
					this.player.plugins.desktopUIPlugin[key] = value;
				}
			});
		} while ((obj = Object.getPrototypeOf(obj)) !== null);
	}


	createBottomBar(parent: HTMLElement) {
		const bottomBar = this.player.createElement('div', 'bottom-bar')
			.addClasses(this.makeStyles('bottomBarStyles'))
			.appendTo(parent);

		this.player.createElement('div', 'bottom-bar-shadow')
			.addClasses(this.makeStyles('bottomBarShadowStyles'))
			.appendTo(bottomBar);

		return bottomBar;
	}

	createTopRow(parent: HTMLDivElement) {
		return this.player.createElement('div', 'top-row')
			.addClasses(this.makeStyles('topRowStyles'))
			.appendTo(parent);
	}

	createBottomRow(parent: HTMLDivElement) {
		return this.player.createElement('div', 'bottom-row')
			.addClasses(this.makeStyles('bottomRowStyles'))
			.appendTo(parent);
	}

	eventHandlers() {
		// this.player.on('volume', (data) => {
		// 	this.player.displayMessage(`${this.player.localize('Volume')}: ${Math.floor(data)}%`);
		// });
		// this.player.on('mute', (data) => {
		// 	if (data.mute) {
		// 		this.player.displayMessage(this.player.localize('Muted'));
		// 	} else {
		// 		this.player.displayMessage(`${this.player.localize('Volume')}: ${data.volume}%`);
		// 	}
		// });

		this.player.on('controls', (showing) => {
			if (this.player.getElement()) {
				if (showing) {
					this.player.getElement()?.setAttribute('active', 'true');
				} else {
					this.player.getElement()?.setAttribute('active', 'false');
				}
			}
		});

		this.player.on('chapters', () => {
			this.createChapterMarkers();
		});

		this.player.on('back-button-hyjack', () => {
			switch (this.currentMenu) {
			case 'episode':
			case 'language':
			case 'quality':
				this.player.emit('showPauseScreen');
				break;
			case 'seek':
			case 'pause':
				this.seekContainer.style.transform = '';
				this.player.play();
				break;
			default:
				if (this.player.hasBackEventHandler) {
					this.player.emit('back');
				} else {
					history.back();
				}
				break;
			}
		});

		window.addEventListener('resize', () => {
			this.sizeMenuFrame();
		});

		// let inactivityTimeout: NodeJS.Timeout = <NodeJS.Timeout>{};
		// ['touchstart', 'mousemove', 'touchmove', 'mousein'].forEach((event) => {
		// 	this.getElement()?.addEventListener(event, (e) => {
		// 		clearTimeout(inactivityTimeout);
		// 		inactivityTimeout = setTimeout(() => {
		// 			this.getElement().focus();
		// 		}, 50);
		// 	});
		// });
	}

	/**
     * Merges the default styles with the styles for a specific style name.
     * @param styleName - The name of the style to merge.
     * @param defaultStyles - The default styles to merge.
     * @returns An array containing the merged styles.
     */
	mergeStyles(styleName: string, defaultStyles: string[]) {
		const styles = this.player.options.styles?.[styleName] || [];
		return [...defaultStyles, ...styles];
	}

	/**
     * Returns a merged style object for the given style name.
     * @param name - The name of the style to merge.
     * @returns The merged style object.
     */
	makeStyles = (name: string) => {
		return this.mergeStyles(`${name}`, (styles as any)[name]);
	};

	createTopBar(parent: HTMLElement) {

		return this.player.createElement('div', 'top-bar')
			.addClasses(this.makeStyles('topBarStyles'))
			.appendTo(parent);
	}

	createCenter(parent: HTMLElement) {

		const center = this.player.createElement('div', 'center')
			.addClasses(this.makeStyles('centerStyles'))
			.appendTo(parent);

		// this.createOverlayCenterMessage(center);

		this.createSpinnerContainer(center);

		if (this.player.isMobile()) {
			this.createTouchSeekBack(center, { x: { start: 1, end: 1 }, y: { start: 2, end: 6 } });
			this.createTouchPlayback(center, { x: { start: 2, end: 2 }, y: { start: 3, end: 5 } });
			this.createTouchSeekForward(center, { x: { start: 3, end: 3 }, y: { start: 2, end: 6 } });
			this.createTouchVolUp(center, { x: { start: 2, end: 2 }, y: { start: 1, end: 3 } });
			this.createTouchVolDown(center, { x: { start: 2, end: 2 }, y: { start: 5, end: 7 } });
		} else {
			this.createTouchSeekBack(center, { x: { start: 1, end: 2 }, y: { start: 2, end: 6 } });
			this.createTouchPlayback(center, { x: { start: 2, end: 3 }, y: { start: 2, end: 6 } });
			this.createTouchSeekForward(center, { x: { start: 3, end: 4 }, y: { start: 2, end: 6 } });
		}

		return center;

	}

	createTouchSeekBack(parent: HTMLElement, currentTime: Position) {
		// if (!this.isMobile()) return;
		const touchSeekBack = this.createTouchBox(parent, 'touchSeekBack', currentTime);
		['click'].forEach((event) => {
			touchSeekBack.addEventListener(event, this.doubleTap(() => {
				this.player.rewindVideo();
			}));
		});

		this.createSeekRipple(touchSeekBack, 'left');

		return touchSeekBack;

	}

	/**
     * Attaches a double tap event listener to the element.
     * @param callback - The function to execute when a double tap event occurs.
     * @param callback2 - An optional function to execute when a second double tap event occurs.
     * @returns A function that detects double tap events.
     */
	doubleTap(callback: (event: Event) => void, callback2?: (event2: Event) => void) {
		const delay = this.player.options.doubleClickDelay ?? 500;
		let lastTap = 0;
		let timeout: NodeJS.Timeout;
		let timeout2: NodeJS.Timeout;
		return function detectDoubleTap(event: Event, event2?: Event) {
			const curTime = new Date().getTime();
			const tapLen = curTime - lastTap;
			if (tapLen > 0 && tapLen < delay) {
				event.preventDefault();
				callback(event);
				clearTimeout(timeout2);
			} else {
				timeout = setTimeout(() => {
					clearTimeout(timeout);
				}, delay);
				timeout2 = setTimeout(() => {
					callback2?.(event2!);
				}, delay);
			}
			lastTap = curTime;
		};
	}


	createTouchSeekForward(parent: HTMLElement, currentTime: Position) {
		// if (!this.isMobile()) return;
		const touchSeekForward = this.createTouchBox(parent, 'touchSeekForward', currentTime);
		['mouseup', 'touchend'].forEach((event) => {
			touchSeekForward.addEventListener(event, this.doubleTap(() => {
				this.player.forwardVideo();
			}));
		});

		this.createSeekRipple(touchSeekForward, 'right');

		return touchSeekForward;
	}

	createTouchPlayback(parent: HTMLElement, currentTime: Position, hovered = false) {
		const touchPlayback = this.createTouchBox(parent, 'touchPlayback', currentTime);
		this.player.addClasses(touchPlayback, this.makeStyles('touchPlaybackStyles'));

		['click'].forEach((event) => {
			touchPlayback.addEventListener(event, this.doubleTap(
				() => this.player.getFullscreen(),
				() => {
					(this.controlsVisible || !this.player.options.disableTouchControls) && this.player.togglePlayback();
				}
			));
		});

		if (this.player.isMobile()) {
			const playButton = this.createSVGElement(touchPlayback, 'bigPlay', this.buttons.bigPlay, hovered);
			this.player.addClasses(playButton, this.makeStyles('touchPlaybackButtonStyles'));

			this.player.on('pause', () => {
				playButton.style.display = 'flex';
			});
			this.player.on('play', () => {
				playButton.style.display = 'none';
			});
		}

		return touchPlayback;
	}

	createTouchVolUp(parent: HTMLElement, currentTime: Position) {
		if (!this.player.isMobile()) return;
		const touchVolUp = this.createTouchBox(parent, 'touchVolUp', currentTime);
		['click'].forEach((event) => {
			touchVolUp.addEventListener(event, this.doubleTap(() => {
				this.player.volumeUp();
			}));
		});

		return touchVolUp;
	}

	createTouchVolDown(parent: HTMLElement, currentTime: Position) {
		if (!this.player.isMobile()) return;
		const touchVolDown = this.createTouchBox(parent, 'touchVolDown', currentTime);
		['click'].forEach((event) => {
			touchVolDown.addEventListener(event, this.doubleTap(() => {
				this.player.volumeDown();
			}));
		});

		return touchVolDown;
	}

	createTouchBox(parent: HTMLElement, id: string, currentTime: Position) {
		const touch = this.player.createElement('div', `touch-box-${id}`)
			.addClasses([`touch-box-${id}`, 'nm-z-40'])
			.appendTo(parent);

		touch.style.gridColumnStart = currentTime.x.start.toString();
		touch.style.gridColumnEnd = currentTime.x.end.toString();
		touch.style.gridRowStart = currentTime.y.start.toString();
		touch.style.gridRowEnd = currentTime.y.end.toString();

		parent.appendChild(touch);

		return touch;

	}

	createDivider(parent: HTMLElement, content?: any) {
		const divider = this.player.createElement('div', 'divider')
			.addClasses(this.makeStyles('dividerStyles'))
			.appendTo(parent);

		if (content) {
			divider.innerHTML = content;
		} else {
			this.player.addClasses(divider, this.makeStyles('dividerStyles'));
		}

		return divider;
	}

	createSVGElement(parent: HTMLElement, id: string, icon: Icon['path'], hidden = false, hovered = false) {

		const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		svg.setAttribute('viewBox', '0 0 24 24');

		svg.id = id;
		this.player.addClasses(svg, [
			`${id}-icon`,
			...icon.classes,
			...this.makeStyles('svgSizeStyles'),
			...this.makeStyles('iconStyles'),
			hidden ? 'nm-hidden' : 'nm-flex',
		]);

		const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		path.setAttribute('d', hovered ? icon.hover : icon.normal);
		this.player.addClasses(path, [
			'group-hover/button:nm-hidden',
			'group-hover/volume:nm-hidden',
		]);
		svg.appendChild(path);

		const path2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		path2.setAttribute('d', hovered ? icon.normal : icon.hover);
		this.player.addClasses(path2, [
			'nm-hidden',
			'group-hover/button:nm-flex',
			'group-hover/volume:nm-flex',
		]);
		svg.appendChild(path2);

		if (!parent.classList.contains('menu-button')) {
			parent.addEventListener('mouseenter', () => {
				if (icon.title.length == 0 || (['Next', 'Previous'].includes(icon.title) && this.player.hasNextTip)) return;

				if (icon.title == 'Fullscreen' && this.player.getFullscreen()) {
					return;
				} if (icon.title == 'Exit fullscreen' && !this.player.getFullscreen()) {
					return;
				} if (icon.title == 'Play' && this.player.isPlaying) {
					return;
				} if (icon.title == 'Pause' && !this.player.isPlaying) {
					return;
				} if (icon.title == 'Mute' && this.player.isMuted()) {
					return;
				} if (icon.title == 'Unmute' && !this.player.isMuted()) {
					return;
				}

				const text = `${this.player.localize(icon.title)} ${this.getButtonKeyCode(id)}`;

				const playerRect = this.player.getElement().getBoundingClientRect();
				const menuTipRect = parent.getBoundingClientRect();

				let x = Math.abs(playerRect.left - (menuTipRect.left + (menuTipRect.width * 0.5)) - (text.length * 0.5));
				const y = Math.abs(playerRect.bottom - (menuTipRect.bottom + (menuTipRect.height * 1.2)));

				if (x < 35) {
					x = 35;
				}

				if (x > (playerRect.right - playerRect.left) - 75) {
					x = (playerRect.right - playerRect.left) - 75;
				}

				this.player.emit('show-tooltip', {
					text: text,
					currentTime: 'bottom',
					x: `${x}px`,
					y: `-${y}px`,
				});

			});

			parent.addEventListener('mouseleave', () => {
				this.player.emit('hide-tooltip');
			});
		}

		parent.appendChild(svg);
		return svg;

	}

	createUiButton(parent: HTMLElement, icon: string) {

		const button = this.player.createElement('button', icon)
			.addClasses(this.makeStyles('buttonStyles'))
			.appendTo(parent);

		button.ariaLabel = this.buttons[icon]?.title;

		button.addEventListener('keydown', (event) => {
			console.log(event);
			if (event.key === 'Backspace') {
				button.blur();
			}
		});

		return button;
	}

	createSettingsButton(parent: HTMLDivElement, hovered = false) {
		if (!this.player.hasSpeeds() && !this.player.hasAudioTracks() && !this.player.hasCaptions()) return;

		const settingsButton = this.createUiButton(
			parent,
			'settings'
		);

		this.createSVGElement(settingsButton, 'settings', this.buttons.settings, hovered);

		settingsButton.addEventListener('click', () => {
			this.player.emit('hide-tooltip');
			if (this.menuOpen && this.mainMenuOpen) {
				this.player.emit('show-menu', false);
			} else if (!this.menuOpen && this.mainMenuOpen) {
				this.player.emit('show-menu', true);
			} else if (this.menuOpen && !this.mainMenuOpen) {
				this.player.emit('show-main-menu', true);
				this.player.emit('show-menu', true);
			} else {
				this.player.emit('show-main-menu', true);
				this.player.emit('show-menu', true);
			}
		});

		this.player.on('pip-internal', (data) => {
			if (data) {
				settingsButton.style.display = 'none';
			} else {
				settingsButton.style.display = 'flex';
			}
		});

		parent.append(settingsButton);
		return settingsButton;
	}

	createBackButton(parent: HTMLDivElement, hovered = false) {
		if (!this.player.hasBackEventHandler) return;

		const backButton = this.createUiButton(
			parent,
			'back'
		);
		parent.appendChild(backButton);

		this.createSVGElement(backButton, 'back', this.buttons.back, false, hovered);

		backButton.addEventListener('click', () => {
			this.player.emit('hide-tooltip');
			this.player.emit('back');
		});

		this.player.on('pip-internal', (data) => {
			if (data) {
				backButton.style.display = 'none';
			} else {
				backButton.style.display = 'flex';
			}
		});

		return backButton;
	}

	createCloseButton(parent: HTMLDivElement, hovered = false) {
		if (!this.player.hasCloseEventHandler) return;

		const closeButton = this.createUiButton(
			parent,
			'close'
		);
		parent.appendChild(closeButton);

		this.createSVGElement(closeButton, 'close', this.buttons.close, false, hovered);

		closeButton.addEventListener('click', () => {
			this.player.emit('hide-tooltip');
			this.player.emit('close');
		});

		this.player.on('pip-internal', (data) => {
			if (data) {
				closeButton.style.display = 'none';
			} else {
				closeButton.style.display = 'flex';
			}
		});

		return closeButton;
	}

	createPlaybackButton(parent: HTMLElement, hovered = false) {
		const playbackButton = this.createUiButton(
			parent,
			'playback'
		);
		parent.appendChild(playbackButton);

		playbackButton.ariaLabel = this.buttons.play?.title;

		const pausedButton = this.createSVGElement(playbackButton, 'paused', this.buttons.play, false, hovered);
		const playButton = this.createSVGElement(playbackButton, 'playing', this.buttons.pause, true, hovered);

		playbackButton.addEventListener('click', (event) => {
			event.stopPropagation();
			this.player.togglePlayback();
			this.player.emit('hide-tooltip');
		});
		this.player.on('pause', () => {
			playButton.style.display = 'none';
			pausedButton.style.display = 'flex';
		});
		this.player.on('play', () => {
			pausedButton.style.display = 'none';
			playButton.style.display = 'flex';
		});
		this.player.on('item', () => {
			playButton.focus();
		});

		return playbackButton;
	}

	createSeekBackButton(parent: HTMLDivElement, hovered = false) {
		if (this.player.isMobile()) return;
		const seekBack = this.createUiButton(
			parent,
			'seekBack'
		);

		this.createSVGElement(seekBack, 'seekBack', this.buttons.seekBack, hovered);

		seekBack.addEventListener('click', () => {
			this.player.emit('hide-tooltip');
			this.player.rewindVideo();
		});

		this.player.on('pip-internal', (data) => {
			if (data) {
				seekBack.style.display = 'none';
			} else {
				seekBack.style.display = 'flex';
			}
		});

		parent.append(seekBack);
		return seekBack;
	}

	createSeekForwardButton(parent: HTMLDivElement, hovered = false) {
		if (this.player.isMobile()) return;
		const seekForward = this.createUiButton(
			parent,
			'seekForward'
		);

		this.createSVGElement(seekForward, 'seekForward', this.buttons.seekForward, hovered);

		seekForward.addEventListener('click', () => {
			this.player.emit('hide-tooltip');
			this.player.forwardVideo();
		});

		this.player.on('pip-internal', (data) => {
			if (data) {
				seekForward.style.display = 'none';
			} else {
				seekForward.style.display = 'flex';
			}
		});

		parent.append(seekForward);
		return seekForward;
	}

	createTime(parent: HTMLDivElement, type: 'current' | 'remaining' | 'duration', classes: string[]) {
		const time = this.player.createElement('div', `${type}-time`)
			.addClasses([
				...classes,
				...this.makeStyles('timeStyles'),
				`${type}-time`,
			])
			.appendTo(parent);

		time.textContent = '00:00';

		switch (type) {
		case 'current':

			this.player.on('time', (data) => {
				time.textContent = humanTime(data.currentTime);
			});

			this.player.on('currentScrubTime', (data) => {
				time.textContent = humanTime(data.currentTime);
			});
			break;

		case 'remaining':

			this.player.on('duration', (data) => {
				if (data.remaining === Infinity) {
					time.textContent = 'Live';
				} else {
					time.textContent = humanTime(data.remaining);
				}
			});

			this.player.on('time', (data) => {
				if (data.remaining === Infinity) {
					time.textContent = 'Live';
				} else {
					time.textContent = humanTime(data.remaining);
				}
			});

			break;

		case 'duration':
			this.player.on('duration', (data) => {
				if (data.duration === Infinity) {
					time.textContent = 'Live';
				} else {
					time.textContent = humanTime(data.duration);
				}
			});
			break;

		default:
			break;
		}

		this.player.on('pip-internal', (data) => {
			if (data) {
				time.style.display = 'none';
			} else {
				time.style.display = '';
			}
		});

		return time;
	}

	createVolumeButton(parent: HTMLDivElement, hovered = false) {
		if (this.player.isMobile()) return;

		const volumeContainer = this.player.createElement('div', 'volume-container')
			.addClasses(this.makeStyles('volumeContainerStyles'))
			.appendTo(parent);

		const volumeButton = this.createUiButton(
			volumeContainer,
			'volume'
		);
		volumeButton.ariaLabel = this.buttons.volumeHigh?.title;

		const volumeSlider = this.player.createElement('input', 'volume-slider')
			.addClasses(this.makeStyles('volumeSliderStyles'))
			.appendTo(volumeContainer);

		volumeSlider.type = 'range';
		volumeSlider.min = '0';
		volumeSlider.max = '100';
		volumeSlider.step = '1';
		volumeSlider.value = this.player.getVolume().toString();
		volumeSlider.style.backgroundSize = `${this.player.getVolume()}% 100%`;

		const mutedButton = this.createSVGElement(volumeButton, 'volumeMuted', this.buttons.volumeMuted, true, hovered);
		const lowButton = this.createSVGElement(volumeButton, 'volumeLow', this.buttons.volumeLow, true, hovered);
		const mediumButton = this.createSVGElement(volumeButton, 'volumeMedium', this.buttons.volumeMedium, true, hovered);
		const highButton = this.createSVGElement(volumeButton, 'volumeHigh', this.buttons.volumeHigh, hovered);

		volumeButton.addEventListener('click', (event) => {
			event.stopPropagation();
			this.player.toggleMute();
			this.player.emit('hide-tooltip');
		});

		volumeSlider.addEventListener('input', (event) => {
			event.stopPropagation();
			const newVolume = Math.floor(parseInt(volumeSlider.value, 10));
			volumeSlider.style.backgroundSize = `${newVolume}% 100%`;
			this.player.setVolume(newVolume);
		});

		volumeContainer.addEventListener('wheel', (event) => {
			event.preventDefault();
			const delta = (event.deltaY === 0) ? -event.deltaX : -event.deltaY;
			if (delta === 0) {
				return;
			}

			volumeSlider.style.backgroundSize = `${volumeSlider.value}% 100%`;
			volumeSlider.value = (parseFloat(volumeSlider.value) + (delta * 0.50)).toString();
			this.player.setVolume(parseFloat(volumeSlider.value));
		}, {
			passive: true,
		});

		this.player.on('volume', (data) => {
			this.volumeHandle(data, mutedButton, lowButton, mediumButton, highButton);
			volumeSlider.style.backgroundSize = `${data.volume}% 100%`;
		});

		this.player.on('mute', (data) => {
			this.volumeHandle(data, mutedButton, lowButton, mediumButton, highButton);
			if (data.mute) {
				volumeSlider.style.backgroundSize = `${0}% 100%`;
			} else {
				volumeSlider.style.backgroundSize = `${this.player.getVolume()}% 100%`;
			}
		});

		return volumeContainer;
	}

	volumeHandle(
		data: VolumeState,
		mutedButton: SVGSVGElement,
		lowButton: SVGSVGElement,
		mediumButton: SVGSVGElement,
		highButton: SVGSVGElement
	) {
		if (this.player.getMute() || data.volume == 0) {
			lowButton.style.display = 'none';
			mediumButton.style.display = 'none';
			highButton.style.display = 'none';
			mutedButton.style.display = 'flex';
		} else if (data.volume <= 30) {
			mediumButton.style.display = 'none';
			highButton.style.display = 'none';
			mutedButton.style.display = 'none';
			lowButton.style.display = 'flex';
		} else if (data.volume <= 60) {
			lowButton.style.display = 'none';
			highButton.style.display = 'none';
			mutedButton.style.display = 'none';
			mediumButton.style.display = 'flex';
		} else {
			lowButton.style.display = 'none';
			mediumButton.style.display = 'none';
			mutedButton.style.display = 'none';
			highButton.style.display = 'flex';
		}
	}

	isLastSibbling(element: HTMLElement) {
		return !element.nextElementSibling;
	}

	createTvOverlay(parent: HTMLElement) {

		const tvOverlay = this.player.createElement('div', 'tv-overlay')
			.addClasses(this.makeStyles('tvOverlayStyles'))
			.appendTo(parent);

		const background = this.player.createElement('div', 'background')
			.addClasses(this.makeStyles('backgroundStyles'))
			.appendTo(tvOverlay);


		const topBar = this.player.createTopBar(tvOverlay);
		this.player.addClasses(topBar, [
			'nm-px-10',
			'nm-pt-10',
			'nm-z-0',
		]);

		const backButton = this.createBackButton(topBar, true);
		if (backButton) {
			this.player.addClasses(backButton, ['children:nm-stroke-2']);
		}
		const restartButton = this.createRestartButton(topBar, true);
		this.player.addClasses(restartButton, ['children:nm-stroke-2']);
		const nextButton = this.createNextButton(topBar, true);
		this.player.addClasses(nextButton, ['children:nm-stroke-2']);
		this.createDivider(topBar);
		this.createTvCurrentItem(topBar);

		this.createOverlayCenterMessage(tvOverlay);

		this.seekContainer = this.createSeekContainer(tvOverlay);

		const bottomBar = this.createBottomBar(tvOverlay);
		const bottomRow = this.player.createElement('div', 'seek-container')
			.addClasses(this.makeStyles('tvBottomRowStyles'))
			.appendTo(bottomBar);

		const playbackButton = this.createPlaybackButton(bottomRow, true);

		this.createTime(bottomRow, 'current', []);
		this.createTvProgressBar(bottomRow);
		this.createTime(bottomRow, 'remaining', ['nm-mr-14']);

		this.createNextUp(tvOverlay);

		this.player.on('show-seek-container', (value) => {
			if (value) {
				background.style.opacity = '1';
			} else {
				background.style.opacity = '0';
			}
		});

		this.player.on('controls', (value) => {
			if (value && this.currentMenu !== 'seek' && !this.controlsVisible) {
				playbackButton.focus();
			}
		});

		this.player.on('pause', () => {
			background.style.opacity = '1';
		});

		this.player.on('play', () => {

			background.style.opacity = '0';

			this.hideSeekMenu();
		});


		let activeButton = backButton ?? restartButton ?? nextButton;

		[backButton, restartButton, nextButton].forEach((button) => {
			button?.addEventListener('keydown', (e) => {
				if (e.key == 'ArrowDown') {
					if (this.nextUp.style.display == 'none') {
						playbackButton?.focus();
					} else {
						this.nextUp.lastChild?.focus();
					}
				} else if (e.key == 'ArrowLeft') {
					activeButton = ((e.target as HTMLButtonElement).previousElementSibling as HTMLButtonElement);
					activeButton?.focus();
				} else if (e.key == 'ArrowRight') {
					e.preventDefault();
					activeButton = ((e.target as HTMLButtonElement).nextElementSibling as HTMLButtonElement);
					activeButton?.focus();
				}
			});
		});

		[this.nextUp.firstChild, this.nextUp.lastChild].forEach((button) => {
			button?.addEventListener('keydown', (e: KeyboardEvent) => {
				if (e.key == 'ArrowUp') {
					(activeButton || restartButton)?.focus();
				} else if (e.key == 'ArrowDown') {
					playbackButton.focus();
				} else if (e.key == 'ArrowLeft') {
					this.nextUp.firstChild?.focus();
				} else if (e.key == 'ArrowRight') {
					this.nextUp.lastChild?.focus();
				}
			});
		});

		[playbackButton].forEach((button) => {
			button?.addEventListener('keydown', (e) => {
				if (e.key == 'ArrowUp') {
					e.preventDefault();
					if (this.nextUp.style.display == 'none') {
						activeButton?.focus();
					} else {
						this.nextUp.lastChild?.focus();
					}
				}
			});
		});

		[this.player.getVideoElement(), tvOverlay].forEach((button) => {
			(button as unknown as HTMLButtonElement)?.addEventListener('keydown', (e: KeyboardEvent) => {
				if (e.key == 'ArrowLeft') {
					// eslint-disable-next-line max-len
					if ([backButton, restartButton, nextButton, this.nextUp.firstChild, this.nextUp.lastChild].includes(e.target as HTMLButtonElement)) {
						return;
					}
					e.preventDefault();

					this.showSeekMenu();

					if (this.shouldSlide) {
						this.currentScrubTime = this.getClosestSeekableInterval();
						this.shouldSlide = false;
					} else {
						const newScrubbTime = this.currentScrubTime - 10;

						this.player.emit('currentScrubTime', {
							...this.player.videoPlayer_getTimeData(),
							currentTime: newScrubbTime,
						});
					};

				} else if (e.key == 'ArrowRight') {
					// eslint-disable-next-line max-len
					if ([backButton, restartButton, nextButton, this.nextUp.firstChild, this.nextUp.lastChild].includes(e.target as HTMLButtonElement)) {
						return;
					}
					e.preventDefault();

					this.showSeekMenu();

					if (this.shouldSlide) {
						this.currentScrubTime = this.getClosestSeekableInterval();
						this.shouldSlide = false;
					} else {
						const newScrubbTime = this.currentScrubTime + 10;
						this.player.emit('currentScrubTime', {
							...this.player.videoPlayer_getTimeData(),
							currentTime: newScrubbTime,
						});
					};
				}
			});
		});


		[this.player.getVideoElement(), playbackButton, backButton, restartButton, nextButton].forEach((button) => {
			(button as unknown as HTMLButtonElement)?.addEventListener('keydown', (e: KeyboardEvent) => {
				if (e.key == 'ArrowUp') {
					this.disablePauseScreen = false;
					this.hideSeekMenu();
				} else if (e.key == 'ArrowDown') {
					this.disablePauseScreen = false;
					this.hideSeekMenu();
				} else if (e.key == 'Enter') {
					this.player.seek(this.currentScrubTime);
					this.player.play();
				}
			});
		});

		playbackButton.focus();

		return bottomBar;
	}

	getClosestSeekableInterval() {
		const scrubTime = this.player.currentTime();
		const intervals = this.previewTime;
		const interval = intervals.find((interval) => {
			return scrubTime >= interval.start && scrubTime < interval.end;
		})!;
		return interval?.start;
	}

	showSeekMenu() {
		this.currentMenu = 'seek';
		this.disablePauseScreen = true;

		this.player.emit('show-seek-container', true);
	}

	hideSeekMenu() {
		this.currentMenu = null;
		this.disablePauseScreen = false;

		this.disableOverlay = false;
		this.currentMenu = null;
		this.disablePauseScreen = false;
		this.shouldSlide = true;

		this.player.emit('show-seek-container', false);
	}

	createSeekContainer(parent: HTMLElement) {

		const seekContainer = this.player.createElement('div', 'seek-container')
			.addClasses(this.makeStyles('seekContainerStyles'))
			.appendTo(parent);

		const seekScrollCloneContainer = this.player.createElement('div', 'seek-scroll-clone-container')
			.addClasses(this.makeStyles('seekScrollCloneStyles'))
			.appendTo(seekContainer);

		// for (let index = 0; index <= 4; index += 1) {
		this.player.createElement('div', `thumbnail-clone-${1}`)
			.addClasses(this.makeStyles('thumbnailCloneStyles'))
			.appendTo(seekScrollCloneContainer);
		// }

		const seekScrollContainer = this.player.createElement('div', 'seek-scroll-container')
			.addClasses(this.makeStyles('seekScrollContainerStyles'))
			.appendTo(seekContainer);

		this.player.once('item', () => {
			this.player.on('preview-time', () => {
				this.thumbs = [];
				for (const time of this.previewTime) {
					this.thumbs.push({
						time,
						el: this.createThumbnail(time),
					});
				}

				seekScrollContainer.innerHTML = '';
				this.unique(this.thumbs.map(t => t.el), 'id').forEach((thumb) => {
					seekScrollContainer.appendChild(thumb);
				});

				this.player.once('time', () => {
					this.currentScrubTime = this.getClosestSeekableInterval();
					this.player.emit('currentScrubTime', {
						...this.player.videoPlayer_getTimeData(),
						currentTime: this.getClosestSeekableInterval(),
					});
				});
			});
		});

		this.player.on('lastTimeTrigger', () => {
			this.currentScrubTime = this.getClosestSeekableInterval();
			this.player.emit('currentScrubTime', {
				...this.player.videoPlayer_getTimeData(),
				currentTime: this.getClosestSeekableInterval(),
			});
		});

		this.player.on('currentScrubTime', (data) => {
			if (data.currentTime <= 0) {
				data.currentTime = 0;
			} else if (data.currentTime >= this.player.getDuration()) {
				data.currentTime = this.player.getDuration() - 10;
			}

			const thumb = this.thumbs.find((thumb) => {
				return data.currentTime >= thumb.time.start && data.currentTime <= thumb.time.end;
			});

			this.currentScrubTime = data.currentTime;

			if (!thumb) return;


			this.#scrollIntoView(thumb.el);

			const thumbIndex = this.thumbs.findIndex(e => e.el == thumb.el);

			if (!thumbIndex) return;

			const max = 3;

			const minThumbIndex = thumbIndex - max;
			const maxThumbIndex = thumbIndex + max;

			for (const [index, key] of this.thumbs.entries()) {
				if (index > minThumbIndex && index < maxThumbIndex) {
					key.el.style.opacity = '1';
				} else {
					key.el.style.opacity = '0';
				}
			}

		});

		this.player.on('show-seek-container', (value) => {
			if (value) {
				seekContainer.style.transform = 'none';

				this.player.pause();
			} else {
				this.seekContainer.style.transform = '';
			}
		});

		return seekContainer;
	}

	#scrollIntoView(element: HTMLElement) {

		const scrollDuration = 200;
		const parentElement = element.parentElement as HTMLElement;
		const elementLeft = element.getBoundingClientRect().left + (element.offsetWidth / 2) - (parentElement.offsetWidth / 2);
		const startingX = parentElement.scrollLeft;
		const startTime = performance.now();

		function scrollStep(timestamp: number) {
			const currentTime = timestamp - startTime;
			const progress = Math.min(currentTime / scrollDuration, 1);

			parentElement.scrollTo(startingX + elementLeft * progress, 0);

			if (currentTime < scrollDuration) {
				requestAnimationFrame(scrollStep);
			}
		}
		requestAnimationFrame(scrollStep);
	}


	createTvCurrentItem(parent: HTMLElement) {

		const currentItemContainer = this.player.createElement('div', 'current-item-container')
			.addClasses(this.makeStyles('tvCurrentItemContainerStyles'))
			.appendTo(parent);

		const currentItemShow = this.player.createElement('div', 'current-item-show')
			.addClasses(this.makeStyles('tvCurrentItemShowStyles'))
			.appendTo(currentItemContainer);

		const currentItemTitleContainer = this.player.createElement('div', 'current-item-title-container')
			.addClasses(this.makeStyles('tvCurrentItemTitleContainerStyles'))
			.appendTo(currentItemContainer);

		const currentItemEpisode = this.player.createElement('div', 'current-item-episode')
			.addClasses(this.makeStyles('tvCurrentItemEpisodeStyles'))
			.appendTo(currentItemTitleContainer);

		const currentItemTitle = this.player.createElement('div', 'current-item-title')
			.addClasses(this.makeStyles('tvCurrentItemTitleStyles'))
			.appendTo(currentItemTitleContainer);

		this.player.on('item', () => {
			const item = this.player.playlistItem();
			currentItemShow.innerHTML = this.breakLogoTitle(item.show);
			currentItemEpisode.innerHTML = '';
			if (item.season) {
				currentItemEpisode.innerHTML += `${this.player.localize('S')}${item.season}`;
			}
			if (item.season && item.episode) {
				currentItemEpisode.innerHTML += `: ${this.player.localize('E')}${item.episode}`;
			}
			currentItemTitle.innerHTML = item.title.replace(item.show, '').length > 0 ? `"${item.title.replace(item.show, '').replace('%S', this.player.localize('S'))
				.replace('%E', this.player.localize('E'))}"` : '';
		});

		return currentItemContainer;

	}

	createPreviousButton(parent: HTMLDivElement, hovered = false) {
		if (this.player.isMobile()) return;

		const previousButton = this.createUiButton(
			parent,
			'previous'
		);
		previousButton.style.display = 'none';

		this.createSVGElement(previousButton, 'previous', this.buttons.previous, hovered);

		previousButton.addEventListener('click', (event) => {
			event.stopPropagation();
			this.player.previous();
			this.player.emit('hide-tooltip');
		});
		this.player.on('item', () => {
			if (this.player.getPlaylistIndex() > 0) {
				previousButton.style.display = 'flex';
			} else {
				previousButton.style.display = 'none';
			}
		});

		this.player.on('pip-internal', (data) => {
			if (data) {
				previousButton.style.display = 'none';
			} else if (this.player.playlistItem().episode ?? -0 - 1 == 0) {
				previousButton.style.display = 'flex';
			}
		});

		previousButton.addEventListener('mouseenter', () => {

			const playerRect = previousButton.getBoundingClientRect();
			const previousTipRect = parent.getBoundingClientRect();

			let x = Math.abs((previousTipRect.left - playerRect.left) + 50);
			const y = Math.abs((previousTipRect.bottom - playerRect.bottom) - 60);

			if (x < 30) {
				x = 30;
			}

			if (x > (playerRect.right - playerRect.left) - 10) {
				x = (playerRect.right - playerRect.left) - 10;
			}

			this.player.emit('show-episode-tip', {
				direction: 'previous',
				currentTime: 'bottom',
				x: `${x}px`,
				y: `-${y}px`,
			});

		});

		previousButton.addEventListener('mouseleave', () => {
			this.player.emit('hide-episode-tip');
		});

		parent.appendChild(previousButton);
		return previousButton;
	}

	createNextButton(parent: HTMLDivElement, hovered = false) {
		const nextButton = this.createUiButton(
			parent,
			'next'
		);

		nextButton.style.display = 'none';
		this.player.hasNextTip = true;

		this.createSVGElement(nextButton, 'next', this.buttons.next, false, hovered);

		nextButton.addEventListener('click', (event) => {
			event.stopPropagation();
			this.player.next();
			this.player.emit('hide-tooltip');
		});

		this.player.on('item', () => {
			if (this.player.isLastPlaylistItem()) {
				nextButton.style.display = 'none';
			} else {
				nextButton.style.display = 'flex';
			}
		});

		this.player.on('pip-internal', (data) => {
			if (data) {
				nextButton.style.display = 'none';
			} else if (this.player.isLastPlaylistItem()) {
				nextButton.style.display = 'flex';
			}
		});

		nextButton.addEventListener('mouseenter', () => {

			const playerRect = nextButton.getBoundingClientRect();
			const nextTipRect = parent.getBoundingClientRect();

			let x = Math.abs((nextTipRect.left - playerRect.left) + 50);
			const y = Math.abs((nextTipRect.bottom - playerRect.bottom) - 60);

			if (x < 30) {
				x = 30;
			}

			if (x > (playerRect.right - playerRect.left) - 10) {
				x = (playerRect.right - playerRect.left) - 10;
			}

			this.player.emit('show-episode-tip', {
				direction: 'next',
				currentTime: 'bottom',
				x: `${x}px`,
				y: `-${y}px`,
			});

		});

		nextButton.addEventListener('mouseleave', () => {
			this.player.emit('hide-episode-tip');
		});

		parent.appendChild(nextButton);
		return nextButton;
	}

	createRestartButton(parent: HTMLDivElement, hovered = false) {

		const restartButton = this.createUiButton(
			parent,
			'restart'
		);
		parent.appendChild(restartButton);

		this.createSVGElement(restartButton, 'restart', this.buttons.restart, false, hovered);

		restartButton.addEventListener('click', (event) => {
			event.stopPropagation();
			this.player.restart();
		});

		return restartButton;
	}

	createCaptionsButton(parent: HTMLElement, hovered = false) {
		const captionButton = this.createUiButton(
			parent,
			'subtitles'
		);
		captionButton.style.display = 'none';
		captionButton.ariaLabel = this.buttons.subtitles?.title;

		const offButton = this.createSVGElement(captionButton, 'subtitle', this.buttons.subtitlesOff, hovered);
		const onButton = this.createSVGElement(captionButton, 'subtitled', this.buttons.subtitles, true, hovered);

		captionButton.addEventListener('click', (event) => {
			event.stopPropagation();
			this.player.emit('hide-tooltip');

			if (this.subtitlesMenuOpen) {
				this.player.emit('show-menu', false);

				this.menuFrame.close();
			} else {
				this.player.emit('show-subtitles-menu', true);

				this.menuFrame.showModal();
			}
		});

		this.player.on('captionsList', (tracks) => {
			if (tracks.length > 0) {
				captionButton.style.display = 'flex';
			} else {
				captionButton.style.display = 'none';
			}
		});

		this.player.on('captionsChanging', (data) => {
			if (data.id == -1) {
				onButton.style.display = 'none';
				offButton.style.display = 'flex';
			} else {
				onButton.style.display = 'flex';
				offButton.style.display = 'none';
			}
		});

		this.player.on('pip-internal', (data) => {
			if (data) {
				captionButton.style.display = 'none';
			} else if (this.player.hasCaptions()) {
				captionButton.style.display = 'flex';
			}
		});

		parent.appendChild(captionButton);
		return captionButton;
	}

	createAudioButton(parent: HTMLElement, hovered = false) {
		const audioButton = this.createUiButton(
			parent,
			'audio'
		);
		audioButton.style.display = 'none';
		audioButton.ariaLabel = this.buttons.language?.title;

		this.createSVGElement(audioButton, 'audio', this.buttons.languageOff, hovered);

		audioButton.addEventListener('click', (event) => {
			event.stopPropagation();
			this.player.emit('hide-tooltip');

			if (this.languageMenuOpen) {
				this.player.emit('show-menu', false);

				this.menuFrame.close();
			} else {
				this.player.emit('show-language-menu', true);

				this.menuFrame.showModal();
			}
		});

		this.player.on('item', () => {
			audioButton.style.display = 'none';
		});
		this.player.on('audioTracks', (tracks) => {
			if (tracks.length > 1) {
				audioButton.style.display = 'flex';
			} else {
				audioButton.style.display = 'none';
			}
		});

		this.player.on('pip-internal', (data) => {
			if (data) {
				audioButton.style.display = 'none';
			} else if (this.player.hasAudioTracks()) {
				audioButton.style.display = 'flex';
			}
		});

		parent.appendChild(audioButton);
		return audioButton;
	}

	createQualityButton(parent: HTMLElement, hovered = false) {
		const qualityButton = this.createUiButton(
			parent,
			'quality'
		);
		qualityButton.style.display = 'none';

		const offButton = this.createSVGElement(qualityButton, 'low', this.buttons.quality, hovered);
		const onButton = this.createSVGElement(qualityButton, 'high', this.buttons.quality, true, hovered);

		qualityButton.addEventListener('click', (event) => {
			event.stopPropagation();
			this.player.emit('hide-tooltip');

			if (this.qualityMenuOpen) {
				this.player.emit('show-menu', false);

				this.menuFrame.close();
			} else {
				this.player.emit('show-quality-menu', true);

				this.menuFrame.showModal();
			}

			if (this.player.highQuality) {
				this.player.highQuality = false;
				onButton.style.display = 'none';
				offButton.style.display = 'flex';
			} else {
				this.player.highQuality = true;
				offButton.style.display = 'none';
				onButton.style.display = 'flex';
			}

			// this.player.toggleLanguage();
		});

		this.player.on('item', () => {
			qualityButton.style.display = 'none';
		});
		this.player.on('levels', () => {
			if (this.player.hasQualities()) {
				qualityButton.style.display = 'flex';
			} else {
				qualityButton.style.display = 'none';
			}
		});

		this.player.on('pip-internal', (data) => {
			if (data) {
				qualityButton.style.display = 'none';
			} else if (this.player.hasQualities()) {
				qualityButton.style.display = 'flex';
			}
		});

		parent.appendChild(qualityButton);
		return qualityButton;
	}

	createTheaterButton(parent: HTMLDivElement, hovered = false) {
		if (this.player.isMobile() || !this.player.hasTheaterEventHandler) return;

		const theaterButton = this.createUiButton(
			parent,
			'theater'
		);

		this.createSVGElement(theaterButton, 'theater', this.buttons.theater, hovered);
		this.createSVGElement(theaterButton, 'theater-enabled', this.buttons.theaterExit, true, hovered);

		theaterButton.addEventListener('click', (event) => {
			event.stopPropagation();
			this.player.emit('hide-tooltip');

			if (this.theaterModeEnabled) {
				this.theaterModeEnabled = false;
				theaterButton.querySelector<any>('.theater-enabled-icon').style.display = 'none';
				theaterButton.querySelector<any>('.theater-icon').style.display = 'flex';
				this.player.emit('theaterMode', false);
				this.player.emit('resize');
			} else {
				this.theaterModeEnabled = true;
				theaterButton.querySelector<any>('.theater-icon').style.display = 'none';
				theaterButton.querySelector<any>('.theater-enabled-icon').style.display = 'flex';
				this.player.emit('theaterMode', true);
				this.player.emit('resize');
			}

			// this.player.toggleLanguage();
		});

		this.player.on('fullscreen', () => {
			if (this.player.getFullscreen()) {
				theaterButton.style.display = 'none';
			} else {
				theaterButton.style.display = 'flex';
			}
		});
		this.player.on('pip-internal', (data) => {
			if (data) {
				theaterButton.style.display = 'none';
			} else {
				theaterButton.style.display = 'flex';
			}
		});

		parent.appendChild(theaterButton);
		return theaterButton;
	}

	createFullscreenButton(parent: HTMLElement, hovered = false) {
		const fullscreenButton = this.createUiButton(
			parent,
			'fullscreen'
		);

		this.createSVGElement(fullscreenButton, 'fullscreen-enabled', this.buttons.exitFullscreen, true, hovered);
		this.createSVGElement(fullscreenButton, 'fullscreen', this.buttons.fullscreen, hovered);

		fullscreenButton.addEventListener('click', (event) => {
			event.stopPropagation();
			this.player.toggleFullscreen();
			this.player.emit('hide-tooltip');
		});
		this.player.on('fullscreen', (enabled) => {
			if (enabled) {
				fullscreenButton.querySelector<any>('.fullscreen-icon').style.display = 'none';
				fullscreenButton.querySelector<any>('.fullscreen-enabled-icon').style.display = 'flex';
			} else {
				fullscreenButton.querySelector<any>('.fullscreen-enabled-icon').style.display = 'none';
				fullscreenButton.querySelector<any>('.fullscreen-icon').style.display = 'flex';
			}
		});

		this.player.on('pip-internal', (enabled) => {
			if (enabled) {
				fullscreenButton.style.display = 'none';
			} else {
				fullscreenButton.style.display = 'flex';
			}
		});

		parent.appendChild(fullscreenButton);
		return fullscreenButton;

	}

	createPlaylistsButton(parent: HTMLDivElement, hovered = false) {
		const playlistButton = this.createUiButton(
			parent,
			'playlist'
		);

		playlistButton.style.display = 'none';

		this.createSVGElement(playlistButton, 'playlist', this.buttons.playlist, hovered);

		playlistButton.addEventListener('click', (event) => {
			event.stopPropagation();
			this.player.emit('hide-tooltip');

			if (this.playlistMenuOpen) {
				this.player.emit('show-menu', false);

				this.menuFrame.close();
			} else {
				this.player.emit('show-playlist-menu', true);
				this.player.emit('switch-season', this.player.playlistItem().season);

				this.menuFrame.showModal();

				setTimeout(() => {
					document.querySelector(`playlist-${this.player.playlistItem().id}`)
						?.scrollIntoView({ block: 'center' });
				}, 100);
			}
		});

		this.player.on('item', () => {
			if (this.player.hasPlaylists()) {
				playlistButton.style.display = 'flex';
			} else {
				playlistButton.style.display = 'none';
			}
		});

		this.player.on('pip-internal', (data) => {
			if (data) {
				playlistButton.style.display = 'none';
			} else if (this.player.hasPlaylists()) {
				playlistButton.style.display = 'flex';
			}
		});

		parent.appendChild(playlistButton);
		return playlistButton;
	}

	createSpeedButton(parent: HTMLDivElement, hovered = false) {
		if (this.player.isMobile()) return;
		const speedButton = this.createUiButton(
			parent,
			'speed'
		);

		if (this.player.hasSpeeds()) {
			speedButton.style.display = 'flex';
		} else {
			speedButton.style.display = 'none';
		}

		this.createSVGElement(speedButton, 'speed', this.buttons.speed, hovered);

		speedButton.addEventListener('click', (event) => {
			event.stopPropagation();
			this.player.emit('hide-tooltip');

			if (this.speedMenuOpen) {
				this.player.emit('show-menu', false);

				this.menuFrame.close();
			} else {
				this.player.emit('show-speed-menu', true);

				this.menuFrame.showModal();
			}
		});

		this.player.on('pip-internal', (data) => {
			if (data) {
				speedButton.style.display = 'none';
			} else if (this.player.hasSpeeds()) {
				speedButton.style.display = 'flex';
			}
		});

		parent.appendChild(speedButton);
		return speedButton;
	}

	createPIPButton(parent: HTMLDivElement, hovered = false) {
		if (this.player.isMobile() || !this.player.hasPipEventHandler) return;
		const pipButton = this.createUiButton(
			parent,
			'pip'
		);

		if (this.player.hasPIP()) {
			pipButton.style.display = 'flex';
		} else {
			pipButton.style.display = 'none';
		}

		pipButton.ariaLabel = this.buttons.pipEnter?.title;

		this.createSVGElement(pipButton, 'pip-enter', this.buttons.pipEnter, hovered);
		this.createSVGElement(pipButton, 'pip-exit', this.buttons.pipExit, true, hovered);

		document.addEventListener('visibilitychange', () => {
			if (this.pipEnabled) {
				if (document.hidden) {
					if (document.pictureInPictureEnabled) {
						this.player.getVideoElement().requestPictureInPicture();
					}
				} else if (document.pictureInPictureElement) {
					document.exitPictureInPicture();
				}
			}
		});

		pipButton.addEventListener('click', (event) => {
			event.stopPropagation();
			this.player.emit('hide-tooltip');

			this.player.emit('controls', false);

			if (this.pipEnabled) {
				this.pipEnabled = false;
				pipButton.querySelector<any>('.pip-exit-icon').style.display = 'none';
				pipButton.querySelector<any>('.pip-enter-icon').style.display = 'flex';
				pipButton.ariaLabel = this.buttons.pipEnter?.title;
				this.player.emit('pip-internal', false);
				this.player.emit('pip', false);
			} else {
				this.pipEnabled = true;
				pipButton.querySelector<any>('.pip-enter-icon').style.display = 'none';
				pipButton.querySelector<any>('.pip-exit-icon').style.display = 'flex';
				pipButton.ariaLabel = this.buttons.pipExit?.title;
				this.player.emit('pip-internal', true);
				this.player.emit('pip', true);
				this.player.emit('show-menu', false);
			}
		});

		this.player.on('fullscreen', () => {
			if (this.player.getFullscreen()) {
				pipButton.style.display = 'none';
			} else {
				pipButton.style.display = 'flex';
			}
		});

		parent.appendChild(pipButton);
		return pipButton;
	}

	createMenuFrame(parent: HTMLDivElement) {

		this.menuFrame = this.player.createElement('dialog', 'menu-frame-dialog')
			.appendTo(parent);

		this.menuFrame.setAttribute('popover', 'manual');
		this.menuFrame.setAttribute('role', 'modal');

		const menuFrame = this.player.createElement('div', 'menu-frame')
			.addClasses(this.makeStyles('menuFrameStyles'))
			.appendTo(this.menuFrame);

		this.sizeMenuFrame();

		const menuContent = this.player.createElement('div', 'menu-content')
			.addClasses(this.makeStyles('menuContentStyles'))
			.appendTo(menuFrame);

		// menuContent.style.maxHeight = `${this.player.getElement().getBoundingClientRect().height - 80}px`;

		this.player.on('resize', () => {
			// this.createCalcMenu(menuContent);
			this.sizeMenuFrame();
		});
		this.player.on('fullscreen', () => {
			// this.createCalcMenu(menuContent);
			this.sizeMenuFrame();
		});

		this.player.on('show-menu', (showing) => {
			this.menuOpen = showing;
			this.player.lockActive = showing;
			if (showing) {

				this.sizeMenuFrame();

				menuFrame.style.display = 'flex';
				menuFrame.classList.add('open');

				this.menuFrame.showModal();
			} else {
				menuFrame.style.display = 'none';
				menuFrame.classList.remove('open');

				this.menuFrame.close();
			}
			menuContent.classList.add('nm-translate-x-0');
			menuContent.classList.remove('-nm-translate-x-[50%]');
			menuContent.classList.remove('sub-menu-open');

			setTimeout(() => {
				([...this.mainMenu.children].find(el =>
					(el as HTMLButtonElement).style.display != 'none' && el.id != 'menu-header') as HTMLButtonElement).focus();
			}, 200);

			this.player.emit('show-language-menu', false);
			this.player.emit('show-subtitles-menu', false);
			this.player.emit('show-quality-menu', false);
			this.player.emit('show-speed-menu', false);
			this.player.emit('show-playlist-menu', false);
		});
		this.player.on('show-main-menu', (showing) => {
			this.mainMenuOpen = showing;
			this.player.lockActive = showing;
			if (showing) {
				menuFrame.classList.add('open');
				this.player.emit('show-language-menu', false);
				this.player.emit('show-subtitles-menu', false);
				this.player.emit('show-quality-menu', false);
				this.player.emit('show-speed-menu', false);
				this.player.emit('show-playlist-menu', false);
				menuContent.classList.add('nm-translate-x-0');
				menuContent.classList.remove('-nm-translate-x-[50%]');
				menuContent.classList.remove('sub-menu-open');
				menuFrame.style.display = 'flex';

				setTimeout(() => {
					([...this.mainMenu.children].find(el =>
						(el as HTMLButtonElement).style.display != 'none' && el.id != 'menu-header') as HTMLButtonElement).focus();
				}, 200);
			}
		});
		this.player.on('show-language-menu', (showing) => {
			this.languageMenuOpen = showing;
			this.player.lockActive = showing;
			if (showing) {
				menuFrame.classList.add('open');
				this.player.emit('show-main-menu', false);
				this.player.emit('show-subtitles-menu', false);
				this.player.emit('show-quality-menu', false);
				this.player.emit('show-speed-menu', false);
				this.player.emit('show-playlist-menu', false);
				menuContent.classList.remove('nm-translate-x-0');
				menuContent.classList.add('-nm-translate-x-[50%]');
				menuContent.classList.add('sub-menu-open');
				menuFrame.style.display = 'flex';
			}
		});
		this.player.on('show-subtitles-menu', (showing) => {
			this.subtitlesMenuOpen = showing;
			this.player.lockActive = showing;
			if (showing) {
				menuFrame.classList.add('open');
				this.player.emit('show-main-menu', false);
				this.player.emit('show-language-menu', false);
				this.player.emit('show-quality-menu', false);
				this.player.emit('show-speed-menu', false);
				this.player.emit('show-playlist-menu', false);
				menuContent.classList.remove('nm-translate-x-0');
				menuContent.classList.add('-nm-translate-x-[50%]');
				menuContent.classList.add('sub-menu-open');
				menuFrame.style.display = 'flex';
			}
		});
		this.player.on('show-quality-menu', (showing) => {
			this.qualityMenuOpen = showing;
			this.player.lockActive = showing;
			if (showing) {
				menuFrame.classList.add('open');
				this.player.emit('show-main-menu', false);
				this.player.emit('show-language-menu', false);
				this.player.emit('show-subtitles-menu', false);
				this.player.emit('show-speed-menu', false);
				this.player.emit('show-playlist-menu', false);
				menuContent.classList.remove('nm-translate-x-0');
				menuContent.classList.add('-nm-translate-x-[50%]');
				menuContent.classList.add('sub-menu-open');
				menuFrame.style.display = 'flex';
			}
		});
		this.player.on('show-speed-menu', (showing) => {
			this.speedMenuOpen = showing;
			this.player.lockActive = showing;
			if (showing) {
				menuFrame.classList.add('open');
				this.player.emit('show-main-menu', false);
				this.player.emit('show-language-menu', false);
				this.player.emit('show-subtitles-menu', false);
				this.player.emit('show-quality-menu', false);
				this.player.emit('show-playlist-menu', false);
				menuContent.classList.remove('nm-translate-x-0');
				menuContent.classList.add('-nm-translate-x-[50%]');
				menuContent.classList.add('sub-menu-open');
				menuFrame.style.display = 'flex';
			}
		});
		this.player.on('show-playlist-menu', (showing) => {
			// this.createCalcMenu(menuContent);
			this.playlistMenuOpen = showing;
			this.player.lockActive = showing;
			if (showing) {
				menuFrame.classList.add('open');
				this.player.emit('show-main-menu', false);
				this.player.emit('show-language-menu', false);
				this.player.emit('show-subtitles-menu', false);
				this.player.emit('show-quality-menu', false);
				this.player.emit('show-speed-menu', false);
				menuContent.classList.remove('nm-translate-x-0');
				menuContent.classList.add('-nm-translate-x-[50%]');
				menuContent.classList.add('sub-menu-open');
				menuFrame.style.display = 'flex';
				// menuFrame.style.width = '96%';
			} else {
				menuFrame.style.width = '';
			}
		});
		this.player.on('controls', (showing) => {
			this.player.lockActive = showing;
			if (!showing) {
				this.player.emit('show-menu', false);
				this.player.emit('show-main-menu', false);
				this.player.emit('show-language-menu', false);
				this.player.emit('show-subtitles-menu', false);
				this.player.emit('show-quality-menu', false);
				this.player.emit('show-speed-menu', false);
				this.player.emit('show-playlist-menu', false);
			}
		});

		return menuContent;
	}

	sizeMenuFrame() {
		const {
			// width,
			height,
			top,
			bottom,
			left,
		} = this.player.getElement().getBoundingClientRect();

		// (this.menuFrame.firstChild as HTMLDivElement).style.width = `calc(${width}px - 4rem)`;
		(this.menuFrame.firstChild as HTMLDivElement).style.width = 'auto';
		(this.menuFrame.firstChild as HTMLDivElement).style.height = `calc(${height}px - 4rem)`;
		(this.menuFrame.firstChild as HTMLDivElement).style.top = `${top}px`;
		(this.menuFrame.firstChild as HTMLDivElement).style.bottom = `${bottom}px`;
		(this.menuFrame.firstChild as HTMLDivElement).style.left = `calc(${left}px + 2rem)`;
		(this.menuFrame.firstChild as HTMLDivElement).style.margin = '2rem';
		(this.menuFrame.firstChild as HTMLDivElement).style.marginLeft = 'auto';
	}

	createMainMenu(parent: HTMLDivElement) {

		this.mainMenu = this.player.createElement('div', 'main-menu')
			.addClasses(this.makeStyles('mainMenuStyles'))
			.appendTo(parent);

		this.mainMenu.style.transform = 'translateX(0)';

		const mainHeader = this.createMainMenuHeader(this.mainMenu, '');
		mainHeader.classList.add('!nm-min-h-[2rem]', '-nm-mr-1');

		this.player.addClasses(this.mainMenu, this.makeStyles('mainMenuStyles'));

		this.createMenuButton(this.mainMenu, 'language');
		this.createMenuButton(this.mainMenu, 'subtitles');
		this.createMenuButton(this.mainMenu, 'quality');
		this.createMenuButton(this.mainMenu, 'speed');
		this.createMenuButton(this.mainMenu, 'playlist');

		this.createSubMenu(parent);

		return this.mainMenu;
	}

	createSubMenu(parent: HTMLDivElement) {

		const submenu = this.player.createElement('div', 'sub-menu')
			.addClasses(this.makeStyles('subMenuStyles'))
			.appendTo(parent);

		submenu.style.transform = 'translateX(0)';

		this.createLanguageMenu(submenu);
		this.createSubtitleMenu(submenu);
		this.createQualityMenu(submenu);
		this.createSpeedMenu(submenu);

		this.player.once('playlist', () => {
			this.createEpisodeMenu(submenu);
		});

		return submenu;
	}

	createMainMenuHeader(parent: HTMLDivElement, title: string, hovered = false) {
		const menuHeader = this.player.createElement('div', 'menu-header')
			.addClasses(this.makeStyles('menuHeaderStyles'))
			.addClasses(['nm-border-b', 'nm-border-gray-300/20', '!nm-p-0'])
			.appendTo(parent);

		const close = this.createUiButton(
			menuHeader,
			'close'
		);

		this.createSVGElement(close, 'menu', this.buttons.close, hovered);
		this.player.addClasses(close, ['nm-ml-auto', 'nm-w-8']);
		close.classList.remove('nm-w-5');

		close.addEventListener('click', (event) => {
			event.stopPropagation();
			this.player.emit('show-menu', false);
			this.player.lockActive = false;
			this.player.emit('controls', false);

			this.menuFrame.close();
		});

		return menuHeader;
	}

	createMenuHeader(parent: HTMLDivElement, title: string, hovered = false) {
		const menuHeader = this.player.createElement('div', 'menu-header')
			.addClasses(this.makeStyles('menuHeaderStyles'))
			.addClasses(['nm-border-b', 'nm-border-gray-300/20'])
			.appendTo(parent);

		if (title !== 'Episodes') {
			const back = this.createUiButton(
				menuHeader,
				'back'
			);
			this.createSVGElement(back, 'menu', this.buttons.chevronL, hovered);
			this.player.addClasses(back, ['nm-w-8']);
			back.classList.remove('nm-w-5');

			back.addEventListener('click', (event) => {
				event.stopPropagation();
				this.player.emit('show-main-menu', true);

				this.player.emit('show-language-menu', false);
				this.player.emit('show-subtitles-menu', false);
				this.player.emit('show-quality-menu', false);
				this.player.emit('show-speed-menu', false);
				this.player.emit('show-playlist-menu', false);
			});
		}

		const menuButtonText = this.player.createElement('span', 'menu-button-text')
			.addClasses(this.makeStyles('menuHeaderButtonTextStyles'))
			.appendTo(menuHeader);

		menuButtonText.textContent = this.player.localize(title).toTitleCase();

		// if (title == 'playlist') {
		// 	this.player.createDropdown(menuHeader, title, `${this.player.localize('Season')} ${this.player.playlistItem().season}`);
		// }

		if (title !== 'Seasons') {
			const close = this.createUiButton(
				menuHeader,
				'close'
			);

			this.createSVGElement(close, 'menu', this.buttons.close, hovered);
			this.player.addClasses(close, ['nm-ml-auto', 'nm-w-8']);
			close.classList.remove('nm-w-5');

			close.addEventListener('click', (event) => {
				event.stopPropagation();
				this.player.emit('show-menu', false);
				this.player.lockActive = false;
				this.player.emit('controls', false);

				this.menuFrame.close();
			});
		}

		return menuHeader;
	}

	createMenuButton(parent: HTMLDivElement, item: string, hovered = false) {
		const menuButton = this.player.createElement('button', `menu-button-${item}`)
			.addClasses(this.makeStyles('languageButtonStyles'))
			.appendTo(parent);

		if (item !== 'speed') {
			menuButton.style.display = 'none';
		} else if (this.player.hasSpeeds()) {
			menuButton.style.display = 'flex';
		} else {
			menuButton.style.display = 'none';
		}

		this.createSVGElement(menuButton, 'menu', this.buttons[item], hovered);

		const menuButtonText = this.player.createElement('span', `menu-button-${item}`)
			.addClasses(this.makeStyles('menuButtonTextStyles'))
			.appendTo(menuButton);

		menuButtonText.textContent = this.player.localize(item).toTitleCase();

		const chevron = this.createSVGElement(menuButton, 'menu', this.buttons.chevronR, hovered);
		this.player.addClasses(chevron, ['nm-ml-auto']);

		menuButton.addEventListener('click', (event) => {
			event.stopPropagation();
			this.player.emit(`show-${item}-menu`, true);
		});

		if (item === 'language') {
			this.player.on('item', () => {
				menuButton.style.display = 'none';
			});
			this.player.on('audioTracks', (tracks) => {
				if (tracks.length > 1) {
					menuButton.style.display = 'flex';
				} else {
					menuButton.style.display = 'none';
				}
			});
		} else if (item === 'subtitles') {
			this.player.on('item', () => {
				menuButton.style.display = 'none';
			});
			this.player.on('captionsList', (captions) => {
				if (captions.length > 0) {
					menuButton.style.display = 'flex';
				} else {
					menuButton.style.display = 'none';
				}
			});
		} else if (item === 'quality') {
			this.player.on('item', () => {
				menuButton.style.display = 'none';
			});
			this.player.on('levels', (levels) => {
				if (levels.length > 1) {
					menuButton.style.display = 'flex';
				} else {
					menuButton.style.display = 'none';
				}
			});
		} else if (item === 'playlist') {
			this.player.on('playlist', (playlist) => {
				if (playlist.length > 1) {
					menuButton.style.display = 'flex';
				} else {
					menuButton.style.display = 'none';
				}
			});
		}
	};

	createLanguageMenu(parent: HTMLDivElement) {
		const languageMenu = this.player.createElement('div', 'language-menu')
			.addClasses(this.makeStyles('subMenuContentStyles'))
			.appendTo(parent);

		this.createMenuHeader(languageMenu, 'Language');

		const scrollContainer = this.player.createElement('div', 'language-scroll-container')
			.addClasses(this.makeStyles('scrollContainerStyles'))
			.appendTo(languageMenu);

		scrollContainer.style.transform = 'translateX(0)';

		this.player.on('item', () => {
			scrollContainer.innerHTML = '';
		});

		this.player.on('audioTracks', (tracks) => {
			scrollContainer.innerHTML = '';

			Object.values(tracks).forEach((track) => {
				this.createLanguageMenuButton(scrollContainer, {
					language: track.language,
					label: track.label,
					type: 'audio',
					id: track.id,
					buttonType: 'language',
				});
			});
		});

		this.player.on('show-language-menu', (showing) => {
			if (showing) {
				languageMenu.style.display = 'flex';
			} else {
				languageMenu.style.display = 'none';
			}
		});

		return languageMenu;
	}

	createSubtitleMenu(parent: HTMLDivElement) {
		const subtitleMenu = this.player.createElement('div', 'subtitle-menu')
			.addClasses(this.makeStyles('subMenuContentStyles'))
			.appendTo(parent);

		this.createMenuHeader(subtitleMenu, 'subtitles');

		const scrollContainer = this.player.createElement('div', 'subtitle-scroll-container')
			.addClasses(this.makeStyles('scrollContainerStyles'))
			.appendTo(subtitleMenu);

		scrollContainer.style.transform = 'translateX(0)';

		this.player.on('item', () => {
			scrollContainer.innerHTML = '';
		});

		this.player.on('captionsList', (tracks) => {
			scrollContainer.innerHTML = '';

			Object.values(tracks).forEach((track) => {
				this.createLanguageMenuButton(scrollContainer, {
					language: track.language,
					label: track.label,
					type: track.type,
					id: track.id,
					buttonType: 'subtitle',
				});
			});
		});

		this.player.on('show-subtitles-menu', (showing) => {
			if (showing) {
				subtitleMenu.style.display = 'flex';
			} else {
				subtitleMenu.style.display = 'none';
			}
		});

		return subtitleMenu;
	}

	createSpeedMenu(parent: HTMLDivElement, hovered = false) {
		const speedMenu = this.player.createElement('div', 'speed-menu')
			.addClasses(this.makeStyles('subMenuContentStyles'))
			.appendTo(parent);

		this.createMenuHeader(speedMenu, 'speed');

		const scrollContainer = this.player.createElement('div', 'speed-scroll-container')
			.addClasses(this.makeStyles('scrollContainerStyles'))
			.appendTo(speedMenu);

		scrollContainer.style.transform = 'translateX(0)';

		for (const speed of this.player.getSpeeds() ?? []) {
			const speedButton = this.player.createElement('button', `speed-button-${speed}`)
				.addClasses(this.makeStyles('languageButtonStyles'))
				.appendTo(scrollContainer);

			const speedButtonSpan = this.player.createElement('span', `menu-button-text-${speed}`)
				.appendTo(speedButton);

			const speedButtonText = this.player.createElement('span', `menu-button-text-${speed}`)
				.addClasses(this.makeStyles('speedButtonTextStyles'))
				.appendTo(speedButtonSpan);

			speedButtonText.textContent = speed == 1 ? this.player.localize('Normal') : speed.toString();

			const chevron = this.createSVGElement(speedButton, 'menu', this.buttons.checkmark, hovered);
			this.player.addClasses(chevron, [
				'nm-ml-auto',
				'nm-hidden',
			]);

			this.player.on('speed', (event) => {
				if (event === speed) {
					chevron.classList.remove('nm-hidden');
				} else {
					chevron.classList.add('nm-hidden');
				}
			});

			speedButton.addEventListener('click', () => {
				this.player.emit('show-menu', false);
				this.player.setSpeed(speed);
			});
		}

		this.player.on('show-speed-menu', (showing) => {
			if (showing) {
				speedMenu.style.display = 'flex';

				setTimeout(() => {
					(scrollContainer.firstChild as HTMLButtonElement).focus();
				}, 200);
			} else {
				speedMenu.style.display = 'none';
			}
		});

		return speedMenu;
	}

	createQualityMenu(parent: HTMLDivElement) {
		const qualityMenu = this.player.createElement('div', 'quality-menu')
			.addClasses(this.makeStyles('subMenuContentStyles'))
			.appendTo(parent);

		this.createMenuHeader(qualityMenu, 'quality');

		const scrollContainer = this.player.createElement('div', 'quality-scroll-container')
			.addClasses(this.makeStyles('scrollContainerStyles'))
			.appendTo(qualityMenu);

		scrollContainer.style.transform = 'translateX(0)';

		this.player.on('item', () => {
			scrollContainer.innerHTML = '';
		});

		this.player.on('levels', (levels) => {
			scrollContainer.innerHTML = '';

			Object.values(levels).forEach((level) => {
				this.createQualityMenuButton(scrollContainer, {
					id: level.id,
					width: level.width ?? 0,
					height: level.height ?? 0,
					label: level.label,
					bitrate: level.bitrate ?? 0,
				});
			});
		});

		this.player.on('show-quality-menu', (showing) => {
			if (showing) {
				qualityMenu.style.display = 'flex';
			} else {
				qualityMenu.style.display = 'none';
			}
		});

		return qualityMenu;
	}

	createQualityMenuButton(parent: HTMLDivElement, data: {
        width: number;
        id: number;
        bitrate: number;
        label: string;
        height: number
    }, hovered = false) {

		const qualityButton = this.player.createElement('button', `quality-button-${data.height}-${data.bitrate}`)
			.addClasses(this.makeStyles('languageButtonStyles'))
			.appendTo(parent);

		const qualityButtonText = this.player.createElement('span', 'menu-button-text')
			.addClasses(this.makeStyles('menuButtonTextStyles'))
			.appendTo(qualityButton);

		qualityButtonText.textContent = `${this.player.localize((data.label)
			?.replace('segment-metadata', 'Off'))}`;

		const chevron = this.createSVGElement(qualityButton, 'checkmark', this.buttons.checkmark, hovered);
		this.player.addClasses(chevron, ['nm-ml-auto']);

		if (data.id > 0) {
			chevron.classList.add('nm-hidden');
		}

		this.player.on('levelsChanging', (level) => {
			if (level.id == data.id) {
				chevron.classList.remove('nm-hidden');
			} else {
				chevron.classList.add('nm-hidden');
			}
		});

		qualityButton.addEventListener('click', (event) => {
			event.stopPropagation();

			this.player.setCurrentQuality(data.id);

			this.player.emit('show-menu', false);
		});

		return qualityButton;
	}

	createLanguageMenuButton(parent: HTMLDivElement, data: {
		language: string,
		label: string,
		type: string,
		id: number,
		styled?: boolean;
		buttonType: string;
	}, hovered = false) {

		const languageButton = this.player.createElement('button', `${data.type}-button-${data.language}`)
			.addClasses(this.makeStyles('languageButtonStyles'))
			.appendTo(parent);

		const languageButtonText = this.player.createElement('span', 'menu-button-text')
			.addClasses(this.makeStyles('menuButtonTextStyles'))
			.appendTo(languageButton);

		if (data.buttonType == 'subtitle') {
			if (data.styled) {
				languageButtonText.textContent = `${this.player.localize(data.language ?? '')} ${this.player.localize(data.label)} ${this.player.localize('styled')}`;
			} else if (data.language == '') {
				languageButtonText.textContent = this.player.localize(data.label);
			} else {
				languageButtonText.textContent = `${this.player.localize(data.language ?? '')} (${this.player.localize(data.type)})`;
			}
		}

		const chevron = this.createSVGElement(languageButton, 'checkmark', this.buttons.checkmark, hovered);
		this.player.addClasses(chevron, ['nm-ml-auto']);

		if (data.id > -1) {
			chevron.classList.add('nm-hidden');
		}

		if (data.buttonType == 'audio') {
			this.player.on('audioTrackChanged', (audio) => {
				if (data.id === audio.id) {
					chevron.classList.remove('nm-hidden');
				} else {
					chevron.classList.add('nm-hidden');
				}
			});

			languageButton.addEventListener('click', (event) => {
				event.stopPropagation();
				this.player.setCurrentAudioTrack(data.id);
				this.player.emit('show-menu', false);
			});
		} else if (data.buttonType == 'subtitle') {
			if (data.id === this.player.getCaptionIndex()) {
				chevron.classList.remove('nm-hidden');
			} else {
				chevron.classList.add('nm-hidden');
			}

			this.player.on('captionsChanged', (track) => {
				if (data.id === track.id) {
					chevron.classList.remove('nm-hidden');
				} else {
					chevron.classList.add('nm-hidden');
				}
			});

			languageButton.addEventListener('click', (event) => {
				event.stopPropagation();
				this.player.setCurrentCaption(data.id);
				this.player.emit('show-menu', false);
			});
		}

		languageButton.addEventListener('keyup', (e) => {
			if (e.key == 'ArrowLeft') {
				this.player.getClosestElement(languageButton, '[id^="audio-button-"]')?.focus();
			} else if (e.key == 'ArrowRight') {
				this.player.getClosestElement(languageButton, '[id^="subtitle-button-"]')?.focus();
			} else if (e.key == 'ArrowUp' && !this.player.options.disableTouchControls) {
				(languageButton.previousElementSibling as HTMLButtonElement)?.focus();
			} else if (e.key == 'ArrowDown' && !this.player.options.disableTouchControls) {
				(languageButton.nextElementSibling as HTMLButtonElement)?.focus();
			}
		});

		return languageButton;
	}

	createSeekRipple(parent: HTMLDivElement, side: string) {

		const seekRipple = this.player.createElement('div', 'seek-ripple')
			.addClasses(['seek-ripple', side])
			.appendTo(parent);

		const arrowHolder = this.player.createElement('div', 'seek-ripple-arrow')
			.addClasses(['seek-ripple-arrow'])
			.appendTo(seekRipple);

		const text = this.player.createElement('p', 'seek-ripple-text')
			.addClasses(['seek-ripple-text'])
			.appendTo(seekRipple);

		if (side == 'left') {
			seekRipple.style.borderRadius = '0 50% 50% 0';
			seekRipple.style.left = '0px';
			arrowHolder.innerHTML = `
				<div class="arrow arrow2 arrow-left"></div>
				<div class="arrow arrow1 arrow-left"></div>
				<div class="arrow arrow3 arrow-left"></div>
			`;
			this.player.on('rewind', (val: number) => {
				text.textContent = `${Math.abs(val)} ${this.player.localize('seconds')}`;
				seekRipple.style.display = 'flex';
			});
			this.player.on('remove-rewind', () => {
				seekRipple.style.display = 'none';
			});
		} else if (side == 'right') {
			seekRipple.style.borderRadius = '50% 0 0 50%';
			seekRipple.style.right = '0px';
			arrowHolder.innerHTML = `
				<div class="arrow arrow3 arrow-right"></div>
				<div class="arrow arrow1 arrow-right"></div>
				<div class="arrow arrow2 arrow-right"></div>
			`;
			this.player.on('forward', (val: number) => {
				text.textContent = `${Math.abs(val)} ${this.player.localize('seconds')}`;
				seekRipple.style.display = 'flex';
			});
			this.player.on('remove-forward', () => {
				seekRipple.style.display = 'none';
			});
		}

		return seekRipple;
	};

	createProgressBar(parent: HTMLDivElement) {

		this.sliderBar = this.player.createElement('div', 'slider-bar')
			.addClasses(this.makeStyles('sliderBarStyles'))
			.appendTo(parent);

		const sliderBuffer = this.player.createElement('div', 'slider-buffer')
			.addClasses(this.makeStyles('sliderBufferStyles'))
			.appendTo(this.sliderBar);

		const sliderHover = this.player.createElement('div', 'slider-hover')
			.addClasses(this.makeStyles('sliderHoverStyles'))
			.appendTo(this.sliderBar);

		const sliderProgress = this.player.createElement('div', 'slider-progress')
			.addClasses(this.makeStyles('sliderProgressStyles'))
			.appendTo(this.sliderBar);

		this.chapterBar = this.player.createElement('div', 'chapter-progress')
			.addClasses(this.makeStyles('chapterBarStyles'))
			.appendTo(this.sliderBar);

		const sliderNipple = document.createElement('div');
		this.player.addClasses(sliderNipple, this.makeStyles('sliderNippleStyles'));
		sliderNipple.id = 'slider-nipple';

		if (this.player.options.nipple != false) {
			this.sliderBar.append(sliderNipple);
		}

		const sliderPop = this.player.createElement('div', 'slider-pop')
			.addClasses(this.makeStyles('sliderPopStyles'))
			.appendTo(this.sliderBar);

		sliderPop.style.setProperty('--visibility', '0');
		sliderPop.style.opacity = 'var(--visibility)';

		this.sliderPopImage = this.player.createElement('div', 'slider-pop-image')
			.addClasses(this.makeStyles('sliderPopImageStyles'))
			.appendTo(sliderPop);

		const sliderText = this.player.createElement('div', 'slider-text')
			.addClasses(this.makeStyles('sliderTextStyles'))
			.appendTo(sliderPop);

		const chapterText = this.player.createElement('div', 'chapter-text')
			.addClasses(this.makeStyles('chapterTextStyles'))
			.appendTo(sliderPop);

		if (this.player.options.chapters && !this.player.isTv() && this.player.getChapters()?.length > 0) {
			this.sliderBar.style.background = '';
		}

		['mousedown', 'touchstart'].forEach((event) => {
			this.sliderBar.addEventListener(event, () => {
				if (this.isMouseDown) return;

				this.isMouseDown = true;
				this.isScrubbing = true;
			}, {
				passive: true,
			});
		});

		this.bottomBar.addEventListener('click', (e: any) => {
			this.player.emit('hide-tooltip');
			if (!this.isMouseDown) return;

			this.isMouseDown = false;
			this.isScrubbing = false;
			sliderPop.style.setProperty('--visibility', '0');
			const scrubTime = this.getScrubTime(e);
			sliderNipple.style.left = `${scrubTime.scrubTime}%`;
			this.player.seek(scrubTime.scrubTimePlayer);
		}, {
			passive: true,
		});

		['mousemove', 'touchmove'].forEach((event) => {
			this.sliderBar.addEventListener(event, (e: any) => {
				const scrubTime = this.getScrubTime(e);
				this.getSliderPopImage(scrubTime);
				sliderText.textContent = humanTime(scrubTime.scrubTimePlayer);

				const sliderPopOffsetX = this.getSliderPopOffsetX(sliderPop, scrubTime);
				sliderPop.style.left = `${sliderPopOffsetX}%`;

				if (!this.player.options.chapters || this.player.getChapters()?.length == 0) {
					sliderHover.style.width = `${scrubTime.scrubTime}%`;
				}

				if (!this.isMouseDown) return;

				chapterText.textContent = this.getChapterText(scrubTime.scrubTimePlayer);
				sliderNipple.style.left = `${scrubTime.scrubTime}%`;
				if (this.previewTime.length > 0) {
					sliderPop.style.setProperty('--visibility', '1');
				}
			}, {
				passive: true,
			});
		});
		this.sliderBar.addEventListener('mouseover', (e: MouseEvent) => {
			const scrubTime = this.getScrubTime(e);
			this.getSliderPopImage(scrubTime);
			sliderText.textContent = humanTime(scrubTime.scrubTimePlayer);
			chapterText.textContent = this.getChapterText(scrubTime.scrubTimePlayer);
			if (this.previewTime.length > 0) {
				sliderPop.style.setProperty('--visibility', '1');
				const sliderPopOffsetX = this.getSliderPopOffsetX(sliderPop, scrubTime);
				sliderPop.style.left = `${sliderPopOffsetX}%`;
			}
		}, {
			passive: true,
		});

		this.sliderBar.addEventListener('mouseleave', () => {
			sliderPop.style.setProperty('--visibility', '0');
			sliderHover.style.width = '0';
		}, {
			passive: true,
		});

		this.player.on('seeked', () => {
			sliderPop.style.setProperty('--visibility', '0');
		});

		this.player.on('item', () => {
			this.sliderBar.classList.add('nm-bg-white/20');
			this.previewTime = [];
			this.chapters = [];
			sliderBuffer.style.width = '0';
			sliderProgress.style.width = '0';
			this.fetchPreviewTime();
		});

		this.player.on('chapters', () => {
			if (this.player.getChapters()?.length > 0 && !this.player.isTv()) {
				this.sliderBar.classList.remove('nm-bg-white/20');
			} else {
				this.sliderBar.classList.add('nm-bg-white/20');
			}
		});

		this.player.on('time', (data) => {
			if (this.player.getChapters()?.length == 0) {
				sliderBuffer.style.width = `${data.buffered}%`;
				sliderProgress.style.width = `${data.percentage}%`;
			}
			if (!this.isScrubbing) {
				sliderNipple.style.left = `${data.percentage}%`;
			}
		});

		this.player.on('controls', (showing) => {
			if (!showing) {
				sliderPop.style.setProperty('--visibility', '0');
				this.menuFrame.close();
			}
		});

		this.player.on('pip-internal', (data) => {
			if (data) {
				this.sliderBar.style.display = 'none';
			} else {
				this.sliderBar.style.display = 'flex';
			}
		});

		return this.sliderBar;
	}

	createTvProgressBar(parent: HTMLDivElement) {

		this.sliderBar = this.player.createElement('div', 'slider-bar')
			.addClasses(this.makeStyles('sliderBarStyles'))
			.appendTo(parent);

		const sliderBuffer = this.player.createElement('div', 'slider-buffer')
			.addClasses(this.makeStyles('sliderBufferStyles'))
			.appendTo(this.sliderBar);

		const sliderProgress = this.player.createElement('div', 'slider-progress')
			.addClasses(this.makeStyles('sliderProgressStyles'))
			.appendTo(this.sliderBar);

		this.chapterBar = this.player.createElement('div', 'chapter-progress')
			.addClasses(this.makeStyles('chapterBarStyles'))
			.appendTo(this.sliderBar);

		this.player.on('item', () => {
			this.sliderBar.classList.add('nm-bg-white/20');
			this.previewTime = [];
			this.chapters = [];
			sliderBuffer.style.width = '0';
			sliderProgress.style.width = '0';
			this.fetchPreviewTime();
		});

		this.player.on('chapters', () => {
			if (this.player.getChapters()?.length > 0 && !this.player.isTv()) {
				this.sliderBar.classList.remove('nm-bg-white/20');
			} else {
				this.sliderBar.classList.add('nm-bg-white/20');
			}
		});

		this.player.on('time', (data) => {
			sliderBuffer.style.width = `${data.buffered}%`;
			sliderProgress.style.width = `${data.percentage}%`;
		});

		this.player.on('currentScrubTime', (data) => {
			sliderProgress.style.width = `${(data.currentTime / data.duration) * 100}%`;
		});

		return this.sliderBar;
	}

	getChapterText(scrubTimePlayer: number): string | null {
		if (this.player.getChapters().length == 0) return null;

		const index = this.player.getChapters()?.findIndex((chapter: Chapter) => {
			return chapter.startTime > scrubTimePlayer;
		});

		return this.player.getChapters()[index - 1]?.title
            ?? this.player.getChapters()[this.player.getChapters()?.length - 1]?.title
            ?? null;
	}

	createChapterMarker(chapter: Chapter) {
		const chapterMarker = this.player.createElement('div', `chapter-marker-${chapter.id.replace(/\s/gu, '-')}`)
			.addClasses(this.makeStyles('chapterMarkersStyles'))
			.appendTo(this.chapterBar);
		chapterMarker.style.left = `${chapter.left}%`;
		chapterMarker.style.width = `calc(${chapter.width}% - 2px)`;

		this.player.createElement('div', `chapter-marker-bg-${chapter.id.replace(/\s/gu, '-')}`)
			.addClasses(this.makeStyles('chapterMarkerBGStyles'))
			.appendTo(chapterMarker);

		const chapterMarkerBuffer = this.player.createElement('div', `chapter-marker-buffer-${chapter.id.replace(/\s/gu, '-')}`)
			.addClasses(this.makeStyles('chapterMarkerBufferStyles'))
			.appendTo(chapterMarker);

		const chapterMarkerHover = this.player.createElement('div', `chapter-marker-hover-${chapter.id.replace(/\s/gu, '-')}`)
			.addClasses(this.makeStyles('chapterMarkerHoverStyles'))
			.appendTo(chapterMarker);

		const chapterMarkerProgress = this.player.createElement('div', `chapter-marker-progress-${chapter.id.replace(/\s/gu, '-')}`)
			.addClasses(this.makeStyles('chapterMarkerProgressStyles'))
			.appendTo(chapterMarker);

		const left = chapter.left;
		const right = chapter.left + chapter.width;

		this.player.on('time', (data) => {
			if (data.percentage < left) {
				chapterMarkerProgress.style.transform = 'scaleX(0)';
			} else if (data.percentage > right) {
				chapterMarkerProgress.style.transform = 'scaleX(1)';
			} else {
				chapterMarkerProgress.style.transform = `scaleX(${(data.percentage - left) / (right - left)})`;
			}

			if (data.buffered < left) {
				chapterMarkerBuffer.style.transform = 'scaleX(0)';
			} else if (data.buffered > right) {
				chapterMarkerBuffer.style.transform = 'scaleX(1)';
			} else {
				chapterMarkerBuffer.style.transform = `scaleX(${(data.buffered - left) / (right - left)})`;
			}
		});

		['mousemove', 'touchmove'].forEach((event) => {
			this.chapterBar.addEventListener(event, (e: any) => {
				const { scrubTime } = this.getScrubTime(e);

				if (scrubTime < left) {
					chapterMarkerHover.style.transform = 'scaleX(0)';
				} else if (scrubTime > right) {
					chapterMarkerHover.style.transform = 'scaleX(1)';
				} else {
					chapterMarkerHover.style.transform = `scaleX(${(scrubTime - left) / (right - left)})`;
				}

			});
		});

		this.chapterBar.addEventListener('mouseleave', () => {
			chapterMarkerHover.style.transform = 'scaleX(0)';
		});

		return chapterMarker;
	}

	createChapterMarkers() {
		if (this.player.isTv()) return;

		this.chapterBar.style.background = '';

		this.player.on('item', () => {
			this.chapterBar.style.background = '';
		});

		this.chapterBar.querySelectorAll('.chapter-marker').forEach((element) => {
			this.chapterBar.classList.add('nm-bg-white/20');
			element.remove();
		});
		this.player.getChapters()?.forEach((chapter: Chapter) => {
			this.player.createChapterMarker(chapter);
		});
	}

	getSliderPopOffsetX(sliderPop: HTMLDivElement, scrubTime: any) {
		const sliderBarRect = this.sliderBar.getBoundingClientRect();
		const sliderPopRect = sliderPop.getBoundingClientRect();
		const sliderPopPercentageWidth = ((sliderPopRect.width * 0.5) / sliderBarRect.width) * 100;
		let offsetX = scrubTime.scrubTime;
		if (offsetX <= sliderPopPercentageWidth) {
			offsetX = sliderPopPercentageWidth;
		}
		if (offsetX >= 100 - sliderPopPercentageWidth) {
			offsetX = 100 - sliderPopPercentageWidth;
		}

		return offsetX;
	}

	createThumbnail(time: PreviewTime) {
		this.thumbnail = this.player.createElement('div', `thumbnail-${time.start}`)
			.addClasses(this.makeStyles('thumbnailStyles'))
			.get();

		this.thumbnail.style.backgroundImage = this.image;
		this.thumbnail.style.backgroundPosition = `-${time.x}px -${time.y}px`;
		this.thumbnail.style.width = `${time.w}px`;
		this.thumbnail.style.minWidth = `${time.w}px`;
		this.thumbnail.style.height = `${time.h}px`;

		return this.thumbnail;
	}

	getSliderPopImage(scrubTime: any) {
		const img = this.loadSliderPopImage(scrubTime);

		if (img) {
			this.sliderPopImage.style.backgroundPosition = `-${img.x}px -${img.y}px`;
			this.sliderPopImage.style.width = `${img.w}px`;
			this.sliderPopImage.style.height = `${img.h}px`;
		}
	}

	adjustScaling(imgDimension: number, thumbnailDimension: number) {
		const scaling = imgDimension % thumbnailDimension;
		if (scaling % 1 !== 0) {
			imgDimension /= (scaling / Math.round(scaling));
		}
		if (scaling > 1) {
			imgDimension *= scaling;
		}
		return imgDimension;
	}

	fetchPreviewTime() {
		if (this.previewTime.length === 0) {
			const imageFile = this.player.getSpriteFile();

			const img = new Image();
			this.player.once('item', () => {
				img.remove();
			});

			if (imageFile) {
				if (this.player.options.accessToken) {
					this.player.getFileContents<Blob>({
						url: imageFile,
						options: {
							type: 'blob',
						},
						callback: (data) => {
							const dataURL = URL.createObjectURL(data as Blob);

							img.src = dataURL;

							this.sliderPopImage.style.backgroundImage = `url('${dataURL}')`;

							// release memory
							this.player.once('item', () => {
								URL.revokeObjectURL(dataURL);
							});
							setTimeout(() => {
								this.player.emit('preview-time', this.previewTime);
							}, 400);
						},
					}).then();
				} else {
					this.sliderPopImage.style.backgroundImage = `url('${imageFile}')`;

					img.src = imageFile;
					setTimeout(() => {
						this.player.emit('preview-time', this.previewTime);
					}, 400);
				}
			}

			const timeFile = this.player.getTimeFile();
			if (timeFile && this.currentTimeFile !== timeFile) {
				this.player.currentTimeFile = timeFile;

				img.onload = () => {

					this.player.getFileContents<string>({
						url: timeFile,
						options: {
							type: 'text',
						},
						callback: (data) => {

							const parser = new WebVTTParser();
							const vtt = parser.parse(data, 'metadata');
							const regex = /(?<x>\d*),(?<y>\d*),(?<w>\d*),(?<h>\d*)/u;

							this.previewTime = [];

							vtt.cues.forEach((cue) => {
								const match = regex.exec(cue.text);
								if (!match?.groups) return;

								const { x, y, w, h } = match.groups;

								const [imgX, imgY, imgW, imgH] = [x, y, w, h]
									.map(val => parseInt(val, 10));

								this.previewTime.push({
									start: cue.startTime,
									end: cue.endTime,
									x: imgX,
									y: imgY,
									w: imgW,
									h: imgH,
								});
							});

							setTimeout(() => {
								this.player.emit('preview-time', this.previewTime);
							}, 400);
						},
					}).then(() => {
						this.loadSliderPopImage(0);
					});
				};
			}
		}
	}

	loadSliderPopImage(scrubTime?: any) {
		this.fetchPreviewTime();

		let img = this.previewTime.find(
			(p: { start: number; end: number; }) => scrubTime.scrubTimePlayer >= p.start && scrubTime.scrubTimePlayer < p.end
		);
		if (!img) {
			img = this.previewTime.at(-1);
		}
		return img;
	}

	getScrubTime(e: any, parent = this.sliderBar) {
		const elementRect = parent.getBoundingClientRect();

		const x = e.clientX ?? e.touches?.[0]?.clientX ?? e.changedTouches?.[0]?.clientX ?? 0;

		let offsetX = x - elementRect.left;
		if (offsetX <= 0) offsetX = 0;
		if (offsetX >= elementRect.width) offsetX = elementRect.width;

		return {
			scrubTime: (offsetX / parent.offsetWidth) * 100,
			scrubTimePlayer: (offsetX / parent.offsetWidth) * this.player.getDuration(),
		};
	}

	createOverlayCenterMessage(parent: HTMLDivElement) {
		const playerMessage = this.player.createElement('button', 'player-message')
			.addClasses(this.makeStyles('playerMessageStyles'))
			.appendTo(parent);

		this.player.on('display-message', (val: string | null) => {
			playerMessage.style.display = 'flex';
			playerMessage.textContent = val;
		});
		this.player.on('remove-message', () => {
			playerMessage.style.display = 'none';
			playerMessage.textContent = '';
		});

		return playerMessage;
	};

	createEpisodeMenu(parent: HTMLDivElement) {

		const playlistMenu = this.player.createElement('div', 'playlist-menu')
			.addClasses([
				...this.makeStyles('subMenuContentStyles'),
				'!nm-flex-row',
				'!nm-gap-0',
			])
			.appendTo(parent);

		playlistMenu.style.minHeight = `${parseInt(getComputedStyle(this.player.getVideoElement()).height.split('px')[0], 10) * 0.8}px`;

		this.player.getVideoElement().addEventListener('resize', () => {
			playlistMenu.style.minHeight = `${parseInt(getComputedStyle(this.player.getVideoElement()).height.split('px')[0], 10) * 0.8}px`;
		});

		const subMenu = this.player.createElement('div', 'sub-menu')
			.addClasses([
				...this.makeStyles('subMenuContentStyles'),
				'!nm-flex',
				'!nm-w-1/3',
				'nm-border-r-2',
				'nm-border-gray-500/20',
			])
			.appendTo(playlistMenu);

		this.createMenuHeader(subMenu, 'Seasons');

		const seasonScrollContainer = this.player.createElement('div', 'playlist-scroll-container')
			.addClasses(this.makeStyles('scrollContainerStyles'))
			.appendTo(subMenu);
		seasonScrollContainer.style.transform = 'translateX(0)';

		seasonScrollContainer.innerHTML = '';
		for (const [, item] of this.unique(this.player.getPlaylist(), 'season').entries() ?? []) {
			this.createSeasonMenuButton(seasonScrollContainer, item);
		}

		const episodeMenu = this.player.createElement('div', 'episode-menu')
			.addClasses([
				...this.makeStyles('subMenuContentStyles'),
				'!nm-flex',
				'!nm-w/2/3',
			])
			.appendTo(playlistMenu);

		this.createMainMenuHeader(episodeMenu, '');

		const scrollContainer = this.player.createElement('div', 'playlist-scroll-container')
			.addClasses(this.makeStyles('scrollContainerStyles'))
			.appendTo(episodeMenu);

		scrollContainer.innerHTML = '';
		scrollContainer.tabIndex = 1;

		scrollContainer.addEventListener('focus', () => {
			(scrollContainer.firstChild as HTMLButtonElement)?.focus();
		});

		for (const [index, item] of this.player.getPlaylist().entries() ?? []) {
			this.createEpisodeMenuButton(scrollContainer, item, index);
		}

		this.player.on('show-playlist-menu', (showing) => {
			if (showing) {
				playlistMenu.style.display = 'flex';
				setTimeout(() => {
					(scrollContainer.firstChild as HTMLButtonElement).focus();
				}, 200);
			} else {
				playlistMenu.style.display = 'none';
			}
		});

		return playlistMenu;
	}

	createSeasonMenuButton(parent: HTMLDivElement, item: PlaylistItem, hovered = false) {

		const seasonButton = this.player.createElement('button', `season-${item.id}`)
			.addClasses(this.makeStyles('languageButtonStyles'))
			.appendTo(parent);

		if (this.player.playlistItem()?.season === item?.season) {
			seasonButton.classList.add('active');
			seasonButton.style.backgroundColor = 'rgb(82 82 82 / 0.5)';
		} else {
			seasonButton.classList.remove('active');
			seasonButton.style.backgroundColor = '';
		}

		this.player.on('item', () => {
			if (this.player.playlistItem()?.season === item?.season) {
				seasonButton.classList.add('active');
				seasonButton.style.backgroundColor = 'rgb(82 82 82 / 0.5)';
			} else {
				seasonButton.classList.remove('active');
				seasonButton.style.backgroundColor = '';
			}
		});
		this.player.on('switch-season', (season) => {
			if (season === item?.season) {
				seasonButton.classList.add('active');
				seasonButton.style.backgroundColor = 'rgb(82 82 82 / 0.5)';
				seasonButton.style.outline = '2px solid fff';
			} else {
				seasonButton.classList.remove('active');
				seasonButton.style.backgroundColor = '';
				seasonButton.style.outline = '';
			}
		});

		const buttonSpan = this.player.createElement('span', `season-${item.id}-span`)
			.addClasses(this.makeStyles('menuButtonTextStyles'))
			.appendTo(seasonButton);

		buttonSpan.innerText = item?.seasonName ? item?.seasonName : `Season ${item?.season}`;

		const chevron = this.createSVGElement(seasonButton, 'menu', this.buttons.chevronR, hovered);
		this.player.addClasses(chevron, ['nm-ml-auto']);

		seasonButton.addEventListener('click', () => {
			this.player.emit('switch-season', item?.season);
		});

		return seasonButton;
	}

	createEpisodeMenuButton(parent: HTMLDivElement, item: PlaylistItem, index: number) {

		const button = this.player.createElement('button', `playlist-${item.id}`)
			.addClasses(this.makeStyles('playlistMenuButtonStyles'))
			.appendTo(parent);

		if (this.player.playlistItem()?.season !== 1) {
			button.style.display = 'none';
		}

		const leftSide = this.player.createElement('div', `playlist-${item.id}-left`)
			.addClasses(this.makeStyles('episodeMenuButtonLeftStyles'))
			.appendTo(button);

		this.player.createElement('div', `episode-${item.id}-shadow`)
			.addClasses(this.makeStyles('episodeMenuButtonShadowStyles'))
			.appendTo(leftSide);

		const image = this.player.createElement('img', `episode-${item.id}-image`)
			.addClasses(this.makeStyles('episodeMenuButtonImageStyles'))
			.appendTo(leftSide);
		image.setAttribute('loading', 'lazy');
		image.src = item.image && item.image != '' ? `${this.imageBaseUrl}${item.image}` : '';


		const progressContainer = this.player.createElement('div', `episode-${item.id}-progress-container`)
			.addClasses(this.makeStyles('episodeMenuProgressContainerStyles'))
			.appendTo(leftSide);

		const progressContainerItemBox = this.player.createElement('div', `episode-${item.id}-progress-box`)
			.addClasses(this.makeStyles('episodeMenuProgressBoxStyles'))
			.appendTo(progressContainer);


		const progressContainerItemText = this.player.createElement('div', `episode-${item.id}-progress-item`)
			.addClasses(this.makeStyles('progressContainerItemTextStyles'))
			.appendTo(progressContainerItemBox);

		if (item.episode) {
			progressContainerItemText.innerText = `${this.player.localize('E')}${item.episode}`;
		}

		const progressContainerDurationText = this.player.createElement('div', `episode-${item.id}-progress-duration`)
			.addClasses(this.makeStyles('progressContainerDurationTextStyles'))
			.appendTo(progressContainerItemBox);
		progressContainerDurationText.innerText = item.duration?.replace(/^00:/u, '') ?? '';

		const sliderContainer = this.player.createElement('div', `episode-${item.id}-slider-container`)
			.addClasses(this.makeStyles('sliderContainerStyles'))
			.appendTo(progressContainer);

		const progressBar = this.player.createElement('div', `episode-${item.id}-progress-bar`)
			.addClasses(this.makeStyles('progressBarStyles'))
			.appendTo(sliderContainer);

		if (item.progress?.percentage) {
			progressBar.style.width = `${item.progress.percentage > 98 ? 100 : item.progress}%`;
		}
		if (item.progress?.percentage) {
			// sliderContainer.style.display = 'flex';
		}

		const episodeMenuButtonRightSide = this.player.createElement('div', `episode-${item.id}-right-side`)
			.addClasses(this.makeStyles('episodeMenuButtonRightSideStyles'))
			.appendTo(button);

		const episodeMenuButtonTitle = this.player.createElement('span', `episode-${item.id}-title`)
			.addClasses(this.makeStyles('episodeMenuButtonTitleStyles'))
			.appendTo(episodeMenuButtonRightSide);

		// if (item.episode) {
		episodeMenuButtonTitle.textContent = this.lineBreakShowTitle(item.title.replace(item.show, '').replace('%S', this.player.localize('S'))
			.replace('%E', this.player.localize('E')));
		// }

		const episodeMenuButtonOverview = this.player.createElement('span', `episode-${item.id}-overview`)
			.addClasses(this.makeStyles('episodeMenuButtonOverviewStyles'))
			.appendTo(episodeMenuButtonRightSide);
		episodeMenuButtonOverview.textContent = this.limitSentenceByCharacters(item.description, 600);

		this.player.on('item', () => {
			if (this.player.playlistItem().season == item.season) {
				button.style.display = 'flex';
			} else {
				button.style.display = 'none';
			}

			if (this.player.playlistItem().season == item.season && this.player.playlistItem().episode == item.episode) {
				button.style.background = 'rgba(255,255,255,.1)';
			} else {
				button.style.background = '';
			}
		});

		this.player.on('switch-season', (season) => {
			if (season == item.season) {
				button.style.display = 'flex';
			} else {
				button.style.display = 'none';
			}
		});

		this.player.on('time', (data) => {
			if (this.player.playlistItem()?.uuid == item.uuid) {
				progressBar.style.width = `${data.percentage}%`;
				if (data.percentage > 0) {
					sliderContainer.style.display = 'flex';
				}
			}
		});

		if (item.episode && item.show) {
			progressContainerItemText.innerText
                = item.season == undefined ? `${item.episode}` : `${this.player.localize('S')}${item.season}: ${this.player.localize('E')}${item.episode}`;
		}

		button.addEventListener('click', () => {
			this.player.emit('show-menu', false);

			if (item.episode && item.season) {
				this.setEpisode(item.season, item.episode);
			} else {
				this.player.playlistItem(index);
			}
			this.player.emit('playlist-menu-button-clicked', item);
		});

		return button;
	}

	createToolTip(parent: HTMLDivElement) {
		this.tooltip = this.player.createElement('div', 'tooltip')
			.addClasses(this.makeStyles('tooltipStyles'))
			.appendTo(parent);

		this.tooltip.style.transform = 'translateX(10px)';
		this.tooltip.innerText = 'Play (space)';

		this.player.on('show-tooltip', (data) => {
			this.tooltip.innerText = data.text;
			this.tooltip.style.display = 'block';
			this.tooltip.style.transform = `translate(calc(${data.x} - 50%), calc(${data.y} - 100%))`;
			if (data.currentTime == 'top') {
				this.tooltip.classList.add('nm-top-0');
				this.tooltip.classList.remove('nm-bottom-0');
			} else {
				this.tooltip.classList.remove('nm-top-0');
				this.tooltip.classList.add('nm-bottom-0');
			}
		});

		this.player.on('hide-tooltip', () => {
			this.tooltip.style.display = 'none';
		});

		return this.tooltip;
	}

	createEpisodeTip(parent: HTMLDivElement) {

		const nextTip = this.player.createElement('div', 'episode-tip')
			.addClasses(this.makeStyles('nextTipStyles'))
			.appendTo(parent);

		// this.player.addClasses(nextTip, this.makeStyles('playlistMenuButtonStyles'));

		const leftSide = this.player.createElement('div', 'next-tip-left')
			.addClasses(this.makeStyles('nextTipLeftSideStyles'))
			.appendTo(nextTip);

		const image = this.player.createElement('img', 'next-tip-image')
			.addClasses(this.makeStyles('nextTipImageStyles'))
			.appendTo(leftSide);
		image.setAttribute('loading', 'eager');

		const rightSide = this.player.createElement('div', 'next-tip-right-side')
			.addClasses(this.makeStyles('nextTipRightSideStyles'))
			.appendTo(nextTip);

		const header = this.player.createElement('span', 'next-tip-header')
			.addClasses(this.makeStyles('nextTipHeaderStyles'))
			.appendTo(rightSide);

		const title = this.player.createElement('span', 'next-tip-title')
			.addClasses(this.makeStyles('nextTipTitleStyles'))
			.appendTo(rightSide);

		this.player.on('show-episode-tip', (data) => {
			this.getTipData({ direction: data.direction, header, title, image });
			nextTip.style.display = 'flex';
			nextTip.style.transform = `translate(${data.x}, calc(${data.y} - 50%))`;
		});

		this.player.on('hide-episode-tip', () => {
			nextTip.style.display = 'none';
		});

		return nextTip;
	}

	getTipDataIndex(direction: string) {
		let index: number;
		if (direction == 'previous') {
			index = this.player.playlistItem().episode ?? 0 - 1 - 1;
		} else {
			index = this.player.getPlaylistIndex() + 1;
		}

		return this.player.getPlaylist().at(index);
	}

	getTipData({ direction, header, title, image }:
                    { direction: string; header: HTMLSpanElement; title: HTMLSpanElement; image: HTMLImageElement; }) {

		const item = this.getTipDataIndex(direction);
		if (!item) return;

		image.src = item.image && item.image != '' ? `${this.imageBaseUrl}${item.image}` : '';
		header.textContent = `${this.player.localize(`${direction.toTitleCase()} Episode`)} ${this.getButtonKeyCode(direction)}`;
		title.textContent = item.title.replace(item.show, '').replace('%S', this.player.localize('S'))
			.replace('%E', this.player.localize('E'));

		this.player.once('item', () => {
			this.getTipData({ direction, header, title, image });
		});
	}

	cancelNextUp() {
		clearTimeout(this.timeout);
		this.nextUp.style.display = 'none';
	}

	createNextUp(parent: HTMLDivElement) {

		this.nextUp = this.player.createElement('div', 'episode-tip')
			.addClasses(this.makeStyles('nextUpStyles'))
			.appendTo(parent) as HTMLDivElement & { firstChild: HTMLButtonElement; lastChild: HTMLButtonElement; };

		this.nextUp.style.display = 'none';

		const creditsButton = this.player.createElement('button', 'next-up-credits')
			.addClasses(this.makeStyles('nextUpCreditsButtonStyles'))
			.appendTo(this.nextUp);

		creditsButton.innerText = this.player.localize('Watch credits');

		const nextButton = this.player.createElement('button', 'next-up-next')
			.addClasses(this.makeStyles('nextUpNextButtonStyles'))
			.appendTo(this.nextUp);

		nextButton.setAttribute('data-label', this.player.localize('Next'));
		nextButton.setAttribute('data-icon', '▶︎');

		this.player.on('show-next-up', () => {
			this.nextUp.style.display = 'flex';
			this.timeout = setTimeout(() => {
				this.nextUp.style.display = 'none';
				if (this.player.isPlaying) {
					this.player.next();
				}
			}, 4200);

			setTimeout(() => {
				nextButton.focus();
			}, 100);

		});

		creditsButton.addEventListener('click', () => {
			clearTimeout(this.timeout);
			this.nextUp.style.display = 'none';
		});

		nextButton.addEventListener('click', () => {
			clearTimeout(this.timeout);
			this.nextUp.style.display = 'none';
			this.player.next();
		});

		let enabled = false;
		this.player.on('item', () => {
			clearTimeout(this.timeout);
			this.nextUp.style.display = 'none';
			enabled = false;
		});

		this.player.once('playing', () => {
			this.player.on('time', (data) => {
				if (this.player.getDuration() > 0 && data.currentTime > (this.player.getDuration() - 5)
					&& !enabled && !this.player.isLastPlaylistItem()) {
					this.player.emit('show-next-up');
					enabled = true;
				}
			});
		});

		return this.nextUp;
	}

	modifySpinner(parent: HTMLDivElement) {
		// console.log(parent);

		this.player.createElement('h2', 'loader')
			.addClasses(['loader', 'nm-pointer-events-none'])
			.appendTo(parent);
	}

	createSpinnerContainer(parent: HTMLDivElement) {

		const spinnerContainer = this.player.createElement('div', 'spinner-container')
			.addClasses(this.makeStyles('spinnerContainerStyles'))
			.appendTo(parent);

		const role = this.player.createElement('div', 'spinner-container')
			.addClasses(this.makeStyles('roleStyles'))
			.appendTo(spinnerContainer);

		role.setAttribute('role', 'status');

		this.createSpinner(role);

		const status = this.player.createElement('span', 'status-text')
			.addClasses(this.makeStyles('statusTextStyles'))
			.appendTo(role);

		status.innerText = this.player.localize('Loading...');

		this.player.on('playing', () => {
			spinnerContainer.style.display = 'none';
		});

		this.player.on('waiting', () => {
			spinnerContainer.style.display = 'grid';
			status.innerText = `${this.player.localize('Buffering')}...`;
		});

		this.player.on('error', () => {
			spinnerContainer.style.display = 'none';
			status.innerText = this.player.localize('Something went wrong trying to play this item');
		});

		this.player.on('ended', () => {
			spinnerContainer.style.display = 'none';
		});

		this.player.on('time', () => {
			spinnerContainer.style.display = 'none';
		});

		this.player.on('bufferedEnd', () => {
			spinnerContainer.style.display = 'none';
		});

		this.player.on('stalled', () => {
			spinnerContainer.style.display = 'grid';
			status.innerText = `${this.player.localize('Buffering')}...`;
		});

		this.player.on('item', () => {
			spinnerContainer.style.display = 'grid';
		});

		return spinnerContainer;
	}

	createSpinner(parent: HTMLDivElement) {

		const spinner = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		spinner.setAttribute('viewBox', '0 0 100 101');
		spinner.id = 'spinner';
		spinner.setAttribute('fill', 'none');

		this.player.addClasses(spinner, [
			'spinner-icon',
			...this.makeStyles('spinnerStyles'),
		]);

		parent.appendChild(spinner);

		const path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		path1.setAttribute('d', 'M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z');
		path1.setAttribute('fill', 'currentColor');
		spinner.appendChild(path1);

		const path2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		path2.setAttribute('d', 'M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z');
		path2.setAttribute('fill', 'currentFill');
		spinner.appendChild(path2);

	}


	getButtonKeyCode(id: string) {

		switch (id) {
		case 'play':
		case 'pause':
			return `(${this.player.localize('SPACE')})`;
		case 'volumeMuted':
		case 'volumeLow':
		case 'volumeMedium':
		case 'volumeHigh':
			return '(m)';
		case 'seekBack':
			return '(<)';
		case 'seekForward':
			return '(>)';
		case 'next':
			return '(n)';
		case 'theater':
			return '(t)';
		case 'theater-enabled':
			return '(t)';
		case 'pip-enter':
		case 'pip-exit':
			return '(i)';
		case 'playlist':
			return '';
		case 'previous':
			return '(p)';
		case 'speed':
			return '';
		case 'subtitle':
		case 'subtitled':
			return '(v)';
		case 'audio':
			return '(b)';
		case 'settings':
			return '';
		case 'fullscreen-enable':
		case 'fullscreen':
			return '(f)';
		default:
			return '';
		}

	};


	createButton(match: string, id: string, insert: 'before'| 'after' = 'after', icon: Icon['path'], click?: () => void, rightClick?: () => void) {

		const element = document.querySelector<HTMLButtonElement>(`${match}`);
		if (!element) {
			throw new Error('Element not found');
		}

		const button = this.createUiButton(element, id.replace(/\s/gu, '_'));
		button.ariaLabel = id;

		if (insert === 'before') {
			element?.before(button);
		} else {
			element?.after(button);
		}

		this.createSVGElement(button, `${id.replace(/\s/gu, '_')}-enabled`, icon, true, false);
		this.createSVGElement(button, id.replace(/\s/gu, '_'), icon, false);

		button.addEventListener('click', (event) => {
			event.stopPropagation();
			click?.();
			this.player.emit('hide-tooltip');
		});
		button.addEventListener('contextmenu', (event) => {
			event.stopPropagation();
			rightClick?.();
			this.player.emit('hide-tooltip');
		});

		return button;
	}

	nearestValue(arr: any[], val: number) {
		return arr.reduce((p, n) => (Math.abs(p) > Math.abs(n - val) ? n - val : p), Infinity) + val;
	}

	getClosestElement(element: HTMLButtonElement, selector: string) {

		const arr = [...document.querySelectorAll<HTMLButtonElement>(selector)].filter(el => getComputedStyle(el).display == 'flex');
		const originEl = element!.getBoundingClientRect();

		const el = arr.find(el => (el.getBoundingClientRect().top + (el.getBoundingClientRect().height / 2))
		== this.nearestValue(arr.map(el => (el.getBoundingClientRect().top + (el.getBoundingClientRect().height / 2)))
			, originEl.top + (originEl.height / 2)));

		return el;
	}


	/**
     * Limits a sentence to a specified number of characters by truncating it at the last period before the limit.
     * @param str - The sentence to limit.
     * @param characters - The maximum number of characters to allow in the sentence.
     * @returns The truncated sentence.
     */
	limitSentenceByCharacters(str: string, characters = 360) {
		if (!str) {
			return '';
		}
		const arr: any = str.substring(0, characters).split('.');
		arr.pop(arr.length);
		return `${arr.join('.')}.`;
	};

	/**
     * Adds a line break before the episode title in a TV show string.
     * @param str - The TV show string to modify.
     * @param removeShow - Whether to remove the TV show name from the modified string.
     * @returns The modified TV show string.
     */
	lineBreakShowTitle(str: string, removeShow = false) {
		if (!str) {
			return '';
		}
		const ep = str.match(/S\d{2}E\d{2}/u);

		if (ep) {
			const arr = str.split(/\sS\d{2}E\d{2}\s/u);
			if (removeShow) {
				return `${ep[0]} ${arr[1]}`;
			}
			return `${arr[0]} \n${ep[0]} ${arr[1]}`;
		}

		return str;
	};

	/**
     * Returns an array of unique objects based on a specified key.
     * @param array The array to filter.
     * @param key The key to use for uniqueness comparison.
     * @returns An array of unique objects.
     */
	unique<T>(array: T[], key: string): T[] {
		if (!array || !Array.isArray(array)) {
			return [];
		}

		return array.filter((obj: any, pos, arr) => arr
			.map((mapObj: any) => mapObj[key]).indexOf(obj[key]) === pos);
	};

	/**
     * Sets the current episode to play based on the given season and episode numbers.
     * If the episode is not found in the playlist, the first item in the playlist is played.
     * @param season - The season number of the episode to play.
     * @param episode - The episode number to play.
     */
	setEpisode(season: number, episode: number) {
		const item = this.player.getPlaylist().findIndex((l: any) => l.season == season && l.episode == episode);
		if (item == -1) {
			this.player.playlistItem(0);
		} else {
			this.player.playlistItem(item);
		}
		this.player.play();
	};

	/**
     * Breaks a logo title string into two lines by inserting a newline character after a specified set of characters.
     * @param str The logo title string to break.
     * @param characters An optional array of characters to break the string on. Defaults to [':', '!', '?'].
     * @returns The broken logo title string.
     */
	breakLogoTitle(str: string, characters = [':', '!', '?']) {
		if (!str) {
			return '';
		}

		if (str.split('').some((l: string) => characters.includes(l))) {
			const reg = new RegExp(characters.map(l => (l == '?' ? `\\${l}` : l)).join('|'), 'u');
			const reg2 = new RegExp(characters.map(l => (l == '?' ? `\\${l}\\s` : `${l}\\s`)).join('|'), 'u');
			if (reg && reg2 && str.match(reg2)) {
				return str.replace((str.match(reg2) as any)[0], `${(str.match(reg) as any)[0]}\n`);
			}
		}

		return str;
	}

}

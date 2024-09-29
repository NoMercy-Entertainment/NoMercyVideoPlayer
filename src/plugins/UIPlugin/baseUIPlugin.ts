import Plugin from '../../plugin';
import type { Chapter, NMPlayer, PlaylistItem, Position, PreviewTime, VolumeState } from '../../index.d';
import {buttons, Icon} from "./buttons";
import {twMerge} from "tailwind-merge";
import * as styles from "./styles";
import {breakLogoTitle, humanTime, unique} from "../../helpers";
import {WebVTTParser} from "webvtt-parser";

export class BaseUIPlugin extends Plugin {
	player: NMPlayer = <NMPlayer>{};
	overlay: HTMLDivElement = <HTMLDivElement>{};
	buttons: Icon = <Icon>{};
	
	chapterBar: HTMLDivElement = <HTMLDivElement>{};
	mainMenu: HTMLDivElement = <HTMLDivElement>{};
	menuFrame: HTMLDialogElement = <HTMLDialogElement>{};
	nextUp: HTMLDivElement & {		
		firstChild: HTMLButtonElement,		
		lastChild: HTMLButtonElement	} = <HTMLDivElement & {		
		firstChild: HTMLButtonElement,		
		lastChild: HTMLButtonElement	
	}>{};	
	seekContainer: HTMLDivElement = <HTMLDivElement>{};
	sliderBar: HTMLDivElement = <HTMLDivElement>{};
	sliderPopImage: HTMLDivElement = <HTMLDivElement>{};
	thumbnail: HTMLDivElement = <HTMLDivElement>{};
	episodeScrollContainer: HTMLDivElement = <HTMLDivElement>{};
	
	chapters: any[] = [];
	previewTime: PreviewTime[] = [];

	timer: NodeJS.Timeout = <NodeJS.Timeout>{};
	timeout: NodeJS.Timeout = <NodeJS.Timeout>{};

	image = '';
	controlsVisible: boolean = false;
	currentScrubTime = 0;
	imageBaseUrl = '';
	isScrubbing = false;
	menuOpen = false;
	mainMenuOpen = false;
	languageMenuOpen = false;
	subtitlesMenuOpen = false;
	qualityMenuOpen = false;
	speedMenuOpen = false;
	playlistMenuOpen = false;
	theaterModeEnabled = false;
	shouldSlide = false;
	currentTimeFile = '';

	currentMenu: 'language'|'episode'|'pause'|'quality'|'seek'|null = null;
	thumbs: {
		time: PreviewTime,
		el: HTMLDivElement
	}[] = [];


	initialize(player: NMPlayer) {
		this.player = player;
		this.overlay = player.overlay;
		this.buttons = buttons();
		this.imageBaseUrl = player.options.basePath ? '' : 'https://image.tmdb.org/t/p/w185';
		// Initialize the plugin with the player
	}

	dispose() {
		
		// Remove event listeners

		// Clear timeouts
		clearTimeout(this.timer);
		clearTimeout(this.timeout);
		
		// Clear references
		this.player.plugins.desktopUIPlugin = undefined;
		this.chapters = [];
		this.previewTime = [];

		// Remove DOM elements
		if (this.overlay && this.overlay.parentNode) {
			this.overlay.parentNode.removeChild(this.overlay);
		}
	}


	scrollIntoView(element: HTMLElement) {

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

	createSVGElement(parent: HTMLElement, id: string, icon: Icon['path'], hidden = false, hovered = false) {

		const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		svg.setAttribute('viewBox', '0 0 24 24');

		svg.id = id;
		this.player.addClasses(svg, twMerge([
			`${id}-icon`,
			...this.makeStyles('svgSizeStyles'),
			...this.makeStyles('iconStyles'),
			hidden ? 'hidden' : 'flex',
			...icon.classes,
		]).split(' '));

		const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		path.setAttribute('d', hovered ? icon.normal : icon.hover);
		this.player.addClasses(path, [
			'group-hover/button:hidden',
			'group-hover/volume:hidden',
		]);
		svg.appendChild(path);

		const path2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		path2.setAttribute('d', hovered ? icon.hover : icon.normal);
		this.player.addClasses(path2, [
			'hidden',
			'group-hover/button:flex',
			'group-hover/volume:flex',
		]);
		svg.appendChild(path2);

		if (!parent.classList.contains('menu-button') && hovered) {
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
	
	modifySpinner(parent: HTMLDivElement) {
		// console.log(parent);

		this.player.createElement('h2', 'loader')
			.addClasses(['loader', 'pointer-events-none'])
			.appendTo(parent);
	}

	createSpinnerContainer(parent: HTMLDivElement) {

		const spinnerContainer = this.player.createElement('div', 'spinner-container')
			.addClasses(this.makeStyles('spinnerContainerStyles'))
			.appendTo(parent);

		const role = this.player.createElement('div', 'spinner-role')
			.addClasses(this.makeStyles('roleStyles'))
			.appendTo(spinnerContainer);

		role.setAttribute('role', 'status');

		this.createSpinner(role);

		const status = this.player.createElement('span', 'status-text')
			.addClasses(this.makeStyles('statusTextStyles'))
			.appendTo(role);

		status.innerText = this.player.localize('Loading...');

		this.player.on('ready', () => {
			spinnerContainer.style.display = 'none';
		});

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

		this.player.on('ready', () => {
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

	fetchPreviewTime() {
		if (this.previewTime.length === 0) {
			const imageFile = this.player.getSpriteFile();

			const img = new Image();
			this.player.once('item', () => {
				img.remove();
			});

			if (imageFile) {
				this.image =  imageFile;
				if (this.player.options.accessToken) {
					this.player.getFileContents<Blob>({
						url: imageFile,
						options: {
							type: 'blob',
						},
						callback: (data) => {
							const dataURL = URL.createObjectURL(data as Blob);

							img.src = dataURL;

							if (this.sliderPopImage.style) {
								this.sliderPopImage.style.backgroundImage = `url('${dataURL}')`;
							}

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
					if(this.sliderPopImage.style) {
						this.sliderPopImage.style.backgroundImage = `url('${imageFile}')`;
					}

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

	
	createUiButton(parent: HTMLElement, icon: string) {

		const button = this.player.createElement('button', icon)
			.addClasses(this.makeStyles('buttonStyles'))
			.appendTo(parent);

		button.ariaLabel = this.buttons[icon]?.title;

		button.addEventListener('keypress', (event) => {
			if (event.key === 'Backspace') {
				button.blur();
				this.player.emit('show-menu', false);
			}
			if (event.key === 'Escape') {
				button.blur();
				this.player.emit('show-menu', false);
			}
		});

		return button;
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
	
	createSettingsButton(parent: HTMLDivElement, hovered = false) {
		if (!this.player.hasSpeeds() && !this.player.hasAudioTracks() && !this.player.hasCaptions()) return;

		const settingsButton = this.createUiButton(
			parent,
			'settings'
		);

		this.createSVGElement(settingsButton, 'settings', this.buttons.settings, false,  hovered);

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

		this.createSVGElement(seekBack, 'seekBack', this.buttons.seekBack, false, hovered);

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

		this.createSVGElement(seekForward, 'seekForward', this.buttons.seekForward, false, hovered);

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
		const highButton = this.createSVGElement(volumeButton, 'volumeHigh', this.buttons.volumeHigh, false,  hovered);

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
			volumeSlider.value = data.volume.toString();
		});

		this.player.on('mute', (data) => {
			this.volumeHandle(data, mutedButton, lowButton, mediumButton, highButton);
			if (data.muted) {
				volumeSlider.style.backgroundSize = `${0}% 100%`;
				volumeSlider.value = '0';
			} else {
				volumeSlider.style.backgroundSize = `${this.player.getVolume()}% 100%`;
				volumeSlider.value = this.player.getVolume().toString();
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

	getClosestSeekableInterval() {
		const scrubTime = this.player.getPosition();
		const intervals = this.previewTime;
		const interval = intervals.find((interval) => {
			return scrubTime >= interval.start && scrubTime < interval.end;
		})!;
		return interval?.start;
	}

	createPreviousButton(parent: HTMLDivElement, hovered = false) {
		if (this.player.isMobile()) return;

		const previousButton = this.createUiButton(
			parent,
			'previous'
		);
		previousButton.style.display = 'none';

		this.createSVGElement(previousButton, 'previous', this.buttons.previous, false,  hovered);

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

	createCaptionsButton(parent: HTMLElement, hovered = false) {
		const captionButton = this.createUiButton(
			parent,
			'subtitles'
		);
		captionButton.style.display = 'none';
		captionButton.ariaLabel = this.buttons.subtitles?.title;

		const offButton = this.createSVGElement(captionButton, 'subtitle', this.buttons.subtitlesOff, false, hovered);
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
			if (tracks.length > 1) {
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

		this.createSVGElement(audioButton, 'audio', this.buttons.languageOff, false,  hovered);

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

		const offButton = this.createSVGElement(qualityButton, 'low', this.buttons.quality, false,  hovered);
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

		this.createSVGElement(fullscreenButton, 'fullscreen', this.buttons.fullscreen, false,  hovered);
		this.createSVGElement(fullscreenButton, 'fullscreen-enabled', this.buttons.exitFullscreen, true, hovered);

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

		this.createSVGElement(playlistButton, 'playlist', this.buttons.playlist, false,  hovered);

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
	
	createBottomBar(parent: HTMLElement) {
		const bottomBar = this.player.createElement('div', 'bottom-bar')
			.addClasses(this.makeStyles('bottomBarStyles'))
			.appendTo(parent);

		this.player.createElement('div', 'bottom-bar-shadow')
			.addClasses(this.makeStyles('bottomBarShadowStyles'))
			.appendTo(bottomBar);

		return bottomBar;
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

	createSeekContainer(parent: HTMLElement) {

		const seekContainer = this.player.createElement('div', 'seek-container')
			.addClasses(this.makeStyles('seekContainerStyles'))
			.appendTo(parent);

		const seekScrollCloneContainer = this.player.createElement('div', 'seek-scroll-clone-container')
			.addClasses(this.makeStyles('seekScrollCloneStyles'))
			.appendTo(seekContainer);

		this.player.createElement('div', `thumbnail-clone-${1}`)
			.addClasses(this.makeStyles('thumbnailCloneStyles'))
			.appendTo(seekScrollCloneContainer);

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
				unique(this.thumbs.map(t => t.el), 'id')
					.forEach((thumb) => {
						seekScrollContainer.appendChild(thumb);
					});

				this.player.once('time', () => {
					this.currentScrubTime = this.getClosestSeekableInterval();
					this.player.emit('currentScrubTime', {
						...this.player.getTimeData(),
						currentTime: this.getClosestSeekableInterval(),
					});
				});
			});
		});

		this.player.on('lastTimeTrigger', () => {
			this.currentScrubTime = this.getClosestSeekableInterval();
			this.player.emit('currentScrubTime', {
				...this.player.getTimeData(),
				currentTime: this.getClosestSeekableInterval(),
			});
		});

		this.player.on('currentScrubTime', (data) => {
			if (data.currentTime <= 0) {
				data.currentTime = 0;
			} 
			else if (data.currentTime >= this.player.getDuration()) {
				data.currentTime = this.player.getDuration() - 10;
			}

			const thumb = this.thumbs.find((thumb) => {
				return data.currentTime >= thumb.time.start && data.currentTime <= thumb.time.end;
			});

			this.currentScrubTime = data.currentTime;

			if (!thumb) return;
			
			this.scrollIntoView(thumb.el);
		});

		this.player.on('show-seek-container', (value) => {
			if (value) {
				seekContainer.style.transform = 'none';

				this.player.pause();
			}
			else {
				this.seekContainer.style.transform = '';
			}
		});

		return seekContainer;
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

	createTopBar(parent: HTMLElement) {

		return this.player.createElement('div', 'top-bar')
			.addClasses(this.makeStyles('topBarStyles'))
			.appendTo(parent);
	}


	createLanguageMenuButton(parent: HTMLDivElement, data: {
		language: string,
		label: string,
		type: string,
		id: number,
		styled?: boolean;
		buttonType: string;
	}, hovered = false
	) {

		const languageButton = this.player.createElement('button', `${data.type}-button-${data.language}`)
			.addClasses([
				'language-button',
				'w-available',
				'mr-auto',
				'h-8',
				'px-1',
				'py-2',
				'flex',
				'items-center',
				'rounded',
				'snap-center',
				'outline-transparent',
				'outline',
				'whitespace-nowrap',
				'hover:bg-neutral-600/50',
				'transition-all',
				'duration-100',
				'outline-1',
				'outline-solid',
				'focus-visible:outline-2',
				'focus-visible:outline-white',
				'active:outline-white',
			])
			.appendTo(parent);

		const languageButtonText = this.player.createElement('span', 'menu-button-text')
			.addClasses([
				'menu-button-text',
				'cursor-pointer',
				'font-semibold',
				'pl-2',
				'flex',
				'gap-2',
				'leading-[normal]',
			])
			.appendTo(languageButton);

		if (data.buttonType == 'subtitle') {
			if (data.styled) {
				languageButtonText.textContent = `${this.player.localize(data.language ?? '')} ${this.player.localize(data.label)} ${this.player.localize('styled')}`;
			} else if (data.language == '') {
				languageButtonText.textContent = this.player.localize(data.label);
			} else {
				languageButtonText.textContent = `${this.player.localize(data.language ?? '')} (${this.player.localize(data.type)})`;
			}
		} else {
			languageButtonText.textContent = this.player.localize(data.language);
		}

		const chevron = this.createSVGElement(languageButton, 'checkmark', this.buttons.checkmark, false,  hovered);
		this.player.addClasses(chevron, ['ml-auto']);

		if (data.id > 0) {
			chevron.classList.add('hidden');
		}

		if (data.buttonType == 'audio') {
			this.player.on('audioTrackChanging', (audio) => {
				if (data.id === audio.id) {
					chevron.classList.remove('hidden');
				} else {
					chevron.classList.add('hidden');
				}
			});

			languageButton.addEventListener('click', (event) => {
				event.stopPropagation();
				this.player.setCurrentAudioTrack(data.id);
				this.player.emit('show-menu', false);
			});
		} 
		else if (data.buttonType == 'subtitle') {
			if (data.id === this.player.getCaptionIndex()) {
				chevron.classList.remove('hidden');
			} else {
				chevron.classList.add('hidden');
			}

			this.player.on('captionsChanged', (track) => {
				if (data.id === track.id) {
					chevron.classList.remove('hidden');
				} else {
					chevron.classList.add('hidden');
				}
			});

			languageButton.addEventListener('click', (event) => {
				event.stopPropagation();
				this.player.setCurrentCaption(data.id);
				this.player.emit('show-menu', false);
			});
		}

		languageButton.addEventListener('keypress', (e) => {
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

		languageButton.addEventListener('focus', () => {
			setTimeout(() => {
				this.scrollCenter(languageButton, parent, {
					duration: 100,
					margin: 1,
				});
			}, 0);
		});

		return languageButton;
	}

	getLanguageButtonText(languageButton: HTMLButtonElement,  data: {
		language: string,
		label: string,
		type: string,
		id: number,
		styled?: boolean;
		buttonType: string;
	}
	){
		const languageButtonText =this.player.createElement('span', 'menu-button-text')
			.addClasses([
				'menu-button-text',
				'cursor-pointer',
				'font-semibold',
				'pl-2',
				'flex',
				'gap-2',
				'leading-[normal]',
			])
			.appendTo(languageButton);

		if (data.buttonType == 'subtitle') {
			if (data.styled) {
				languageButtonText.textContent = `${this.player.localize(data.language ?? '')} ${this.player.localize(data.label)} ${this.player.localize('styled')}`;
			} else if (data.language == '') {
				languageButtonText.textContent = this.player.localize(data.label);
			} else {
				languageButtonText.textContent = `${this.player.localize(data.language ?? '')} (${this.player.localize(data.type)})`;
			}
		} else {
			languageButtonText.textContent = this.player.localize(data.language);
		}
		
		return languageButtonText;
	}

	createThumbnail(time: PreviewTime) {
		const thumbnail = this.player.createElement('div', `thumbnail-${time.start}`)
			.addClasses([
				'w-1/5',
				'h-auto',
				'object-cover',
				'aspect-video',
				'snap-center',
			])
			.get();

		thumbnail.style.backgroundImage = `url('${this.image}')`;
		thumbnail.style.backgroundPosition = `-${time.x}px -${time.y}px`;
		thumbnail.style.width = `${time.w}px`;
		thumbnail.style.minWidth = `${time.w}px`;
		thumbnail.style.height = `${time.h}px`;
		
		return thumbnail;
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

	scrollCenter(el: HTMLElement, container: HTMLElement, options?: {
		duration?: number;
		margin?: number;
	}) {
		if (!el) return;

		const scrollDuration = options?.duration || 60;
		const margin = options?.margin || 1.5;

		const elementTop = (el.getBoundingClientRect().top) + (el!.getBoundingClientRect().height / 2) - (container.getBoundingClientRect().height / margin);

		const startingY = container.scrollTop;
		const startTime = performance.now();

		function scrollStep(timestamp: number) {
			const currentTime = timestamp - startTime;
			const progress = Math.min(currentTime / scrollDuration, 1);

			container.scrollTo(0, Math.floor(startingY + (elementTop * progress)));

			if (currentTime < scrollDuration) {
				requestAnimationFrame(scrollStep);
			}
		}

		requestAnimationFrame(scrollStep);
	};

}

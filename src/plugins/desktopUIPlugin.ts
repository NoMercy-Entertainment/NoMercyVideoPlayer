import type { Chapter, PlaylistItem, Position } from '../index.d';
import { Icon } from './UIPlugin/buttons';
import {humanTime, limitSentenceByCharacters, lineBreakShowTitle, unique} from '../helpers';
import {BaseUIPlugin} from "./UIPlugin/baseUIPlugin";

export class DesktopUIPlugin extends BaseUIPlugin {
	topBar: HTMLDivElement = <HTMLDivElement>{};
	bottomRow: HTMLDivElement = <HTMLDivElement>{};
	frame: HTMLDivElement = <HTMLDivElement>{};

	isMouseDown = false;
	pipEnabled = false;

	bottomBar: HTMLDivElement = <HTMLDivElement>{};
	topRow: HTMLDivElement = <HTMLDivElement>{};

	tooltip: HTMLDivElement = <HTMLDivElement>{};

	menuButtonTextStyles =  [
		'menu-button-text',
		'cursor-pointer',
		'font-semibold',
		'pl-2',
		'flex',
		'gap-2',
		'leading-[normal]',
	];

	languageMenuStyles = [
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
		'duration-200',
		'outline-1',
		'outline-solid',
		'focus-visible:outline-2',
		'focus-visible:outline-white',
		'active:outline-white',
	];

	use() {

		this.topBar = this.createTopBar(this.overlay);
		
		this.createBackButton(this.topBar);
		this.createCloseButton(this.topBar);
		this.createDivider(this.topBar);

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

		this.player.addClasses(this.topRow, ['mt-4']);

		this.bottomRow = this.createBottomRow(this.bottomBar);

		this.createProgressBar(this.topRow);

		this.createPlaybackButton(this.bottomRow, true);

		this.createPreviousButton(this.bottomRow, true);

		this.createSeekBackButton(this.bottomRow, true);

		this.createSeekForwardButton(this.bottomRow, true);

		this.createNextButton(this.bottomRow, true);

		this.createVolumeButton(this.bottomRow, true);

		this.createTime(this.bottomRow, 'current', ['ml-2']);
		this.createDivider(this.bottomRow);
		this.createTime(this.bottomRow, 'remaining', ['mr-2']);

		this.createTheaterButton(this.bottomRow, true);
		this.createPIPButton(this.bottomRow, true);

		this.createPlaylistsButton(this.bottomRow, true);

		this.createSpeedButton(this.bottomRow, true);
		this.createCaptionsButton(this.bottomRow, true);
		this.createAudioButton(this.bottomRow, true);
		this.createQualityButton(this.bottomRow, true);
		this.createSettingsButton(this.bottomRow, true);

		this.createFullscreenButton(this.bottomRow, true);

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
		} 
		while ((obj = Object.getPrototypeOf(obj)) !== null);
	}
	
	createTopRow(parent: HTMLDivElement) {
		return this.player.createElement('div', 'top-row')
			.addClasses([
				'top-row',
				'flex',
				'gap-1',
				'h-2',
				'items-center',
				'pl-2',
				'pr-2',
				'relative',
				'w-available',
			])
			.appendTo(parent);
	}

	createBottomRow(parent: HTMLDivElement) {
		return this.player.createElement('div', 'bottom-row')
			.addClasses([
				'bottom-row',
				'flex',
				'h-10',
				'mb-2',
				'p-1',
				'px-4',
				'items-center',
				'relative',
				'w-available',
			])
			.appendTo(parent);
	}

	eventHandlers() {
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

		this.player.on('back-button', () => {
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
	}

	createCenter(parent: HTMLElement) {

		const center = this.player.createElement('div', 'center')
			.addClasses([
				'center',
				'absolute',
				'grid',
				'grid-cols-3',
				'grid-rows-6',
				'h-full',
				'w-full',
				'z-0',

				'transition-all',
				'duration-300',

				'bg-transparent',
				'group-[&.nomercyplayer.buffering]:bg-gradient-circle-c',
				'group-[&.nomercyplayer.error]:bg-gradient-circle-c',
				'group-[&.nomercyplayer.paused]:bg-gradient-circle-c',
				'from-black/50',
				'from-15%',
				'via-60%',
				'via-black/30',
				'to-100%',
				'to-black/0',
			])
			.appendTo(parent);

		this.createSpinnerContainer(center);

		if (this.player.isMobile()) {
			this.createTouchSeekBack(center, { x: { start: 1, end: 1 }, y: { start: 2, end: 6 } });
			this.createTouchPlayback(center, { x: { start: 2, end: 2 }, y: { start: 3, end: 5 } });
			this.createTouchSeekForward(center, { x: { start: 3, end: 3 }, y: { start: 2, end: 6 } });
			this.createTouchVolUp(center, { x: { start: 2, end: 2 }, y: { start: 1, end: 3 } });
			this.createTouchVolDown(center, { x: { start: 2, end: 2 }, y: { start: 5, end: 7 } });
		}
		else {
			this.createTouchSeekBack(center, { x: { start: 1, end: 2 }, y: { start: 2, end: 6 } });
			this.createTouchPlayback(center, { x: { start: 2, end: 3 }, y: { start: 2, end: 6 } });
			this.createTouchSeekForward(center, { x: { start: 3, end: 4 }, y: { start: 2, end: 6 } });
		}

		return center;

	}

	createTouchSeekBack(parent: HTMLElement, currentTime: Position) {
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
		this.player.addClasses(touchPlayback, [
			'touch-playback',
			'flex',
			'-ml-2',
			'items-center',
			'justify-center',
		]);

		['click'].forEach((event) => {
			touchPlayback.addEventListener(event, this.doubleTap(
				() => this.player.getFullscreen(),
				() => {
					(this.controlsVisible || !this.player.options.disableTouchControls) && this.player.togglePlayback();
				}
			));
		});

		const playButton = this.createSVGElement(touchPlayback, 'bigPlay', this.buttons.bigPlay, false,  hovered);
		this.player.addClasses(playButton, [
			'touch-playback-button',
			'pointer-events-none',
			'fill-white',
			'hidden',
		]);

		this.player.on('ready', () => {
			playButton.style.display = 'flex';
		});
		this.player.on('pause', () => {
			playButton.style.display = 'flex';
		});

		this.player.on('play', () => {
			playButton.style.display = 'none';
		});
		this.player.on('firstFrame', () => {
			playButton.style.display = 'none';
		});

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
			.addClasses([`touch-box-${id}`, 'z-40'])
			.appendTo(parent);

		touch.style.gridColumnStart = currentTime.x.start.toString();
		touch.style.gridColumnEnd = currentTime.x.end.toString();
		touch.style.gridRowStart = currentTime.y.start.toString();
		touch.style.gridRowEnd = currentTime.y.end.toString();

		parent.appendChild(touch);

		return touch;

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

		this.createSVGElement(speedButton, 'speed', this.buttons.speed, false, hovered);

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

		this.createSVGElement(pipButton, 'pip-enter', this.buttons.pipEnter, false, hovered);
		this.createSVGElement(pipButton, 'pip-exit', this.buttons.pipExit, true, hovered);

		document.addEventListener('visibilitychange', () => {
			if (this.pipEnabled) {
				if (document.hidden) {
					if (document.pictureInPictureEnabled) {
						this.player.getVideoElement().requestPictureInPicture();
					}
				} else if (document.pictureInPictureElement) {
					document.exitPictureInPicture().then();
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
			.addClasses([
				'group-[&.nomercyplayer:has(.open)]:backdrop:bg-black/60',
				'group-[&.nomercyplayer:has(.open)]:backdrop:pointer-events-none',
			])
			.appendTo(parent);

		this.menuFrame.setAttribute('popover', 'manual');
		this.menuFrame.setAttribute('role', 'modal');

		const menuWrapper = this.player.createElement('div', 'menu-wrapper')
			.addClasses([
				'menu-wrapper',

			])
			.appendTo(this.menuFrame);

		const menuFrame = this.player.createElement('div', 'menu-frame')
			.addClasses([
				'menu-frame',
				'flex-col',
				'hidden',
				'absolute',
				'inset-4',
				'w-fit',
				'h-available',
				'z-50',
				'max-h-[calc(100%-2rem)]',
				'max-w-[min(70rem,calc(100%-2rem))]',
				'overflow-clip',
				'justify-self-end',
				'rounded-lg',
			])
			.appendTo(menuWrapper);

		this.sizeMenuFrame();

		const menuContent = this.player.createElement('div', 'menu-content')
			.addClasses([
				'menu-content',
				'flex',
				'justify-end',
				'flex-row',
				'overflow-clip',
				'w-full',
				'h-available',
				'mt-auto',
			])
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
			menuContent.classList.add('translate-x-0');
			// menuContent.classList.remove('-translate-x-[50%]');
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
				menuContent.classList.add('translate-x-0');
				// menuContent.classList.remove('-translate-x-[50%]');
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
				menuContent.classList.remove('translate-x-0');
				// menuContent.classList.add('-translate-x-[50%]');
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
				menuContent.classList.remove('translate-x-0');
				// menuContent.classList.add('-translate-x-[50%]');
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
				menuContent.classList.remove('translate-x-0');
				// menuContent.classList.add('-translate-x-[50%]');
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
				menuContent.classList.remove('translate-x-0');
				// menuContent.classList.add('-translate-x-[50%]');
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
				menuContent.classList.remove('translate-x-0');
				// menuContent.classList.add('-translate-x-[50%]');
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
			width,
			height,
			top,
			bottom,
			left,
		} = this.player.getElement().getBoundingClientRect();

		(this.menuFrame.firstChild as HTMLDivElement).style.width = `${width}px`;
		(this.menuFrame.firstChild as HTMLDivElement).style.height = `${height}px`;
		(this.menuFrame.firstChild as HTMLDivElement).style.top = `${top}px`;
		(this.menuFrame.firstChild as HTMLDivElement).style.bottom = `${bottom}px`;
		(this.menuFrame.firstChild as HTMLDivElement).style.left = `${left}px`;
		(this.menuFrame.firstChild as HTMLDivElement).style.padding = '2rem';
		(this.menuFrame.firstChild as HTMLDivElement).style.position = 'fixed';
		// (this.menuFrame.firstChild as HTMLDivElement).style.background = 'red';
	}

	createMainMenu(parent: HTMLDivElement) {

		this.mainMenu = this.player.createElement('div', 'main-menu')
			.addClasses([
				'main-menu',
				'bg-neutral-900/95',
				'flex',
				'flex-col',
				'gap-1',
				'group-[&.nomercyplayer:has(.sub-menu-open)]:!hidden',
				'h-auto',
				'max-h-full',
				'min-w-64',
				'mt-auto',
				'overflow-clip',
				'p-2',
				'pt-0',
				'rounded-lg',
			])
			.appendTo(parent);

		this.mainMenu.style.transform = 'translateX(0)';

		const mainHeader = this.createMainMenuHeader(this.mainMenu, '');
		mainHeader.classList.add('!min-h-[2rem]', '-mr-1');

		this.player.addClasses(this.mainMenu, [
			'main-menu',
			'bg-neutral-900/95',
			'flex',
			'flex-col',
			'gap-1',
			'group-[&.nomercyplayer:has(.sub-menu-open)]:!hidden',
			'h-auto',
			'max-h-full',
			'min-w-64',
			'mt-auto',
			'overflow-clip',
			'p-2',
			'pt-0',
			'rounded-lg',
		]);

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
			.addClasses([
				'sub-menu',
				'bg-neutral-900/95',
				'flex-col',
				'gap-1',
				'h-auto',
				'w-full',
				'mt-auto',
				'overflow-clip',
				'rounded-lg',
				'max-h-full',
				'min-w-64',
				'hidden',
				'group-[&.nomercyplayer:has(.sub-menu-open)]:flex',
			])
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
			.addClasses([
				'menu-header',
				'flex',
				'h-9',
				'items-center',
				'min-h-[2.5rem]',
				'py-2',
				'text-white',
				'w-available',
			])
			.addClasses(['border-b', 'border-gray-300/20', '!p-0'])
			.appendTo(parent);

		const close = this.createUiButton(
			menuHeader,
			'close'
		);

		this.createSVGElement(close, 'menu', this.buttons.close, hovered);
		this.player.addClasses(close, ['ml-auto', 'w-8']);
		close.classList.remove('w-5');

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
			.addClasses([
				'menu-header',
				'flex',
				'h-9',
				'items-center',
				'min-h-[2.5rem]',
				'py-2',
				'text-white',
				'w-available',
			])
			.addClasses(['border-b', 'border-gray-300/20'])
			.appendTo(parent);

		if (title !== 'Episodes') {
			const back = this.createUiButton(
				menuHeader,
				'back'
			);
			this.createSVGElement(back, 'menu', this.buttons.chevronL, hovered);
			this.player.addClasses(back, ['w-8']);
			back.classList.remove('w-5');

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
			.addClasses([
				'menu-header-button-text',
				'font-semibold',
				'leading-[normal]',
				'pl-2',
			])
			.appendTo(menuHeader);

		menuButtonText.innerText = this.player.localize(title).toTitleCase();

		// if (title == 'playlist') {
		// 	this.player.createDropdown(menuHeader, title, `${this.player.localize('Season')} ${this.player.playlistItem().season}`);
		// }

		if (title !== 'Seasons') {
			const close = this.createUiButton(
				menuHeader,
				'close'
			);

			this.createSVGElement(close, 'menu', this.buttons.close, hovered);
			this.player.addClasses(close, ['ml-auto', 'w-8']);
			close.classList.remove('w-5');

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
			.addClasses(this.languageMenuStyles)
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
			.addClasses(this.menuButtonTextStyles)
			.appendTo(menuButton);

		menuButtonText.innerText = this.player.localize(item).toTitleCase();

		const chevron = this.createSVGElement(menuButton, 'menu', this.buttons.chevronR, false, hovered);
		this.player.addClasses(chevron, ['ml-auto']);

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
		} 
		else if (item === 'subtitles') {
			this.player.on('item', () => {
				menuButton.style.display = 'none';
			});
			this.player.on('captionsList', (captions) => {
				if (captions.length > 1) {
					menuButton.style.display = 'flex';
				} else {
					menuButton.style.display = 'none';
				}
			});
		} 
		else if (item === 'quality') {
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
		} 
		else if (item === 'playlist') {
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
					language: track.language!,
					label: track.label!,
					type: 'audio',
					id: track.id!,
					buttonType: 'audio',
				});
			});
		});

		this.player.on('show-language-menu', (showing) => {
			if (showing) {
				languageMenu.style.display = 'flex';

				setTimeout(() => {
					(scrollContainer.firstChild as HTMLButtonElement).focus();
				}, 200);
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
					language: track.language!,
					label: track.label!,
					type: track.type!,
					id: track.id!,
					buttonType: 'subtitle',
				});
			});
		});

		this.player.on('show-subtitles-menu', (showing) => {
			if (showing) {
				subtitleMenu.style.display = 'flex';

				setTimeout(() => {
					(scrollContainer.firstChild as HTMLButtonElement).focus();
				}, 200);
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
				.addClasses(this.languageMenuStyles)
				.appendTo(scrollContainer);

			const speedButtonSpan = this.player.createElement('span', `menu-button-text-${speed}`)
				.appendTo(speedButton);

			const speedButtonText = this.player.createElement('span', `menu-button-text-${speed}`)
				.addClasses(this.makeStyles('speedButtonTextStyles'))
				.appendTo(speedButtonSpan);

			speedButtonText.innerText = speed == 1 ? this.player.localize('Normal') : speed.toString();

			const chevron = this.createSVGElement(speedButton, 'menu', this.buttons.checkmark, false, hovered);
			this.player.addClasses(chevron, [
				'ml-auto',
				'hidden',
			]);

			this.player.on('speed', (event) => {
				if (event === speed) {
					chevron.classList.remove('hidden');
				} else {
					chevron.classList.add('hidden');
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

				setTimeout(() => {
					(scrollContainer.firstChild as HTMLButtonElement).focus();
				}, 200);
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
			.addClasses(this.languageMenuStyles)
			.appendTo(parent);

		const qualityButtonText = this.player.createElement('span', 'menu-button-text')
			.addClasses(this.menuButtonTextStyles)
			.appendTo(qualityButton);

		qualityButtonText.innerText = `${this.player.localize((data.label)
			?.replace('segment-metadata', 'Off'))}`;

		const chevron = this.createSVGElement(qualityButton, 'checkmark', this.buttons.checkmark, false, hovered);
		this.player.addClasses(chevron, ['ml-auto']);

		if (data.id > 0) {
			chevron.classList.add('hidden');
		}

		this.player.on('levelsChanging', (level) => {
			if (level.id == data.id) {
				chevron.classList.remove('hidden');
			} else {
				chevron.classList.add('hidden');
			}
		});

		qualityButton.addEventListener('click', (event) => {
			event.stopPropagation();

			this.player.setCurrentQuality(data.id);

			this.player.emit('show-menu', false);
		});

		return qualityButton;
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
				text.innerText = `${Math.abs(val)} ${this.player.localize('seconds')}`;
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
				text.innerText = `${Math.abs(val)} ${this.player.localize('seconds')}`;
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
				sliderText.innerText = humanTime(scrubTime.scrubTimePlayer);

				const sliderPopOffsetX = this.getSliderPopOffsetX(sliderPop, scrubTime);
				sliderPop.style.left = `${sliderPopOffsetX}%`;

				if (!this.player.options.chapters || this.player.getChapters()?.length == 0) {
					sliderHover.style.width = `${scrubTime.scrubTime}%`;
				}

				if (!this.isMouseDown) return;

				chapterText.innerText = this.getChapterText(scrubTime.scrubTimePlayer) ?? '';
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
			sliderText.innerText = humanTime(scrubTime.scrubTimePlayer);
			chapterText.innerText = this.getChapterText(scrubTime.scrubTimePlayer) ?? '';
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
			this.sliderBar.classList.add('bg-white/20');
			this.previewTime = [];
			this.chapters = [];
			sliderBuffer.style.width = '0';
			sliderProgress.style.width = '0';
			this.fetchPreviewTime();
		});

		this.player.on('chapters', () => {
			if (this.player.getChapters()?.length > 0 && !this.player.isTv()) {
				this.sliderBar.classList.remove('bg-white/20');
			} else {
				this.sliderBar.classList.add('bg-white/20');
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
			this.chapterBar.classList.add('bg-white/20');
			element.remove();
		});
		this.player.getChapters()?.forEach((chapter: Chapter) => {
			this.createChapterMarker(chapter);
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

	createEpisodeMenu(parent: HTMLDivElement) {
		if (!this.player.getVideoElement())	return;

		const playlistMenu = this.player.createElement('div', 'playlist-menu')
			.addClasses([
				...this.makeStyles('subMenuContentStyles'),
				'!flex-row',
				'!gap-0',
			])
			.appendTo(parent);

		playlistMenu.style.minHeight = `${parseInt(getComputedStyle(this.player.getVideoElement()).height.split('px')[0], 10) * 0.8}px`;

		this.player.on('resize', () => {
			playlistMenu.style.minHeight = `${parseInt(getComputedStyle(this.player.getVideoElement()).height.split('px')[0], 10) * 0.8}px`;
		});

		const subMenu = this.player.createElement('div', 'sub-menu-content')
			.addClasses([
				...this.makeStyles('subMenuContentStyles'),
				'!flex',
				'!w-1/3',
				'border-r-2',
				'border-gray-500/20',
			])
			.appendTo(playlistMenu);

		this.createMenuHeader(subMenu, 'Seasons');

		const seasonScrollContainer = this.player.createElement('div', 'playlist-scroll-container')
			.addClasses(this.makeStyles('scrollContainerStyles'))
			.appendTo(subMenu);
		seasonScrollContainer.style.transform = 'translateX(0)';

		seasonScrollContainer.innerHTML = '';
		for (const [, item] of unique(this.player.getPlaylist(), 'season').entries() ?? []) {
			this.createSeasonMenuButton(seasonScrollContainer, item);
		}

		const episodeMenu = this.player.createElement('div', 'episode-menu')
			.addClasses([
				...this.makeStyles('subMenuContentStyles'),
				'!flex',
				'!w-[63rem]',
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
		if (!item?.season) return;
		
		const seasonButton = this.player.createElement('button', `season-${item.id}`)
			.addClasses(this.languageMenuStyles)
			.appendTo(parent);

		const buttonSpan = this.player.createElement('span', `season-${item.id}-span`)
			.addClasses(this.menuButtonTextStyles)
			.appendTo(seasonButton);

		buttonSpan.innerText = item?.seasonName 
			? item?.seasonName 
			: item?.season 
				? this.player.localize('Season') + ` ${item?.season}`
				: '';

		const chevron = this.createSVGElement(seasonButton, 'menu', this.buttons.chevronR, false, hovered);
		this.player.addClasses(chevron, ['ml-auto']);

		seasonButton.addEventListener('click', () => {
			this.player.emit('switch-season', item?.season);
		});

		seasonButton.addEventListener('focus', () => {
			setTimeout(() => {
				this.scrollCenter(seasonButton, parent, {
					duration: 100,
					margin: 1,
				});
			}, 50);
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
		image.src = item.image && item.image != '' ? `${this.imageBaseUrl.includes('https') ? '' : this.imageBaseUrl}${item.image}` : '';
		
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
			sliderContainer.style.display = 'flex';
		}

		const episodeMenuButtonRightSide = this.player.createElement('div', `episode-${item.id}-right-side`)
			.addClasses(this.makeStyles('episodeMenuButtonRightSideStyles'))
			.appendTo(button);

		const episodeMenuButtonTitle = this.player.createElement('span', `episode-${item.id}-title`)
			.addClasses(this.makeStyles('episodeMenuButtonTitleStyles'))
			.appendTo(episodeMenuButtonRightSide);

		if (item.episode) {
		episodeMenuButtonTitle.innerText = lineBreakShowTitle(item.title?.replace(item.show ?? '', '').replace('%S', this.player.localize('S'))
			.replace('%E', this.player.localize('E')));
		}

		const episodeMenuButtonOverview = this.player.createElement('span', `episode-${item.id}-overview`)
			.addClasses(this.makeStyles('episodeMenuButtonOverviewStyles'))
			.appendTo(episodeMenuButtonRightSide);
		episodeMenuButtonOverview.innerText = limitSentenceByCharacters(item.description, 600);

		this.player.on('item', (playlistItem) => {
			if (playlistItem.season == item.season) {
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
			} 
			else {
				button.style.display = 'none';
			}
		});

		this.player.on('time', (data) => {
			if (this.player.playlistItem()?.id == item.id) {
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

		button.addEventListener('focus', () => {
			setTimeout(() => {
				this.scrollCenter(button, parent, {
					duration: 100,
					margin: 1,
				});
			}, 50);
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
				this.tooltip.classList.add('top-0');
				this.tooltip.classList.remove('bottom-0');
			} else {
				this.tooltip.classList.remove('top-0');
				this.tooltip.classList.add('bottom-0');
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
		header.innerText = `${this.player.localize(`${direction.toTitleCase()} Episode`)} ${this.getButtonKeyCode(direction)}`;
		title.innerText = item.title?.replace(item.show ?? '', '').replace('%S', this.player.localize('S'))
			.replace('%E', this.player.localize('E'));

		this.player.once('item', () => {
			this.getTipData({ direction, header, title, image });
		});
	}

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

}

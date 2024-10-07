import { BaseUIPlugin } from './UIPlugin/baseUIPlugin';
import { breakLogoTitle, limitSentenceByCharacters, lineBreakShowTitle, nearestValue } from '../helpers';
import { Icon } from './UIPlugin/buttons';
import { PlaylistItem } from '../index.d';

export class TVUIPlugin extends BaseUIPlugin {

	preScreen: HTMLDialogElement = <HTMLDialogElement>{};
	episodeScreen: HTMLDialogElement = <HTMLDialogElement>{};
	languageScreen: HTMLDialogElement = <HTMLDialogElement>{};

	selectedSeason: number | undefined;

	tvDialogStyles = [
		'w-available',
		'h-available',
		'max-w-available',
		'max-h-available',
		'',
	];

	use() {
		this.player.container.style.display = 'contents';

		this.createTvOverlay(this.player.overlay);

		this.createPreScreen(this.player.overlay);

		this.createEpisodeScreen(this.player.overlay);

		this.createLanguageScreen(this.player.overlay);

		if (!this.player.options.autoPlay) {
			this.showPreScreen();
		}

		this.player.on('play', () => {
			this.player.emit('show-seek-container', false);
			this.player.getVideoElement().scrollIntoView();
			this.closePreScreen();
			this.closeEpisodeScreen();
			this.closeLanguageScreen();
		});

		this.player.on('back-button', this.backMenu.bind(this));

		document.addEventListener('keypress', (e) => {
			// back button
			if (e.key == 'Backspace') {
				this.backMenu();
			}
			if (e.key == 'ArrowUp') {
				this.player.ui_resetInactivityTimer();
			}
			if (e.key == 'ArrowDown') {
				this.player.ui_resetInactivityTimer();
			}
			if (e.key == 'ArrowLeft') {
				this.player.ui_resetInactivityTimer();
			}
			if (e.key == 'ArrowRight') {
				this.player.ui_resetInactivityTimer();
			}
		});

		this.player.on('pause', () => {
			// this.showPreScreen();
		});
	}

	backMenu() {
		if (this.player.isTv() && this.currentMenu !== 'seek') {
			if (this.player.container.classList.contains('episode-screen')) {
				this.closeEpisodeScreen();
			} else if (this.player.container.classList.contains('language-screen')) {
				this.closeLanguageScreen();
			} else if (this.player.container.classList.contains('pre-screen')) {
				this.player.emit('back');
			} else {
				this.player.pause();
				this.showPreScreen();
			}
		}
	}

	createTvOverlay(parent: HTMLElement) {

		const tvOverlay = this.player.createElement('div', 'tv-overlay')
			.addClasses([
				'absolute',
				'flex',
				'flex-col',
				'justify-end',
				'gap-4',
				'w-available',
				'h-available',
				'z-0',
			])
			.addClasses(['group-[&.nomercyplayer.paused.pre-screen]:hidden'])
			.appendTo(parent);

		const topBar = this.createTopBar(tvOverlay);
		this.player.addClasses(topBar, [
			'px-10',
			'pt-10',
			'z-0',
		]);

		const backButton = this.createBackButton(topBar, true);
		if (backButton) {
			this.player.addClasses(backButton, ['children:stroke-2']);
		}
		const restartButton = this.createRestartButton(topBar, true);
		this.player.addClasses(restartButton, ['children:stroke-2']);

		const nextButton = this.createNextButton(topBar, true);
		this.player.addClasses(nextButton, ['children:stroke-2']);

		this.createDivider(topBar);
		this.createTvCurrentItem(topBar);

		this.createOverlayCenterMessage(tvOverlay);

		this.createSpinnerContainer(tvOverlay);

		this.seekContainer = this.createSeekContainer(tvOverlay);

		const bottomBar = this.createBottomBar(tvOverlay);
		const bottomRow = this.player.createElement('div', 'bottom-row')
			.addClasses([
				'tv-bottom-row',
				'relative',
				'flex',
				'flex-row',
				'items-center',
				'gap-4',
				'mt-auto',
				'w-available',
				'px-20',
				'pb-10',
				'z-0',
			])
			.appendTo(bottomBar);

		this.createPlaybackButton(bottomRow, true);

		this.createTime(bottomRow, 'current', []);
		this.createTvProgressBar(bottomRow);
		this.createTime(bottomRow, 'remaining', ['mr-14']);

		this.createNextUp(tvOverlay);

		// this.player.on('active', (value) => {
		// 	if (value && this.currentMenu !== 'seek' && !this.controlsVisible) {
		// 		playbackButton.focus();
		// 	}
		// });

		this.player.on('playing', () => {
			if (this.currentMenu !== 'seek' && !this.controlsVisible) {
				this.playbackButton.focus();
			}
		});


		let activeButton = backButton ?? restartButton ?? nextButton;

		[backButton, restartButton, nextButton].forEach((button) => {
			button?.addEventListener('keypress', (e) => {
				if (e.key == 'ArrowDown') {
					if (this.nextUp.style.display == 'none') {
						this.playbackButton?.focus();
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
			button?.addEventListener('keypress', (e: KeyboardEvent) => {
				if (e.key == 'ArrowUp') {
					(activeButton || restartButton)?.focus();
				} else if (e.key == 'ArrowDown') {
					this.playbackButton.focus();
				} else if (e.key == 'ArrowLeft') {
					this.nextUp.firstChild?.focus();
				} else if (e.key == 'ArrowRight') {
					this.nextUp.lastChild?.focus();
				}
			});
		});

		[this.playbackButton].forEach((button) => {
			button?.addEventListener('keypress', (e) => {
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

		let didSlide: boolean = false;
		[this.player.getVideoElement(), tvOverlay].forEach((button) => {
			(button as unknown as HTMLButtonElement)?.addEventListener('keydown', (e: KeyboardEvent) => {
				if (e.key == 'ArrowLeft') {
					// eslint-disable-next-line max-len
					if ([backButton, restartButton, nextButton, this.nextUp.firstChild, this.nextUp.lastChild].includes(e.target as HTMLButtonElement)) {
						return;
					}
					e.preventDefault();

					this.player.emit('show-seek-container', true);

					if (this.shouldSlide) {
						this.currentScrubTime = this.getClosestSeekableInterval();
						this.shouldSlide = false;
					} else {
						const newScrubbTime = this.currentScrubTime - 10;
						didSlide = true;
						this.player.emit('currentScrubTime', {
							...this.player.getTimeData(),
							currentTime: newScrubbTime,
						});
					}

				}
				else if (e.key == 'ArrowRight') {
					// eslint-disable-next-line max-len
					if ([backButton, restartButton, nextButton, this.nextUp.firstChild, this.nextUp.lastChild].includes(e.target as HTMLButtonElement)) {
						return;
					}
					e.preventDefault();

					this.player.emit('show-seek-container', true);

					if (this.shouldSlide) {
						this.currentScrubTime = this.getClosestSeekableInterval();
						this.shouldSlide = false;
					} else {
						const newScrubTime = this.currentScrubTime + 10;
						didSlide = true;
						this.player.emit('currentScrubTime', {
							...this.player.getTimeData(),
							currentTime: newScrubTime,
						});
					}
				}
				else if (e.key == 'Enter') {
					if (Math.abs(this.currentScrubTime - this.player.getCurrentTime()) > 5 && didSlide) {
						console.log('seeking to', this.currentScrubTime);
						this.player.seek(this.currentScrubTime);
						didSlide = false;
					}
				}
			});
		});

		this.playbackButton.focus();

		return bottomBar;
	}

	showPreScreen() {
		this.preScreen.showModal();
		this.preScreen.querySelector<HTMLButtonElement>('.button-container>button')?.focus();
		setTimeout(() => {
			this.player.container.classList.add('pre-screen');
		}, 5);
	}

	closePreScreen() {
		this.preScreen.close();
		this.player.emit('hideControls');
		this.player.container.classList.remove('pre-screen');
	}

	createPreScreen(parent: HTMLElement) {

		this.preScreen = this.player.createElement('dialog', 'pre-screen-dialog')
			.addClasses(this.tvDialogStyles)
			.addClasses([
				'group-[&.nomercyplayer.paused:not(.open)]:backdrop:bg-black/80',
				'group-[&.nomercyplayer.paused:not(.open)]:backdrop:pointer-events-none',
			])
			.appendTo(parent);

		this.preScreen.setAttribute('popover', 'manual');
		this.preScreen.setAttribute('role', 'modal');

		const preScreen = this.player.createElement('div', 'pre-screen')
			.addClasses([
				'pre-screen',
				'absolute',
				'inset-0',
				'flex',
				'p-6',
				'text-white',
				'w-available',
				'h-available',
				'z-0',
			])
			.addClasses([
				'group-[&.nomercyplayer.paused.episode-screen]:hidden',
				'group-[&.nomercyplayer.paused.language-screen]:hidden',
			])
			.appendTo(this.preScreen);

		const leftSide = this.player.createElement('div', 'left-side')
			.addClasses([
				'flex',
				'flex-col',
				'justify-between',
				'items-center',
				'w-1/2',
				'h-available',
			])
			.appendTo(preScreen);

		const leftSideTop = this.createImageContainer(leftSide);

		const overviewContainer = this.player.createElement('div', 'title-container')
			.addClasses([
				'flex',
				'flex-col',
				'w-available',
				'h-available',
			])
			.appendTo(leftSideTop);

		const title = this.player.createElement('div', 'title')
			.addClasses([
				'flex',
				'text-white',
				'text-lg',
				'font-bold',
				'mx-2',
			])
			.appendTo(overviewContainer);

		const description = this.player.createElement('div', 'description')
			.addClasses([
				'text-left',
				'text-white',
				'text-sm',
				'line-clamp-4',
				'font-bold',
				'leading-5',
				'overflow-hidden',
				'mx-2',
			])
			.appendTo(overviewContainer);

		this.player.on('item', () => {
			title.innerHTML = this.player.playlistItem().title.replace(this.player.playlistItem().show ?? '', '').replace('%S', this.player.localize('S'))
				.replace('%E', this.player.localize('E'));
			description.innerHTML = this.player.playlistItem().description;
		});

		const buttonContainer = this.player.createElement('div', 'button-container')
			.addClasses([
				'button-container',
				'flex',
				'flex-col',
				'gap-3',
				'w-available',
				'h-1/2',
				'mt-7',
				'mb-3',
				'overflow-auto',
				'px-2',
				'py-0.5',
				'[*::-webkit-scrollbar]:hidden',
			])
			.appendTo(leftSide);

		this.createTvButton(buttonContainer, 'play', 'Resume', this.player.play, this.buttons.play);

		this.createTvButton(buttonContainer, 'restart', 'Play from beginning', this.player.restart, this.buttons.restart);

		const episodeMenuButton = this.createTvButton(buttonContainer, 'showEpisodeMenu', 'Episodes', () => this.player.emit('showEpisodeScreen'), this.buttons.playlist);

		episodeMenuButton.style.display = 'none';

		episodeMenuButton.addEventListener('click', () => {
			this.player.emit('switch-season', this.player.playlistItem().season);
			this.showEpisodeScreen();
		});

		const languageMenuButton = this.createTvButton(buttonContainer, 'showLanguageMenu', 'Audio and subtitles', () => this.player.emit('showLanguageScreen'), this.buttons.language);

		languageMenuButton.style.display = 'none';

		languageMenuButton.addEventListener('click', () => {
			this.showLanguageScreen();
		});

		// this.createTvButton(buttonContainer, 'showQualityMenu', 'Qualities', () => this.player.emit('showQualityScreen'),
		// 	this.buttons.quality);

		this.player.createElement('div', 'pre-screen-right-side')
			.addClasses([
				'flex',
				'flex-col',
				'justify-center',
				'w-1/3',
				'h-available',
			])
			.appendTo(preScreen);

		this.player.on('audioTracks', () => {
			if (this.player.hasAudioTracks() || this.player.hasCaptions()) {
				languageMenuButton.style.display = 'flex';
			} else {
				languageMenuButton.style.display = 'none';
			}
		});

		this.player.on('item', () => {
			if (this.player.getPlaylist().length > 1) {
				episodeMenuButton.style.display = 'flex';
			} else {
				episodeMenuButton.style.display = 'none';
			}
		});
	}

	showEpisodeScreen() {
		this.episodeScreen.showModal();
		this.player.container.classList.add('episode-screen');
		this.player.container.classList.add('open');
		this.episodeScrollContainer.querySelector<HTMLButtonElement>('.button-container>button')?.focus();
	}

	closeEpisodeScreen() {
		this.episodeScreen.close();
		this.player.container.classList.remove('episode-screen');
		this.player.container.classList.remove('open');
		this.preScreen.querySelector<HTMLButtonElement>('.button-container>button')?.focus();
	}

	createEpisodeScreen(parent: HTMLElement) {

		this.episodeScreen = this.player.createElement('dialog', 'episode-screen-dialog')
			.addClasses(this.tvDialogStyles)
			.addClasses([
				'group-[&.nomercyplayer.paused.episode-screen]:backdrop:bg-black/80',
				'group-[&.nomercyplayer.paused.episode-screen]:backdrop:pointer-events-none',
			])
			.appendTo(parent);

		this.episodeScreen.setAttribute('popover', 'manual');
		this.episodeScreen.setAttribute('role', 'modal');


		const episodeScreen = this.player.createElement('div', 'episode-screen')
			.addClasses([
				'episode-screen',
				'absolute',
				'inset-0',
				'flex',
				'gap-4',
				'p-6',
				'text-white',
				'w-available',
				'h-available',
				'z-0',
			])
			.appendTo(this.episodeScreen);

		const leftSide = this.player.createElement('div', 'episode-screen-left-side')
			.addClasses([
				'flex',
				'flex-col',
				'justify-between',
				'items-center',
				'w-2/5',
				'h-available',
			])
			.appendTo(episodeScreen);

		this.createImageContainer(leftSide);

		const seasonButtonContainer = this.player.createElement('div', 'season-button-container')
			.addClasses([
				'flex',
				'flex-col',
				'gap-3',
				'w-available',
				'h-1/2',
				'mt-7',
				'mb-3',
				'overflow-auto',
				'px-2',
				'py-0.5',
				'[*::-webkit-scrollbar]:hidden',
			])
			.appendTo(leftSide);

		this.player.once('playlist', () => {

			let lastSeasonButton: HTMLButtonElement = <HTMLButtonElement>{};
			for (const season of this.player.getSeasons()) {
				lastSeasonButton = this.createTvSeasonButton(
					seasonButtonContainer,
					`season-${season.season}`,
					season,
					() => this.player.emit('switch-season', season.season)
				);
			}

			lastSeasonButton.addEventListener?.('keypress', (e) => {
				if (e.key == 'ArrowLeft') {
					//
				} else if (e.key == 'ArrowRight') {
					//
				} else if (e.key == 'ArrowUp' && !this.player.options.disableTouchControls) {
					//
				} else if (e.key == 'ArrowDown' && !this.player.options.disableTouchControls) {
					(lastSeasonButton.nextElementSibling as HTMLButtonElement)?.focus();
					const el = (lastSeasonButton.nextElementSibling as HTMLButtonElement);
					if (el?.nodeName == 'BUTTON') {
						el?.focus();
					} else {
						((lastSeasonButton.parentElement as HTMLButtonElement).nextElementSibling as HTMLButtonElement)?.focus();
					}
				}
			});

			const rightSide = this.player.createElement('div', 'episode-screen-right-side')
				.addClasses([
					'flex',
					'flex-col',
					'justify-center',
					'w-3/5',
					'h-available',
				])
				.appendTo(episodeScreen);

			this.episodeScrollContainer = this.player.createElement('div', 'episode-button-container')
				.addClasses([
					'button-container',
					'flex',
					'flex-col',
					'overflow-auto',
					'h-available',
					'pt-6',
					'gap-2',
					'p-1',
					'min-h-[50%]',
					'scroll-p-4',
					'scroll-smooth',
				])
				.appendTo(rightSide);

			for (const [index, item] of this.player.getPlaylist().entries() ?? []) {
				this.createTvEpisodeMenuButton(this.episodeScrollContainer, item, index);
			}

		});
	}

	showLanguageScreen() {
		this.languageScreen.showModal();
		this.player.container.classList.add('language-screen');
		this.player.container.classList.add('open');
		this.languageScreen.querySelector<HTMLButtonElement>('.button-container>button')?.focus();
	}

	closeLanguageScreen() {
		this.languageScreen.close();
		this.player.container.classList.remove('language-screen');
		this.player.container.classList.remove('open');
		this.preScreen.querySelector<HTMLButtonElement>('.button-container>button')?.focus();
	}

	createLanguageScreen(parent: HTMLElement) {

		this.languageScreen = this.player.createElement('dialog', 'language-screen-dialog')
			.addClasses(this.tvDialogStyles)
			.addClasses([
				'group-[&.nomercyplayer.paused.language-screen]:backdrop:bg-black/80',
				'group-[&.nomercyplayer.paused.language-screen]:backdrop:pointer-events-none',
			])
			.appendTo(parent);

		this.languageScreen.setAttribute('popover', 'manual');
		this.languageScreen.setAttribute('role', 'modal');

		const languageScreen = this.player.createElement('div', 'language-screen')
			.addClasses([
				'language-screen',
				'absolute',
				'inset-0',
				'flex',
				'p-6',
				'text-white',
				'w-available',
				'h-available',
				'z-0',
			])
			.appendTo(this.languageScreen);

		const leftSide = this.player.createElement('div', 'language-screen-left-side')
			.addClasses([
				'flex',
				'flex-col',
				'items-center',
				'overflow-clip',
				'w-2/5',
				'h-available',
			])
			.appendTo(languageScreen);

		this.createImageContainer(leftSide);

		const scrollContainer = this.player.createElement('div', 'language-scroll-container')
			.addClasses([
				'flex',
				'flex-col',
				'overflow-auto',
				'w-available',
				'h-available',
				'gap-3',
				'scroll-p-4',
				'scroll-smooth',
				'border-transparent',
				'outline-transparent',
				'p-1',
			])
			.appendTo(leftSide);

		scrollContainer.addEventListener('focus', () => {
				scrollContainer.querySelector('button')?.focus();
		});

		const audioTitle = this.player.createElement('div', 'language-button-container')
			.addClasses([
				'flex-shrink-0',
				'h-auto',
				'px-2',
				'py-0.5',
				'w-available',
				'text-left',
				'mt-3',
			])
			.appendTo(scrollContainer);

		audioTitle.innerText = this.player.localize('Audio');

		const audioButtonContainer = this.player.createElement('div', 'language-button-container')
			.addClasses([
				'[*::-webkit-scrollbar]:hidden',
				'flex',
				'flex-col',
				'flex-shrink-0',
				'gap-3',
				'px-2',
				'py-0.5',
				'w-available',
			])
			.appendTo(scrollContainer);

		audioButtonContainer.style.paddingRight = '5rem';

		let lastAudioButton: HTMLButtonElement = <HTMLButtonElement>{};

		const eventHandler = (e: KeyboardEvent) => {
			if (e.key == 'ArrowLeft') {
				//
			} else if (e.key == 'ArrowRight') {
				//
			} else if (e.key == 'ArrowUp' && !this.player.options.disableTouchControls) {
				((e.target as HTMLButtonElement).previousElementSibling as HTMLButtonElement)?.focus();
			} else if (e.key == 'ArrowDown' && !this.player.options.disableTouchControls) {
				const el = ((e.target as HTMLButtonElement).nextElementSibling as HTMLButtonElement);
				if (el?.nodeName == 'BUTTON') {
					el?.focus();
				} else {
					((lastAudioButton.parentElement as HTMLButtonElement).nextElementSibling as HTMLButtonElement)?.focus();
				}
			}
		};

		lastAudioButton.removeEventListener?.('keypress', eventHandler);

		this.player.on('audioTracks', (event) => {

			audioButtonContainer.innerHTML = '';
			for (const [index, track] of event?.entries() ?? []) {
				lastAudioButton = this.createTvLanguageMenuButton(audioButtonContainer, {
					language: track.language ?? '',
					label: track.label ?? '',
					type: track.type ?? '',
					id: track.id ?? index - 1,
					buttonType: 'audio',
				});
			}
		});

		const subtitleTitle = this.player.createElement('div', 'language-button-container')
			.addClasses([
				'flex-shrink-0',
				'h-auto',
				'px-2',
				'py-0.5',
				'w-available',
				'text-left',
				'mt-3',
			])
			.appendTo(scrollContainer);

		subtitleTitle.innerText = this.player.localize('Subtitles');

		const subtitleButtonContainer = this.player.createElement('div', 'subtitle-button-container')
			.addClasses([
				'[*::-webkit-scrollbar]:hidden',
				'flex',
				'flex-col',
				'flex-shrink-0',
				'gap-3',
				'flex-shrink-0',
				'px-2',
				'py-0.5',
				'w-available',
			])
			.appendTo(scrollContainer);

		subtitleButtonContainer.style.paddingRight = '5rem';
		subtitleButtonContainer.style.marginTop = '0';

		this.player.on('captionsList', (event) => {

			subtitleButtonContainer.innerHTML = '';
			for (const [index, track] of event.entries() ?? []) {
				this.createTvLanguageMenuButton(subtitleButtonContainer, {
					language: track.language ?? '',
					label: track.label ?? '',
					type: track.type ?? '',
					id: track.id ?? index - 1,
					buttonType: 'subtitle',
				});
			}
		});

		// setTimeout(() => {
		// 	backButton.focus();
		// }, 50);
	}

	createTvProgressBar(parent: HTMLDivElement) {

		this.sliderBar = this.player.createElement('div', 'slider-bar')
			.addClasses([
				'slider-bar',
				'group/slider',
				'overflow-clip',
				'flex',
				'rounded-full',
				'bg-white/20',
				'h-2',
				'mx-4',
				'relative',
				'w-available',
			])
			.appendTo(parent);

		const sliderBuffer = this.player.createElement('div', 'slider-buffer')
			.addClasses([
				'slider-buffer',
				'absolute',
				'flex',
				'h-full',
				'pointer-events-none',
				'rounded-full',
				'bg-white/20',
				'z-0',
				'-left-full',
				'w-full',
			])
			.appendTo(this.sliderBar);

		const sliderProgress = this.player.createElement('div', 'slider-progress')
			.addClasses([
				'slider-progress',
				'absolute',
				'flex',
				'h-full',
				'pointer-events-none',
				'rounded-full',
				'bg-white',
				'z-10',
				'-left-full',
				'w-full',
			])
			.appendTo(this.sliderBar);

		this.chapterBar = this.player.createElement('div', 'chapter-progress')
			.addClasses([
				'chapter-bar',
				'bg-transparent',
				'flex',
				'h-2',
				'relative',
				'rounded-full',
				'overflow-clip',
				'w-available',
			])
			.appendTo(this.sliderBar);

		this.player.on('item', () => {
			this.sliderBar.classList.add('bg-white/20');
			this.previewTime = [];
			this.chapters = [];
			sliderBuffer.style.transform = 'translateX(0%)';
			sliderProgress.style.transform = 'translateX(0%)';
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
			sliderBuffer.style.transform = `translateX(${data.buffered}%)`;
			sliderProgress.style.transform = `translateX(${data.percentage}%)`;
		});

		this.player.on('currentScrubTime', (data) => {
			sliderProgress.style.transform = `translateX(${(data.currentTime / data.duration) * 100}%)`;
		});

		return this.sliderBar;
	}

	getClosestElement(element: HTMLButtonElement, selector: string) {

		const arr = [...document.querySelectorAll<HTMLButtonElement>(selector)].filter(el => getComputedStyle(el).display == 'flex');
		const originEl = element!.getBoundingClientRect();

		return arr.find(el => (el.getBoundingClientRect().top + (el.getBoundingClientRect().height / 2))
			== nearestValue(arr.map(el => (el.getBoundingClientRect().top + (el.getBoundingClientRect().height / 2)))
				, originEl.top + (originEl.height / 2)));
	}

	createTvEpisodeMenuButton(parent: HTMLDivElement, item: PlaylistItem, index: number) {

		const episodeMenuButton = this.player.createElement('button', `playlist-${item.id}`)
			.addClasses([
				'playlist-menu-button',
				'relative',
				'flex',
				'w-available',
				'p-2',
				'gap-2',
				'rounded-lg',
				'snap-center',
				'outline-transparent',
				'outline',
				'outline-1',
				'outline-solid',
				'text-white',
				'focus-visible:outline-2',
				'focus-visible:outline-white',
				'transition-all',
				'duration-300',
				'hover:bg-neutral-600/20',
			])
			.appendTo(parent);

		if (this.player.playlistItem().season !== 1) {
			episodeMenuButton.style.display = 'none';
		}

		const leftSide = this.player.createElement('div', `playlist-${item.id}-left`)
			.addClasses([
				'episode-menu-button-left',
				'relative',
				'rounded-md',
				'w-[50%]',
				'overflow-clip',
				'self-center',
			])
			.appendTo(episodeMenuButton);

		this.player.createElement('div', `episode-${item.id}-shadow`)
			.addClasses([
				'episode-menu-button-shadow',
				'bg-[linear-gradient(0deg,rgba(0,0,0,0.87)_0%,rgba(0,0,0,0.7)_25%,rgba(0,0,0,0)_50%,rgba(0,0,0,0)_100%)]',
				'shadow-[inset_0px_1px_0px_rgba(255,255,255,0.24),inset_0px_-1px_0px_rgba(0,0,0,0.24),inset_0px_-2px_0px_rgba(0,0,0,0.24)]',
				'bottom-0',
				'left-0',
				'absolute',
				'!h-available',
				'w-available',
			])
			.appendTo(leftSide);

		const image = this.player.createElement('img', `episode-${item.id}-image`)
			.addClasses([
				'episode-menu-button-image',
				'w-available',
				'h-auto',
				'aspect-video',
				'object-cover',
				'',
			])
			.appendTo(leftSide);
		image.setAttribute('loading', 'lazy');

		if (item.image?.startsWith('http')) {
			image.src = item.image ?? '';
		} else {
			image.src = item.image && item.image != '' ? `${this.imageBaseUrl}${item.image}` : '';
		}

		const progressContainer = this.player.createElement('div', `episode-${item.id}-progress-container`)
			.addClasses([
				'episode-menu-progress-container',
				'absolute',
				'bottom-0',
				'w-available',
				'flex',
				'flex-col',
				'px-3',
			])
			.appendTo(leftSide);

		const progressContainerItemBox = this.player.createElement('div', `episode-${item.id}-progress-box`)
			.addClasses([
				'episode-menu-progress-box',
				'flex',
				'justify-between',
				'h-available',
				'sm:mx-2',
				'mb-1',
				'px-1',
			])
			.appendTo(progressContainer);


		const progressContainerItemText = this.player.createElement('div', `episode-${item.id}-progress-item`)
			.addClasses([
				'progress-item-text',
				'text-[0.7rem]',
				'',
			])
			.appendTo(progressContainerItemBox);

		if (item.episode && item.show) {
			progressContainerItemText.innerText = `${this.player.localize('E')}${item.episode}`;
		}

		const progressContainerDurationText = this.player.createElement('div', `episode-${item.id}-progress-duration`)
			.addClasses([
				'progress-duration',
				'text-[0.7rem]',
			])
			.appendTo(progressContainerItemBox);
		progressContainerDurationText.innerText = item.duration?.replace(/^00:/u, '');

		const sliderContainer = this.player.createElement('div', `episode-${item.id}-slider-container`)
			.addClasses([
				'slider-container',
				'group/slider',
				'overflow-clip',
				'hidden',
				'rounded-full',
				'bg-white/20',
				'h-2',
				'mx-4',
				'relative',
				'w-available',
			])
			.appendTo(progressContainer);
		sliderContainer.style.display = item.progress ? 'flex' : 'none';

		const progressBar = this.player.createElement('div', `episode-${item.id}-progress-bar`)
			.addClasses([
				'progress-bar',
				'absolute',
				'flex',
				'h-full',
				'pointer-events-none',
				'rounded-full',
				'bg-white',
				'z-10',
				'-left-full',
				'w-full',
			])
			.appendTo(sliderContainer);

		if (item.progress?.percentage) {
			progressBar.style.transform = `translateX(${item.progress.percentage > 98 ? 100 : item.progress}%)`;
		}

		const episodeMenuButtonRightSide = this.player.createElement('div', `episode-${item.id}-right-side`)
			.addClasses([
				'playlist-card-right',
				'w-3/4',
				'flex',
				'flex-col',
				'text-left',
				'gap-1',
				'px-1',
				'outline-transparent',
				'outline',
				'outline-1',
				'outline-solid',
				'focus-visible:outline-2',
				'focus-visible:outline-white',
				'active:outline-white',
			])
			.appendTo(episodeMenuButton);


		const episodeMenuButtonTitle = this.player.createElement('span', `episode-${item.id}-title`)
			.addClasses([
				'playlist-menu-button-title',
				'font-bold',
				'text-lg',
				'line-clamp-1',
				'text-white',
				'',
			])
			.appendTo(episodeMenuButtonRightSide);
		episodeMenuButtonTitle.innerText = lineBreakShowTitle((item.title ?? '').replace(item.show ?? '', '').replace('%S', this.player.localize('S'))
			.replace('%E', this.player.localize('E')));

		const episodeMenuButtonOverview = this.player.createElement('span', `episode-${item.id}-overview`)
			.addClasses([
				'playlist-menu-button-overview',
				'font-bold',
				'text-[0.7rem]',
				'leading-4',
				'line-clamp-4',
				'overflow-hidden',
				'text-white',
			])
			.appendTo(episodeMenuButtonRightSide);
		episodeMenuButtonOverview.innerText = limitSentenceByCharacters(item.description, 600);


		this.player.on('item', () => {
			if (this.player.playlistItem().season == item.season) {
				episodeMenuButton.style.display = 'flex';
			} else {
				episodeMenuButton.style.display = 'none';
			}

			if (this.player.playlistItem().season == item.season && this.player.playlistItem().episode == item.episode) {
				episodeMenuButton.style.background = 'rgba(255,255,255,.1)';
			} else {
				episodeMenuButton.style.background = 'transparent';
			}
		});

		this.player.on('switch-season', (season) => {
			this.selectedSeason = season;

			if (this.player.playlistItem().id == item.id) {
				setTimeout(() => {
					this.scrollCenter(episodeMenuButton, parent, {
						margin: 1,
						duration: 100,
					});
				}, 50);
			} else if (this.player.playlistItem().season !== season) {
				this.episodeScrollContainer.scrollTo(0, 0);
			}

			if (season == item.season) {
				episodeMenuButton.style.display = 'flex';
			} else {
				episodeMenuButton.style.display = 'none';
			}
		});

		this.player.on('active', () => {
				progressBar.style.transform = `translateX(${this.player.getTimeData().percentage}%)`;
		});

		this.player.on('time', (data) => {
			if (this.player.playlistItem()?.uuid == item.uuid) {
				if (this.player.container.classList.contains('active')) {
					sliderContainer.style.display = 'flex';
					progressBar.style.transform = `translateX(${data.percentage}%)`;
				}
			}
		});

		if (item.episode && item.show) {
			progressContainerItemText.innerText
				= item.season == undefined ? `${item.episode}` : `${this.player.localize('S')}${item.season}: ${this.player.localize('E')}${item.episode}`;
		}

		episodeMenuButton.addEventListener('keypress', (e) => {
			if (e.key == 'ArrowLeft') {
				document.querySelector<HTMLButtonElement>(`#season-${this.player.playlistItem().season}`)?.focus();
			} else if (e.key == 'ArrowRight') {
				//
			} else if (e.key == 'ArrowUp' && !this.player.options.disableTouchControls) {
				(episodeMenuButton.previousElementSibling as HTMLButtonElement)?.focus();
			} else if (e.key == 'ArrowDown' && !this.player.options.disableTouchControls) {
				(episodeMenuButton.nextElementSibling as HTMLButtonElement)?.focus();
			}
		});

		episodeMenuButton.addEventListener('focus', () => {
			this.scrollCenter(episodeMenuButton, parent, {
				margin: 2,
				duration: 50,
			});
		});

		episodeMenuButton.addEventListener('click', () => {
			if (item.episode && item.season) {
				this.setEpisode(item.season, item.episode);
			} else {
				this.player.playlistItem(index);
			}

			this.closeEpisodeScreen();
			this.closePreScreen();
			this.player.play();
		});

		return episodeMenuButton;
	}

	createTvSeasonButton(
		parent: HTMLElement,
		id: string,
		data: {
			season: any;
			seasonName: any;
			episodes: number;
		},
		action: () => void,
		icon?: Icon['path']
	) {

		const button = this.player.createElement('button', id)
			.addClasses([
				'w-available',
				'mr-auto',
				'h-8',
				'px-1',
				'py-2',
				'flex',
				'flex-nowrap',
				'items-center',
				'snap-center',
				'rounded',
				'outline-transparent',
				'outline',
				'outline-1',
				'outline-solid',
				'focus-visible:outline-2',
				'focus-visible:outline-white',
				'active:outline-white',
				`${id}-button`,
			])
			.appendTo(parent);
		button.type = 'button';

		button.addEventListener('focus', () => {
			this.scrollIntoView(button);
		});

		button.addEventListener('keyup', (e) => {
			if (e.key == 'ArrowLeft') {
			}
			else if (e.key == 'ArrowRight') {
				if (data.season == this.player.playlistItem()?.season) {
					[...document.querySelectorAll<HTMLButtonElement>('[id^=playlist-]')]
						.filter(el => getComputedStyle(el).display == 'flex')
						.at((this.player.playlistItem()?.episode ?? 0) - 1)
						?.focus();
				} else {
					[...document.querySelectorAll<HTMLButtonElement>('[id^=playlist-]')]
						.filter(el => getComputedStyle(el).display == 'flex')
						.at(0)
						?.focus();
				}
			}
		});

		button.addEventListener('keypress', (e) => {
			if (e.key == 'ArrowUp' && !this.player.options.disableTouchControls) {
				(button.previousElementSibling as HTMLButtonElement)?.focus();
			} else if (e.key == 'ArrowDown' && !this.player.options.disableTouchControls) {
				(button.nextElementSibling as HTMLButtonElement)?.focus();
			}
		});

		button.addEventListener('click', () => {
			action?.bind(this)();
		});

		if (icon) {
			const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
			svg.setAttribute('viewBox', '0 0 24 24');

			svg.id = id;
			this.player.addClasses(svg, [
				`${id}-icon`,
				...icon.classes,
				'svg-size',
				'h-5',
				'w-5',
				'pointer-events-none',
				'group-hover/button:scale-110',
				'duration-700',
			]);

			const path2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
			path2.setAttribute('d', icon.hover);
			svg.appendChild(path2);
			button.appendChild(svg);
		}

		const buttonText = this.player.createElement('span', `${id}-buttonText`)
			.addClasses([
				'w-available',
				'text-white',
				'text-sm',
				'font-bold',
				'mx-2',
				'flex',
				'justify-between',
				'flex-nowrap',
			])
			.appendTo(button);

		if (data.seasonName) {
			buttonText.innerHTML = `
				<span>
					${data.seasonName ?? ''}  
				</span>
				<span>
					${data.episodes} ${this.player.localize('episodes')}
				</span>
			`;
		} else if (data.season) {
			buttonText.innerHTML = `
				<span>
					${this.player.localize('Season')} ${data.season}
				</span>
				<span>
					${data.episodes} ${this.player.localize('episodes')}
				</span>
			`;
		} else {
			buttonText.innerHTML = `
				<span>
					
				</span>
				<span>
					${data.episodes} ${this.player.localize('episodes')}
				</span>
			`;
		}

		return button;

	}

	createTvLanguageMenuButton(parent: HTMLDivElement, data: {
								   language: string,
								   label: string,
								   type: string,
								   id: number,
								   styled?: boolean;
								   buttonType: string;
							   }, hovered = false) {

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
				'transition-all',
				'duration-100',
				'outline-1',
				'outline-solid',
				'focus-visible:outline-2',
				'focus-visible:outline-white',
				'active:outline-white',
			])
			.appendTo(parent);

		const chevron = this.createSVGElement(languageButton, 'checkmark', this.buttons.checkmark, false,  hovered);
		this.player.addClasses(chevron, [
			'w-10',
			'opacity-0',
		]);

		this.getLanguageButtonText(languageButton, data);

		if (data.id > 0 && data.buttonType == 'audio') {
			chevron.classList.add('opacity-0');
		} else if (data.id > 1 && data.buttonType == 'subtitle') {
			chevron.classList.add('opacity-0');
		} else {
			chevron.classList.remove('opacity-0');
		}

		if (data.buttonType == 'audio') {
			this.player.on('audioTrackChanging', (audio) => {
				if (data.id === audio.id) {
					chevron.classList.remove('opacity-0');
				} else {
					chevron.classList.add('opacity-0');
				}
			});

			languageButton.addEventListener('click', (event) => {
				event.stopPropagation();
				this.player.setCurrentAudioTrack(data.id);
			});
		}
		else if (data.buttonType == 'subtitle') {
			if (data.id === this.player.getCaptionIndex()) {
				chevron.classList.remove('opacity-0');
			} else {
				chevron.classList.add('opacity-0');
			}

			this.player.on('captionsChanged', (track) => {
				if (data.id === track.id) {
					chevron.classList.remove('opacity-0');
				} else {
					chevron.classList.add('opacity-0');
				}
			});

			languageButton.addEventListener('click', (event) => {
				event.stopPropagation();
				this.player.setCurrentCaption(data.id);
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
				this.scrollCenter(languageButton, parent.parentElement as HTMLDivElement, {
					margin: 1,
					duration: 100,
				});
			}, 50);
		});

		this.player.on('audioTrackChanged', (audio) => {
			if (data.id === audio.id) {
				languageButton.focus();
			}
		});

		return languageButton;
	}

	getVisibleButtons(element: HTMLButtonElement) {
		const container = element.parentElement;
		const buttons = container?.querySelectorAll<HTMLButtonElement>('button');
		if (!buttons || buttons?.length == 0) return;

		const visibleButtons = [...buttons].filter(el => el.style.display != 'none');

		const currentButtonIndex = visibleButtons.findIndex(el => el == element);

		return {
			visibleButtons,
			currentButtonIndex,
		};
	}

	findPreviousVisibleButton(element: HTMLButtonElement) {
		const buttons = this.getVisibleButtons(element);
		if (!buttons) return;

		const { visibleButtons, currentButtonIndex } = buttons;

		// eslint-disable-next-line no-unreachable-loop
		for (let i = currentButtonIndex; i >= 0; i--) {
			return visibleButtons[i - 1];
		}
	}

	findNextVisibleButton(element: HTMLButtonElement) {
		const buttons = this.getVisibleButtons(element);
		if (!buttons) return;

		const { visibleButtons, currentButtonIndex } = buttons;

		// eslint-disable-next-line no-unreachable-loop
		for (let i = currentButtonIndex; i < visibleButtons.length; i++) {
			return visibleButtons[i + 1];
		}
	}

	createImageContainer(parent: HTMLElement) {

		const leftSideTop = this.player.createElement('div', 'left-side-top')
			.addClasses([
				'flex',
				'flex-col',
				'justify-center',
				'items-center',
				'w-available',
				'gap-2',
				'h-auto',
			])
			.appendTo(parent);

		const logoContainer = this.player.createElement('div', 'logo-container')
			.addClasses([
				'flex',
				'flex-col',
				'justify-center',
				'items-center',
				'w-available',
				'h-[85px]',
				'min-h-[85px]',
			])
			.appendTo(leftSideTop);

		const fallbackText = this.player.createElement('span', 'fallbackText')
			.addClasses([
				'w-auto',
				'h-available',
				'items-center',
				'py-0',
				'max-w-[38vw]',
				'mr-auto',
				'leading-[1.2]',
				'font-bold',
				'object-fit',
			])
			.appendTo(logoContainer);

		const logo = this.player.createElement('img', 'logo')
			.addClasses([
				'w-auto',
				'px-2',
				'py-2',
				'mr-auto',
				'object-fit',
				'h-auto',
				'max-w-[23rem]',
				'max-h-available',
				'',
			])
			.appendTo(logoContainer);

		const logoFooterContainer = this.player.createElement('div', 'left-side-top-overview')
			.addClasses([
				'flex',
				'flex-col',
				'w-available',
				'h-[40px]',
			])
			.appendTo(leftSideTop);

		const ratingContainer = this.player.createElement('div', 'rating-container')
			.addClasses([
				'flex',
				'gap-2',
				'items-center',
				'w-available',
				'text-white',
			])
			.appendTo(logoFooterContainer);

		const year = this.player.createElement('span', 'year-text')
			.addClasses([
				'flex',
				'text-white',
				'text-sm',
				'font-bold',
				'mx-2',
			])
			.appendTo(ratingContainer);

		const ratingImage = this.player.createElement('img', 'rating-image')
			.addClasses([
				'w-8',
				'h-available',
				'object-fit',
				'invert',
			])
			.appendTo(ratingContainer);


		const episodesCount = this.player.createElement('span', 'episodes-count-text')
			.addClasses([
				'flex',
				'text-white',
				'text-sm',
				'font-bold',
				'mx-2',
			])
			.appendTo(ratingContainer);

		this.player.on('item', () => {
			const image = this.player.playlistItem()?.logo;

			if (!image || image == '' || image.includes('null') || image.includes('undefined')) {
				fallbackText.innerText = breakLogoTitle(this.player.playlistItem()?.show ?? '');
				fallbackText.style.fontSize = `calc(110px / ${fallbackText.innerText.length} + 3ch)`;

				fallbackText.style.display = 'flex';
				logo.style.display = 'none';

			} else {

				logo.style.display = 'block';
				fallbackText.style.display = 'none';

				if (image?.startsWith('http')) {
					logo.src = image;
				} else {
					logo.src = image && image != '' ? `${this.imageBaseUrl}${image}` : '';
				}
			}

			year.innerHTML = this.player.playlistItem()?.year?.toString() ?? '';
			if (this.player.playlistItem()?.year) {
				year.style.display = 'flex';
			} else {
				year.style.display = 'none';
			}

			ratingImage.removeAttribute('src');
			ratingImage.removeAttribute('alt');
			ratingImage.style.opacity = '0';

			if (this.player.getPlaylist().length > 1) {
				episodesCount.innerHTML = `${this.player.getPlaylist().length} ${this.player.localize('episodes')}`;
			}

			const rating = this.player.playlistItem()?.rating;
			if (!rating) return;

			ratingImage.src = `https://storage.nomercy.tv/laravel/kijkwijzer/${rating.image}`;
			ratingImage.alt = rating.rating.toString();
			ratingImage.style.opacity = '1';
		});

		return leftSideTop;

	}

	createTvButton(parent: HTMLElement, id: string, text: string, action: () => void, icon?: Icon['path']) {

		const tvButton = this.player.createElement('button', id)
			.addClasses([
				'w-9/12',
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
				'outline-1',
				'outline-solid',
				'focus-visible:outline-2',
				'focus-visible:outline-white',
				'active:outline-white',
				`${id}-button`,
			])
			.appendTo(parent);
		tvButton.type = 'button';

		tvButton.addEventListener('focus', () => {
			setTimeout(() => {
				this.scrollCenter(tvButton, parent, {
					margin: 1,
					duration: 100,
				});
			}, 50);
		});

		tvButton.addEventListener('keypress', (e) => {
			if (e.key == 'ArrowUp' && !this.player.options.disableTouchControls) {
				this.findPreviousVisibleButton(tvButton)?.focus();
			} else if (e.key == 'ArrowDown' && !this.player.options.disableTouchControls) {
				const el = this.findNextVisibleButton(tvButton);
				if (el) {
					el?.focus();
				} else {
					(tvButton.parentElement?.nextElementSibling as HTMLButtonElement)?.focus();
				}
			}
		});

		tvButton.addEventListener('click', action?.bind(this.player));

		if (icon) {
			const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
			svg.setAttribute('viewBox', '0 0 24 24');

			svg.id = id;
			this.player.addClasses(svg, [
				`${id}-icon`,
				...icon.classes,
				'svg-size',
				'h-5',
				'w-5',
				'pointer-events-none',
				'group-hover/button:scale-110',
				'duration-700',
			]);

			const path2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
			path2.setAttribute('d', icon.hover);
			svg.appendChild(path2);
			tvButton.appendChild(svg);
		}

		const buttonText = this.player.createElement('span', `${id}-buttonText`)
			.addClasses([
				'text-white',
				'text-sm',
				'font-bold',
				'mx-2',
				'flex',
				'justify-between',
			])
			.appendTo(tvButton);
		buttonText.innerHTML = this.player.localize(text);

		return tvButton;

	}

	createTvCurrentItem(parent: HTMLElement) {

		const currentItemContainer = this.player.createElement('div', 'current-item-container')
			.addClasses([
				'flex',
				'flex-col',
				'justify-end',
				'items-end',
				'gap-2',
			])
			.appendTo(parent);

		const currentItemShow = this.player.createElement('div', 'current-item-show')
			.addClasses([
				'text-white',
				'text-sm',
				'whitespace-pre',
				'font-bold',
			])
			.appendTo(currentItemContainer);

		const currentItemTitleContainer = this.player.createElement('div', 'current-item-title-container')
			.addClasses([
				'flex',
				'flex-row',
				'gap-2',
			])
			.appendTo(currentItemContainer);

		const currentItemEpisode = this.player.createElement('div', 'current-item-episode')
			.addClasses([])
			.appendTo(currentItemTitleContainer);

		const currentItemTitle = this.player.createElement('div', 'current-item-title')
			.addClasses([])
			.appendTo(currentItemTitleContainer);

		this.player.on('item', () => {
			const item = this.player.playlistItem();
			currentItemShow.innerHTML = breakLogoTitle(item.show ?? '');
			currentItemEpisode.innerHTML = '';
			if (item.season) {
				currentItemEpisode.innerHTML += `${this.player.localize('S')}${item.season}`;
			}
			if (item.season && item.episode) {
				currentItemEpisode.innerHTML += `: ${this.player.localize('E')}${item.episode}`;
			}
			currentItemTitle.innerHTML = item.title?.replace(item.show ?? '', '').length > 0 ? `"${item.title
				?.replace(item.show ?? '', '')
				.replace('%S', this.player.localize('S'))
				.replace('%E', this.player.localize('E'))}"` : '';
		});

		return currentItemContainer;

	}

}

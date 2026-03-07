import type { AddClasses, AddClassesReturn, CreateElement, Icon, NMPlayer } from '../types';
import { twMerge } from 'tailwind-merge';

const DEFAULT_MESSAGE_TIME = 2000;

export const domMethods = {
	/**
	 * Creates a new HTML element of the specified type and assigns the given ID to it.
	 * @param type - The type of the HTML element to create.
	 * @param id - The ID to assign to the new element.
	 * @param unique - Whether to use an existing element with the specified ID if it already exists.
	 * @returns An object with four methods:
	 *   - `addClasses`: adds the specified CSS class names to the element's class list and returns the functions recursively.
	 *   - `appendTo`: appends the element to a parent element and and returns addClasses and get methods.
	 *   - `prependTo`: prepends the element to a parent element and returns addClasses and get methods.
	 *   - `get`: returns the created element.
	 */
	createElement<K extends keyof HTMLElementTagNameMap>(this: NMPlayer, type: K, id: string, unique?: boolean): CreateElement<HTMLElementTagNameMap[K]> {
		let el: HTMLElementTagNameMap[K];

		if (unique) {
			el = (document.getElementById(id) ?? document.createElement(type)) as HTMLElementTagNameMap[K];
		}
		else {
			el = document.createElement(type);
		}
		el.id = id;

		return {
			addClasses: (names: string[]) => this.addClasses(el, names),
			appendTo: <T extends Element>(parent: T) => {
				parent.appendChild(el);
				return {
					addClasses: (names: string[]) => this.addClasses(el, names),
					get: () => el,
				};
			},
			prependTo: <T extends Element>(parent: T) => {
				parent.prepend(el);
				return {
					addClasses: (names: string[]) => this.addClasses(el, names),
					get: () => el,
				};
			},
			get: () => el,
		};
	},

	/**
	 * Adds the specified CSS class names to the given element's class list.
	 *
	 * @param el - The element to add the classes to.
	 * @param names - An array of CSS class names to add.
	 * @returns An object with three methods:
	 *   - `appendTo`: appends the element to a parent element and returns addClasses and get methods.
	 *   - `prependTo`: prepends the element to a parent element and returns addClasses and get methods.
	 *   - `get`: returns the created element.
	 * @template T - The type of the element to add the classes to.
	 */
	addClasses<T extends Element>(this: NMPlayer, el: T, names: string[]): AddClasses<T> {
		for (const name of names.filter(Boolean)) {
			el.classList?.add(name.trim());
		}
		return {
			appendTo: <T extends Element>(parent: T) => {
				parent.appendChild(el);
				return {
					addClasses: (names: string[]) => this.addClasses(el, names),
					get: () => el,
				};
			},
			prependTo: <T extends Element>(parent: T) => {
				parent.prepend(el);
				return {
					addClasses: (names: string[]) => this.addClasses(el, names),
					get: () => el,
				};
			},
			addClasses: (names: string[]) => this.addClasses(el, names),
			get: () => el,
		};
	},

	createUiButton(this: NMPlayer, parent: HTMLElement, id: string, title?: string): AddClassesReturn<HTMLButtonElement> {
		const button = this.createElement('button', id)
			.addClasses([
				'cursor-pointer',
				'-outline-offset-2',
				'fill-white',
				'flex',
				'focus-visible:fill-white',
				'focus-visible:outline',
				'focus-visible:outline-2',
				'focus-visible:outline-white/20',
				'group/button',
				'h-10',
				'items-center',
				'justify-center',
				'min-w-[40px]',
				'p-2',
				'pointer-events-auto',
				'relative',
				'rounded-full',
				'tv:fill-white/30',
				'w-10',
			])
			.appendTo(parent);

		const el = button.get();

		el.ariaLabel = title ?? this.localize(id.replace(/-/g, ' ').toTitleCase());

		el.addEventListener('keypress', (event) => {
			if (event.key === 'Backspace') {
				el.blur();
				this.emit('show-menu', false);
			}
			if (event.key === 'Escape') {
				el.blur();
				this.emit('show-menu', false);
			}
		});

		return button;
	},

	createSVGElement(this: NMPlayer, parent: HTMLElement, id: string, icon: Icon['path'], hidden = false, hovered = false) {
		const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		svg.setAttribute('viewBox', '0 0 24 24');

		svg.id = id;
		this.addClasses(svg, twMerge([
			`${id}-icon`,
			'svg-size',
			'h-5',
			'w-5',
			'fill-current',
			'pointer-events-none',
			'group-hover/button:scale-110',
			'duration-700',
			hidden ? 'hidden' : 'flex',
			...icon.classes,
		]).split(' '));

		const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		path.setAttribute('d', hovered ? icon.normal : icon.hover);

		this.addClasses(path, [
			'group-hover/button:hidden',
			'group-hover/volume:hidden',
		]);
		svg.appendChild(path);

		const path2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		path2.setAttribute('d', hovered ? icon.hover : icon.normal);
		this.addClasses(path2, [
			'hidden',
			'group-hover/button:flex',
			'group-hover/volume:flex',
		]);
		svg.appendChild(path2);

		if (!parent.classList.contains('menu-button') && hovered) {
			parent.addEventListener('mouseenter', () => {
				if (icon.title.length === 0 || ['Next', 'Previous'].includes(icon.title))
					return;

				if (icon.title === 'Fullscreen' && this.fullscreen()) {
					return;
				}
				if (icon.title === 'Exit fullscreen' && !this.fullscreen()) {
					return;
				}
				if (icon.title === 'Play' && this.isPlaying) {
					return;
				}
				if (icon.title === 'Pause' && !this.isPlaying) {
					return;
				}
				if (icon.title === 'Mute' && this.muted()) {
					return;
				}
				if (icon.title === 'Unmute' && !this.muted()) {
					return;
				}

				const text = `${this.localize(icon.title)} ${this.getButtonKeyCode(id)}`;

				const playerRect = this.element().getBoundingClientRect();
				const menuTipRect = parent.getBoundingClientRect();

				let x = Math.abs(playerRect.left - (menuTipRect.left + (menuTipRect.width * 0.5)) - (text.length * 0.5));
				const y = Math.abs(playerRect.bottom - (menuTipRect.bottom + (menuTipRect.height * 1.2)));

				if (x < 35) {
					x = 35;
				}

				if (x > (playerRect.right - playerRect.left) - 75) {
					x = (playerRect.right - playerRect.left) - 75;
				}

				this.emit('show-tooltip', {
					text,
					currentTime: 'bottom',
					x: `${x}px`,
					y: `-${y}px`,
				});
			});

			parent.addEventListener('mouseleave', () => {
				this.emit('hide-tooltip');
			});
		}

		parent.appendChild(svg);
		return svg;
	},

	createButton(this: NMPlayer, match: string, id: string, insert: 'before' | 'after' = 'after', icon: Icon['path'], click?: (e?: MouseEvent) => void, rightClick?: (e?: MouseEvent) => void) {
		const element = document.querySelector<HTMLButtonElement>(match);
		if (!element) {
			throw new Error('Element not found');
		}

		const button = this.createElement('button', id)
			.addClasses([
				'cursor-pointer',
				'-outline-offset-2',
				'fill-white',
				'flex',
				'focus-visible:fill-white',
				'focus-visible:outline',
				'focus-visible:outline-2',
				'focus-visible:outline-white/20',
				'group/button',
				'h-10',
				'items-center',
				'justify-center',
				'min-w-[40px]',
				'p-2',
				'pointer-events-auto',
				'relative',
				'rounded-full',
				'tv:fill-white/30',
				'w-10',
			]);

		const el = button.get();

		el.ariaLabel = icon.title ?? this.localize(id.replace(/-/g, ' ').toTitleCase());

		el.addEventListener('keypress', (event) => {
			if (event.key === 'Backspace') {
				el.blur();
				this.emit('show-menu', false);
			}
			if (event.key === 'Escape') {
				el.blur();
				this.emit('show-menu', false);
			}
		});

		if (insert === 'before') {
			element.prepend(el);
		}
		else {
			element.appendChild(el);
		}

		this.createSVGElement(el, `${id.replace(/\s/gu, '_')}-enabled`, icon, true, false);
		this.createSVGElement(el, id.replace(/\s/gu, '_'), icon, false);

		el.addEventListener('click', (event: MouseEvent) => {
			event.stopPropagation();
			click?.();
			this.emit('hide-tooltip');
		});
		el.addEventListener('contextmenu', (event: MouseEvent) => {
			event.stopPropagation();
			rightClick?.();
			this.emit('hide-tooltip');
		});

		return button;
	},

	/**
	 * Appends script and stylesheet files to the document head.
	 * @param {string | any[]} filePaths - The file paths to append to the document head.
	 * @returns {Promise<void>} A promise that resolves when all files have been successfully appended, or rejects if any file fails to load.
	 * @throws {Error} If an unsupported file type is provided.
	 */
	appendScriptFilesToDocument(this: NMPlayer, filePaths: string | any[]): Promise<Awaited<void>[]> {
		if (!Array.isArray(filePaths)) {
			filePaths = [filePaths];
		}

		const promises = filePaths.map(filePath => new Promise<void>((resolve, reject) => {
			let file;

			if (filePath.endsWith('.js')) {
				file = document.createElement('script');
				file.src = filePath;
			}
			else if (filePath.endsWith('.css')) {
				file = document.createElement('link');
				file.rel = 'stylesheet';
				file.href = filePath;
			}
			else {
				reject(new Error('Unsupported file type'));
			}

			if (!file)
				return reject(new Error('File could not be loaded'));

			file.addEventListener('load', () => {
				resolve();
			}, { passive: true });

			file.addEventListener('error', (err) => {
				reject(err);
			}, { passive: true });

			document.head.appendChild(file);
		}));

		return Promise.all(promises);
	},

	/**
	 * Displays a message for a specified amount of time.
	 * @param data The message to display.
	 * @param time The amount of time to display the message for, in milliseconds. Defaults to 2000.
	 */
	displayMessage(this: NMPlayer, data: string, time = DEFAULT_MESSAGE_TIME): void {
		clearTimeout(this.message);
		this.emit('message', data);
		this.emit('display-message', data);
		this.message = setTimeout(() => {
			this.emit('message-dismiss', data);
			this.emit('remove-message', data);
		}, time);
	},

	getClosestElement(this: NMPlayer, element: HTMLButtonElement, selector: string) {
		const arr = Array.from(document.querySelectorAll<HTMLButtonElement>(selector)).filter(el => getComputedStyle(el).display === 'flex');
		const originEl = element!.getBoundingClientRect();

		return arr.find(el => (el.getBoundingClientRect().top + (el.getBoundingClientRect().height / 2))
			=== this.nearestValue(arr.map(el => (el.getBoundingClientRect().top + (el.getBoundingClientRect().height / 2))), originEl.top + (originEl.height / 2)));
	},

	scrollCenter(this: NMPlayer, el: HTMLElement, container: HTMLElement, options?: {
		duration?: number;
		margin?: number;
	}) {
		if (!el)
			return;
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
	},

	scrollIntoView(this: NMPlayer, element: HTMLElement) {
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
	},

	getButtonKeyCode(this: NMPlayer, id: string) {
		switch (id) {
			case 'play':
			case 'pause':
				return `(${this.localize('SPACE')})`;
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
	},

	/**
	 * Attaches a double tap event listener to the element.
	 * @param doubleTap - The function to execute when a double tap event occurs.
	 * @param singleTap - An optional function to execute when a second double tap event occurs.
	 * @returns A function that detects double tap events.
	 */
	doubleTap(this: NMPlayer, doubleTap: (event: Event) => void, singleTap?: (event2: Event) => void) {
		const delay = this.options.doubleClickDelay ?? 300;
		let lastTap = 0;
		let timeout: NodeJS.Timeout;
		let timeout2: NodeJS.Timeout;
		return function (event: Event, event2?: Event) {
			const curTime = new Date().getTime();
			const tapLen = curTime - lastTap;
			if (tapLen > 0 && tapLen < delay) {
				event.preventDefault();
				doubleTap(event);
				clearTimeout(timeout2);
			}
			else {
				timeout = setTimeout(() => {
					clearTimeout(timeout);
				}, delay);
				timeout2 = setTimeout(() => {
					singleTap?.(event2!);
				}, delay);
			}
			lastTap = curTime;
		};
	},

	/**
	 * Converts a snake_case string to camelCase.
	 * @param str - The snake_case string to convert.
	 * @returns The camelCase version of the string.
	 */
	snakeToCamel(this: NMPlayer, str: string): string {
		return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
	},

	spaceToCamel(this: NMPlayer, str: string): string {
		return str.replace(/\s([a-z])/g, (_, letter) => letter.toUpperCase());
	},

	nearestValue(this: NMPlayer, arr: number[], val: number): number {
		return arr.reduce((p, n) => (Math.abs(p) > Math.abs(n - val) ? n - val : p), Infinity) + val;
	},

	isNumber(this: NMPlayer, value: any): value is number {
		return !Number.isNaN(Number.parseInt(value, 10));
	},

	getClosestSeekableInterval(this: NMPlayer) {
		const scrubTime = this.currentTime();
		const interval = this.previewTime.find((interval) => {
			return scrubTime >= interval.start && scrubTime < interval.end;
		})!;
		return interval?.start;
	},

	getParameterByName<T extends number | string>(this: NMPlayer, name: string, url = window.location.href): T | null {
		name = name.replace(/[[\]]/gu, '\\$&');

		const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`, 'u');
		const results = regex.exec(url);

		if (!results || !results[2]) {
			return null;
		}

		const value = decodeURIComponent(results[2].replace(/\+/gu, ' '));

		if (!Number.isNaN(Number(value))) {
			return Number(value) as T;
		}
		return value as T;
	},

	debounce<T extends (...args: unknown[]) => unknown>(this: NMPlayer, func: T, wait: number) {
		let timeout: NodeJS.Timeout;
		return (...args: Parameters<T>) => {
			clearTimeout(timeout);
			timeout = setTimeout(() => func.apply(this, args), wait);
		};
	},

	/**
	 * Determines if the current device is a mobile device.
	 * @returns {boolean} True if the device is a mobile device, false otherwise.
	 */
	isMobile(this: NMPlayer): boolean {
		return matchMedia('(max-width: 520px) and (orientation: portrait), (max-height: 520px) and (orientation: landscape)').matches;
	},

	/**
	 * Determines if the current device is a TV based on the user agent string or the window dimensions.
	 * @returns {boolean} True if the current device is a TV, false otherwise.
	 */
	isTv(this: NMPlayer): boolean {
		return matchMedia('(width: 960px) and (height: 540px)').matches;
	},

	/**
	 * Checks if the player element is currently in the viewport.
	 * @returns {boolean} True if the player is in the viewport, false otherwise.
	 */
	isInViewport(this: NMPlayer): boolean {
		const rect = this.videoElement.getBoundingClientRect();
		const windowHeight = (window.innerHeight || document.documentElement.clientHeight);
		const windowWidth = (window.innerWidth || document.documentElement.clientWidth);

		const vertInView = (rect.top <= windowHeight) && ((rect.top + rect.height) >= 0);
		const horInView = (rect.left <= windowWidth) && ((rect.left + rect.width) >= 0);

		return (vertInView && horInView);
	},
};

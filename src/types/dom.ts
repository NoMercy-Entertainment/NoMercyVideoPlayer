export interface CreateElement<T extends Element> {
	addClasses: (names: string[]) => AddClasses<T>;
	appendTo: <P extends Element>(parent: P) => AddClassesReturn<T>;
	prependTo: <P extends Element>(parent: P) => AddClassesReturn<T>;
	get: () => T;
}

export interface AddClasses<T extends Element> {
	appendTo: <P extends Element>(parent: P) => AddClassesReturn<T>;
	prependTo: <P extends Element>(parent: P) => AddClassesReturn<T>;
	addClasses: (names: string[]) => AddClasses<T>;
	get: () => T;
}

export interface AddClassesReturn<T extends Element> {
	addClasses: (names: string[]) => AddClasses<T>;
	get: () => T;
}

export interface Icon {
	[key: string]: {
		classes: string[];
		hover: string;
		normal: string;
		title: string;
	};
}

export interface NMPlayerDom {
	/**
	 * Creates a new HTML element of the specified type and assigns the given ID to it.
	 * @param type - The type of the HTML element to create.
	 * @param id - The ID to assign to the new element.
	 * @param unique - Whether to use an existing element with the specified ID if it already exists.
	 * @returns An object with four methods:
	 *   - `addClasses`: adds the specified CSS class names to the element's class list and returns the functions recursively.
	 *   - `appendTo`: appends the element to a parent element and returns addClasses and get methods.
	 *   - `prependTo`: prepends the element to a parent element and returns addClasses and get methods.
	 *   - `get`: returns the created element.
	 */
	createElement<K extends keyof HTMLElementTagNameMap>(type: K, id: string, unique?: boolean): CreateElement<HTMLElementTagNameMap[K]>;

	/**
	 * Adds the specified CSS class names to the given element's class list.
	 * @param parent - The element to add the classes to.
	 * @param names - An array of CSS class names to add.
	 * @returns An object with four methods:
	 *   - `addClasses`: adds more CSS class names to the element (for chaining).
	 *   - `appendTo`: appends the element to a parent element and returns addClasses and get methods.
	 *   - `prependTo`: prepends the element to a parent element and returns addClasses and get methods.
	 *   - `get`: returns the created element.
	 */
	addClasses<T extends Element>(parent: T, names: string[]): AddClasses<T>;

	/**
	 * Creates an SVG icon element with a dual-path structure (normal + hover) and appends it to the parent.
	 * Optionally attaches tooltip listeners on mouseenter/mouseleave.
	 * @param parent - The parent element to append the SVG to.
	 * @param id - The ID to assign to the SVG element.
	 * @param icon - The icon definition containing classes, hover path, and normal path.
	 * @param hidden - Whether the SVG should be initially hidden. Defaults to `false`.
	 * @param hovered - Whether to swap the normal/hover paths and attach tooltip listeners. Defaults to `false`.
	 * @returns The created SVG element.
	 */
	createSVGElement(parent: Element, id: string, icon: Icon['path'], hidden?: boolean, hovered?: boolean): SVGElement;

	/**
	 * Creates a styled button element for the player UI with standard Tailwind classes, appends it to the parent,
	 * and sets up keyboard event listeners for Backspace and Escape.
	 * @param parent - The parent element to append the button to.
	 * @param id - The ID to assign to the button.
	 * @param title - Optional custom aria-label. Defaults to a title-cased version of the id.
	 * @returns A chainable builder with `addClasses` and `get` methods.
	 */
	createUiButton(parent: HTMLElement, id: string, title?: string): AddClassesReturn<HTMLButtonElement>;

	/**
	 * Appends script and stylesheet files to the document head.
	 * Supports `.js` (script) and `.css` (link) file extensions.
	 * Accepts a single file path string or an array of file paths.
	 * @param files - The file path(s) to append to the document head.
	 * @returns A promise that resolves when all files have been successfully loaded.
	 * @throws {Error} If an unsupported file type is provided.
	 */
	appendScriptFilesToDocument(files: string | string[]): Promise<void[]>;

	/**
	 * Creates a button with an SVG icon and prepends or appends it as a child of the element matching `match`.
	 * Sets up click and right-click event handlers and keyboard event listeners.
	 * @param match - A CSS selector for the parent element to insert into.
	 * @param id - The ID to assign to the button.
	 * @param insert - Whether to prepend (`'before'`) or append (`'after'`) to the matched element.
	 * @param icon - The icon definition containing classes, hover path, normal path, and title.
	 * @param click - Optional click event handler.
	 * @param rightClick - Optional right-click (contextmenu) event handler.
	 * @returns A chainable builder for the created button.
	 */
	createButton(match: string, id: string, insert: 'before' | 'after', icon: Icon['path'], click?: (e?: MouseEvent) => void, rightClick?: (e?: MouseEvent) => void): CreateElement<HTMLButtonElement>;

	/**
	 * Finds the closest visible element matching the selector, based on vertical proximity to the given element.
	 * Only considers elements with `display: flex`.
	 * @param element - The reference element to measure proximity from.
	 * @param selector - A CSS selector to match candidate elements.
	 * @returns The closest matching element, or `null` if none found.
	 */
	getClosestElement(element: HTMLButtonElement, selector: string): HTMLElement | null;

	/**
	 * Smoothly scrolls an element to the vertical center of its container using `requestAnimationFrame`.
	 * @param el - The element to scroll into view.
	 * @param container - The scrollable container element.
	 * @param options - Optional scroll behavior configuration.
	 * @param options.duration - Animation duration in milliseconds. Defaults to 60.
	 * @param options.margin - Vertical margin divisor for centering. Defaults to 1.5.
	 */
	scrollCenter(el: HTMLElement, container: HTMLElement, options?: { duration?: number; margin?: number }): void;

	/**
	 * Smoothly scrolls an element horizontally into the visible area of its parent container
	 * using `requestAnimationFrame` with a 200ms animation duration.
	 * @param element - The element to scroll into view.
	 */
	scrollIntoView(element: HTMLElement): void;

	/**
	 * Returns the keyboard shortcut key string for a given UI button ID.
	 * For example, `'play'` returns the localized equivalent of `'(SPACE)'`, `'fullscreen'` returns `'(f)'`.
	 * @param id - The button ID to look up.
	 * @returns The keyboard shortcut string in parentheses, or an empty string if none is assigned.
	 */
	getButtonKeyCode(id: string): string;

	/**
	 * Creates a handler function that distinguishes between single-tap and double-tap events.
	 * Uses the configured `doubleClickDelay` (default 300ms) to differentiate taps.
	 * @param doubleTap - The function to execute on a double-tap event.
	 * @param singleTap - Optional function to execute on a single-tap event (fires after the delay).
	 * @returns A function that can be used as an event listener to detect tap patterns.
	 */
	doubleTap(doubleTap: (event: Event) => void, singleTap?: (event2: Event) => void): (event: Event, event2?: Event) => void;

	/**
	 * Converts a snake_case string to camelCase.
	 * @param str - The snake_case string to convert.
	 * @returns The camelCase version of the string.
	 */
	snakeToCamel(str: string): string;

	/**
	 * Converts a space-separated string to camelCase.
	 * @param str - The space-separated string to convert.
	 * @returns The camelCase version of the string.
	 */
	spaceToCamel(str: string): string;

	/**
	 * Returns the value in the array that is closest to the given number.
	 * @param arr - The array of numbers to search.
	 * @param val - The target value to find the nearest match for.
	 * @returns The closest value from the array.
	 */
	nearestValue(arr: number[], val: number): number;

	/**
	 * Type guard that checks whether a value is a valid integer.
	 * Uses `parseInt` internally, so string representations of numbers return `true`.
	 * @param value - The value to check.
	 * @returns `true` if the value can be parsed as an integer.
	 */
	isNumber(value: any): value is number;

	/**
	 * Returns the start time of the preview time interval that contains the current playback position.
	 * Searches the `previewTime` array for an interval where `start <= currentTime < end`.
	 * @returns The start time of the matching preview interval, or `undefined` if none matches.
	 */
	getClosestSeekableInterval(): number;

	/**
	 * Extracts the value of a query parameter from a URL string.
	 * @param name - The parameter name to extract.
	 * @param url - Optional URL to parse. Defaults to the current window location.
	 * @returns The parameter value, or `null` if not found.
	 */
	getParameterByName<T extends number | string = string | number>(name: string, url?: string): T | null;

	/**
	 * Creates a debounced version of a function that delays invocation until after
	 * the specified wait time has elapsed since the last call.
	 * @param func - The function to debounce.
	 * @param wait - The debounce delay in milliseconds.
	 * @returns The debounced function.
	 */
	debounce(func: (...args: any[]) => void, wait: number): (...args: any[]) => void;

	/**
	 * Displays a transient overlay message in the center of the player.
	 * The message automatically disappears after the specified duration.
	 * Useful for feedback on volume changes, track switches, aspect ratio changes, etc.
	 * @param value - The message text to display.
	 * @param time - How long to display the message in milliseconds. Defaults to 2000.
	 */
	displayMessage(value: string, time?: number): void;

	/**
	 * Determines if the current device is a mobile device based on viewport dimensions and orientation.
	 * Uses media queries: max-width 520px in portrait or max-height 520px in landscape.
	 * @returns `true` if the device is mobile.
	 */
	isMobile(): boolean;

	/**
	 * Determines if the current device is a TV based on specific viewport dimensions (960x540).
	 * @returns `true` if the device appears to be a TV.
	 */
	isTv(): boolean;

	/**
	 * Checks whether the player container element is currently visible in the viewport.
	 * Uses `getBoundingClientRect()` to determine visibility.
	 * @returns `true` if the element is at least partially visible.
	 */
	isInViewport(): boolean;
}

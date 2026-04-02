import type { NMPlayer, SubtitleStyle, SubtitleTrack, Track } from '../types';
import type { VTTData } from 'webvtt-parser';
import { WebVTTParser } from 'webvtt-parser';

export const subtitleMethods = {
	subtitle(this: NMPlayer, index?: number): SubtitleTrack | undefined | void {
		if (index === undefined) {
			if (this.currentSubtitleIndex === -1)
				return undefined;
			return this.subtitles()[this.currentSubtitleIndex];
		}

		// Same subtitle already selected — no-op
		if (index === this.currentSubtitleIndex)
			return;

		const subs = this.subtitles();
		if (index < -1 || index >= subs.length) {
			this.logger.warn('subtitle() index out of bounds', { index, count: subs.length });
			return;
		}

		this.currentSubtitleFile = '';
		this.currentSubtitleIndex = index;
		this._subtitles = <VTTData>{};
		this.subtitleText.textContent = '';
		this.subtitleOverlay.style.display = 'none';
		this.emit('subtitleChanged', this.subtitle());
		this.emit('captionsChanged', this.subtitle());
		this.storeSubtitleChoice();

		if (index < 0)
			return;

		this.fetchSubtitleFile();
	},

	/**
	 * Returns an array of subtitle tracks for the current playlist item.
	 * @returns {Array} An array of subtitle tracks for the current playlist item.
	 */
	subtitles(this: NMPlayer): SubtitleTrack[] {
		return this.playlistItem()?.tracks?.filter((t: Track): t is SubtitleTrack => t.kind === 'subtitles').map((level: SubtitleTrack, index: number): SubtitleTrack => ({
			...level,
			id: index,
			ext: level.file.split('.').at(-1) ?? 'vtt',
			type: level.label?.includes('Full') || level.label?.includes('full') ? 'full' : 'sign',
		})) ?? [];
	},

	subtitleIndex(this: NMPlayer): number {
		return this.currentSubtitleIndex;
	},

	subtitleIndexBy(this: NMPlayer, language: string, type: string, ext: string): number | undefined {
		const list = this.subtitles();
		const index = list.findIndex(t => (t.file ?? String(t.id)).endsWith(`${language}.${type}.${ext}`));
		if (index !== -1)
			return index;

		const fallback = list.findIndex(t =>
			t.language === language && t.type === type && t.ext === ext);
		if (fallback === -1)
			return undefined;
		return fallback;
	},

	hasSubtitles(this: NMPlayer): boolean {
		return (this.subtitles()?.length ?? 0) > 0;
	},

	/**
	 * Cycles through the available subtitle tracks and sets the active track to the next one.
	 * If there are no subtitle tracks, this method does nothing.
	 * If the current track is the last one, this method sets the active track to the first one.
	 * Otherwise, it sets the active track to the next one.
	 * Finally, it displays a message indicating the current subtitle track.
	 */
	cycleSubtitles(this: NMPlayer): void {
		if (!this.hasSubtitles()) {
			return;
		}

		const subtitleList = this.subtitles();
		const currentIndex = this.subtitleIndex();

		if (currentIndex >= subtitleList.length - 1) {
			this.subtitle(-1);
		}
		else {
			this.subtitle(currentIndex + 1);
		}

		const sub = this.subtitle();
		const label = sub?.language ? `${this.localize(sub.language)} ${sub.label ?? ''}`.trim() : '';
		this.displayMessage(`${this.localize('Subtitles')}: ${label || this.localize('Off')}`);
	},

	fetchSubtitleFile(this: NMPlayer): void {
		const file = this.subtitleFile();
		if (file && this.currentSubtitleFile !== file) {
			this.currentSubtitleFile = file;
			this.getFileContents<string>({
				url: file,
				options: {
					anonymous: false,
				},
				callback: (data) => {
					if (!data.startsWith('WEBVTT\n') && !data.startsWith('WEBVTT\r'))
						return;

					data = data.replace(/Kind: captions\nLanguage: \w+/g, '');
					data = data.replace(/align:middle/g, 'align:center');
					data = data.replace(/<\d{2}:\d{2}:\d{2}.\d{3}>|<c>|<\/c>/giu, '');

					const parser = new WebVTTParser();
					this._subtitles = parser.parse(data, 'captions');
					this.storeSubtitleChoice();

					this.once('duration', () => {
						this.emit('subtitles', this._subtitles);
					});
				},
			}).catch(() => {});
		}
		else {
			this.storeSubtitleChoice();
		}
	},

	/**
	 * This method is called every time event of the video element.
	 * It will generate the content of the subtitle overlay.
	 */
	checkSubtitles(this: NMPlayer): void {
		const currentTime = this.videoElement.currentTime;
		let subtitleCue: any = null;

		this._subtitles.cues?.forEach((sub) => {
			if (currentTime >= sub.startTime && currentTime <= sub.endTime) {
				if (subtitleCue && sub.text === subtitleCue.text) {
					return;
				}
				subtitleCue = sub;
			}
		});

		this.subtitleText.innerHTML = '';
		if (subtitleCue) {
			if (subtitleCue.size >= 0 && subtitleCue.size <= 100) {
				this.subtitleArea.classList.add('sized');
				this.subtitleArea.style.width = `${subtitleCue.size}%`;
				this.subtitleArea.style.left = `${(100 - subtitleCue.size) / 2}%`;
			}
			else {
				this.subtitleArea.classList.remove('sized');
				this.subtitleArea.style.width = `100%`;
				this.subtitleArea.style.left = `0%`;
			}

			const fragment = this.buildSubtitleFragment(subtitleCue.text);
			this.subtitleText.appendChild(fragment);
			this.subtitleText.setAttribute('data-language', this.subtitle()?.language ?? '');
			requestAnimationFrame(() => {
				this.computeSubtitlePosition(subtitleCue, this.videoElement, this.subtitleArea, this.subtitleText);
			});
		}

		this.subtitleOverlay.style.display = 'block';
	},

	buildSubtitleFragment(this: NMPlayer, text: string): DocumentFragment {
		const fragment = document.createDocumentFragment();

		if (!text)
			return fragment;

		// Strip unrecognised VTT inline tags: <c.classname>, <v Name>, <ruby>, <rt>, <lang>,
		// and WebVTT timestamp tags like <00:01:23.456>. Keep <i>, <b>, <u> and their
		// closing counterparts so they go through the HTML parser below.
		const cleaned = text
			.replace(/<\d{2}:\d{2}:\d{2}\.\d{3}>/g, '')
			.replace(/<\/?(?:c(?:\.[^>]*)?|v(?:\s[^>]*)?|ruby|rt|lang(?:\.[^>]*)?)>/gi, '');

		// Use a lightweight recursive parser so that nested tags like <b><i>x</i></b>
		// are handled correctly instead of the previous flat split approach.
		const TAG_RE = /(<\/?(i|b|u)>)/gi;
		const stack: (DocumentFragment | HTMLElement)[] = [fragment];

		let lastIndex = 0;
		let match: RegExpExecArray | null;

		TAG_RE.lastIndex = 0;
		while ((match = TAG_RE.exec(cleaned)) !== null) {
			const before = cleaned.slice(lastIndex, match.index);
			if (before) {
				stack.at(-1)!.appendChild(document.createTextNode(before));
			}

			const fullTag = match[1];
			const tagName = match[2].toLowerCase();
			const isClosing = fullTag.startsWith('</');

			if (!isClosing) {
				const el = document.createElement(tagName);
				stack.at(-1)!.appendChild(el);
				stack.push(el);
			}
			else {
				// Pop back to the matching open tag; gracefully ignore unmatched closers
				for (let i = stack.length - 1; i > 0; i--) {
					const top = stack[i] as HTMLElement;
					if (top.tagName && top.tagName.toLowerCase() === tagName) {
						stack.splice(i, 1);
						break;
					}
				}
			}

			lastIndex = match.index + fullTag.length;
		}

		const tail = cleaned.slice(lastIndex);
		if (tail) {
			stack.at(-1)!.appendChild(document.createTextNode(tail));
		}

		return fragment;
	},

	subtitleStyle(this: NMPlayer, value?: Partial<SubtitleStyle>): SubtitleStyle | void {
		if (value === undefined)
			return this._subtitleStyle;
		this._subtitleStyle = { ...this._subtitleStyle, ...value };
		this.applySubtitleStyle();
	},

	/**
	 * Triggers the styled subtitles based on the provided file.
	 */
	async storeSubtitleChoice(this: NMPlayer) {
		const current = this.subtitle();
		if (!current) {
			await this.storage.remove('subtitle-language');
			await this.storage.remove('subtitle-type');
			await this.storage.remove('subtitle-ext');
			return;
		}

		const { language, type, ext } = current;
		if (!language || !type || !ext)
			return;

		await this.storage.set('subtitle-language', language);
		await this.storage.set('subtitle-type', type);
		await this.storage.set('subtitle-ext', ext);
	},

	async setCurrentCaptionFromStorage(this: NMPlayer): Promise<void> {
		if (this.options.disableAutoPlayback)
			return;

		const subtitleLanguage = await this.storage.get('subtitle-language', null);
		const subtitleType = await this.storage.get('subtitle-type', null);
		const subtitleExt = await this.storage.get('subtitle-ext', null);

		if (subtitleLanguage && subtitleType && subtitleExt) {
			const track = this.subtitleIndexBy(
				subtitleLanguage as string,
				subtitleType as string,
				subtitleExt as string,
			);

			if (track == null || track === -1)
				return;

			this.logger.debug('Restoring subtitle from storage', { track });
			this.subtitle(track);
		}
	},

	/**
	 * Returns the file associated with the current subtitle track.
	 * @returns {string | undefined} The subtitle file URL, or undefined if no subtitle is selected.
	 */
	subtitleFile(this: NMPlayer): string | undefined {
		return this.subtitle()?.file;
	},
};

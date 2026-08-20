// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

/**
 * Feedback mixin — loading/buffering spinner, toast messages, error lines.
 *
 * Owns: wireFeedback, showMessage, hideMessage.
 *
 * The `messageEl` and `messageTimer` fields live on the plugin class
 * (DesktopUiPlugin). This mixin reads and writes them via DesktopUiInternals.
 */

import type { DesktopUiInternals } from '../internals';

export const feedbackMethods = {
	wireFeedback(this: DesktopUiInternals): void {
		// `busy` on the plugin's own center wrapper, never the container's
		// `buffering`: the container's playback-state classes are core's rules
		// table, and a phase swap there wipes anything this plugin writes into
		// the group. styles.css shows the spinner for either.
		const showBuffer = (textKey: string): void => {
			this.centerWrap.classList.add('busy');
			this.showMessage(this.t(textKey), undefined, true);
		};
		const clearFeedback = (): void => {
			this.centerWrap.classList.remove('busy');
			if (this.messageIsFeedback)
				this.hideMessage();
		};

		// Initial load — only true if the player actually has something queued.
		// A player can now legitimately mount with nothing queued (a disc-menu
		// idle state, playSegment's menu window) — assuming a load is always
		// underway at mount left "Loading…" stuck on screen forever for that
		// case, since no `item`/`canplay`/`waiting` event was ever coming to
		// clear it.
		if (this.player.queueLength() > 0)
			showBuffer('message.loading');

		this.on('waiting', () => showBuffer('message.buffering'));
		this.on('stalled', () => showBuffer('message.buffering'));
		this.on('item', () => showBuffer('message.loading'));
		// A load ends at `canplay`, which arrives whether or not anybody pressed
		// play — `playing` and `time` do not. Same signal core drops `buffering`
		// on, so both layers end the load at the same instant.
		this.on('canplay', clearFeedback);
		this.on('playing', clearFeedback);
		this.on('time', clearFeedback);

		this.on('error', () => {
			this.centerWrap.classList.remove('busy');
			this.showMessage(this.t('message.error'), undefined, true);
		});

		this.on('display-message', (data) => {
			const payload = data as { text?: string; ms?: number } | undefined;
			if (payload?.text)
				this.showMessage(payload.text, payload.ms);
		});
		this.on('remove-message', () => this.hideMessage());
	},

	showMessage(this: DesktopUiInternals, text: string, ms?: number, isFeedback = false): void {
		if (!this.messageEl) {
			const el = document.createElement('div');
			el.className = 'player-message';
			this.player.container.appendChild(el);
			this.messageEl = el;
		}
		this.messageEl.textContent = text;
		this.messageEl.classList.add('visible');
		this.messageIsFeedback = isFeedback;

		if (this.messageTimer !== null) {
			clearTimeout(this.messageTimer);
			this.messageTimer = null;
		}
		if (typeof ms === 'number' && ms > 0) {
			/* this.timeout wraps the plugin scheduler; field typed as ReturnType<typeof setTimeout> for clearTimeout compatibility */
			this.messageTimer = this.timeout(() => {
				this.messageTimer = null;
				this.hideMessage();
			}, ms) as unknown as ReturnType<typeof setTimeout>;
		}
	},

	hideMessage(this: DesktopUiInternals): void {
		this.messageIsFeedback = false;
		this.messageEl?.classList.remove('visible');
	},
} as const;

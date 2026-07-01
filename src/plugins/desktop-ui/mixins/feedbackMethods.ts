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
		const container = this.player.container;

		const showBuffer = (textKey: string): void => {
			container.classList.add('buffering');
			this.showMessage(this.t(textKey), undefined, true);
		};
		const clearFeedback = (): void => {
			container.classList.remove('buffering');
			if (this.messageIsFeedback)
				this.hideMessage();
		};

		// Initial load — the player is mounting media right now.
		showBuffer('message.loading');

		this.on('waiting', () => showBuffer('message.buffering'));
		this.on('stalled', () => showBuffer('message.buffering'));
		this.on('item', () => showBuffer('message.loading'));
		this.on('playing', clearFeedback);
		this.on('time', clearFeedback);

		this.on('error', () => {
			container.classList.remove('buffering');
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

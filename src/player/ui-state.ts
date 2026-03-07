import type { NMPlayer } from '../types';

export const uiStateMethods = {
	ui_addActiveClass(this: NMPlayer): void {
		const wasActive = this.container.classList.contains('active');
		this.container.classList.remove('inactive');
		this.container.classList.add('active');

		if (!wasActive) {
			this.emit('active', true);
			this.emit('controls', true);
		}
	},

	ui_removeActiveClass(this: NMPlayer): void {
		const wasActive = this.container.classList.contains('active');
		this.container.classList.remove('active');
		this.container.classList.add('inactive');

		if (wasActive) {
			this.emit('active', false);
			this.emit('controls', false);
		}
	},

	ui_resetInactivityTimer(this: NMPlayer): void {
		if (this.inactivityTimeout) {
			clearTimeout(this.inactivityTimeout);
		}

		this.ui_addActiveClass();

		if (this.lockActive)
			return;

		this.inactivityTimeout = setTimeout(() => {
			this.ui_removeActiveClass();
		}, this.inactivityTime);
	},

	handleMouseLeave(this: NMPlayer, event: MouseEvent) {
		if (this.lockActive)
			return;

		const relatedTarget = event.relatedTarget as HTMLElement;
		if (relatedTarget && (relatedTarget.tagName === 'BUTTON' || relatedTarget.tagName === 'INPUT')) {
			return;
		}
		this.ui_removeActiveClass();
	},

	handleMouseEnter(this: NMPlayer, event: MouseEvent) {
		const target = event.target as HTMLElement;
		if (target && (target.tagName === 'BUTTON' || target.tagName === 'INPUT')) {
			this.ui_addActiveClass();
		}
	},
};

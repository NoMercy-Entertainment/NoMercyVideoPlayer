export interface NMPlayerUiState {
	/** Removes the active CSS class from the player container. */
	ui_removeActiveClass(): void;

	/** Resets the inactivity timer for auto-hiding UI controls. */
	ui_resetInactivityTimer(event?: Event): void;
}

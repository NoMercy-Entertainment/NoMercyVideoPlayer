import Plugin from './plugin';

class MessagePlugin extends Plugin {
	static readonly id = 'message';
	private messageElement: HTMLButtonElement | null = null;
	private onMessage = (val: string) => {
		if (this.messageElement) {
			this.messageElement.style.display = 'flex';
			this.messageElement.textContent = val;
		}
	};

	private onDismiss = () => {
		if (this.messageElement) {
			this.messageElement.style.display = 'none';
			this.messageElement.textContent = '';
		}
	};

	use() {
		const player = this.player;

		this.messageElement = player.createElement('button', `${player.playerId}-player-message`)
			.addClasses(['player-message'])
			.prependTo(player.overlay)
			.get();

		player.on('message', this.onMessage);
		player.on('message-dismiss', this.onDismiss);
	}

	dispose() {
		this.player.off('message', this.onMessage);
		this.player.off('message-dismiss', this.onDismiss);
		this.messageElement?.remove();
		this.messageElement = null;
	}
}

export default MessagePlugin;

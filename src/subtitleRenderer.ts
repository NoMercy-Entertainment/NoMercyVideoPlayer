import { SubtitleStyle, NMPlayer, PlayerConfig } from "./types";
import { parseColorToHex } from "./helpers";

export class SubtitleRenderer<T extends Partial<PlayerConfig> = {}> {
    private player: NMPlayer<T>;

    constructor(player: NMPlayer<T>) {
        this.player = player;
    }

    setSubtitleStyle(style: SubtitleStyle): void {
		this.player.subtitleStyle = { ...this.player.subtitleStyle, ...style };
		this.applySubtitleStyle();
	}

	getSubtitleStyle(): SubtitleStyle {
		return this.player.subtitleStyle;
	}

	private applySubtitleStyle(): void {
		this.player.storage.set('subtitle-style', this.player.subtitleStyle).then();

		const { fontSize, fontFamily, textColor: fontColor, backgroundColor, backgroundOpacity, edgeStyle, areaColor: windowColor, windowOpacity } = this.player.subtitleStyle;

		const areaElement = this.player.subtitleArea.style;
		const textElement = this.player.subtitleText.style;

		console.log('Applying subtitle style', this.player.subtitleStyle);

		if (fontSize) textElement.fontSize = fontSize;
		if (fontFamily) textElement.fontFamily = fontFamily;
		if (fontColor) textElement.color = fontColor;
		
		if (edgeStyle) textElement.textShadow = this.getEdgeStyle(edgeStyle);

		if (backgroundColor) {
			console.log('Setting background color', parseColorToHex(backgroundColor, backgroundOpacity ?? 1));
			textElement.backgroundColor = parseColorToHex(backgroundColor, backgroundOpacity ?? 1)!;
		}
		if (windowColor) {
			console.log('Setting window color', parseColorToHex(windowColor, windowOpacity ?? 1));
			areaElement.backgroundColor = parseColorToHex(windowColor, windowOpacity ?? 1)!;
		}
	}

	private getEdgeStyle(edgeStyle: any): string {
		switch (edgeStyle) {
			case 'depressed':
				return '1px 1px 2px black';
			case 'dropshadow':
				return '2px 2px 4px black';
			case 'raised':
				return '-1px -1px 2px black';
			case 'uniform':
				return '0px 0px 4px black';
			case 'textShadow':
				return 'black 0px 0px 4px, black 0px 0px 4px, black 0px 0px 4px, black 0px 0px 4px, black 0px 0px 4px, black 0px 0px 4px, black 0px 0px 4px';
			default:
				return '';
		}
	}

	setSubtitleFontSize(fontSize: string): void {
		this.player.subtitleStyle.fontSize = fontSize;
		this.applySubtitleStyle();
	}

	getSubtitleFontSize(): string | undefined {
		return this.player.subtitleStyle.fontSize;
	}

	setSubtitleFontFamily(fontFamily: string): void {
		this.player.subtitleStyle.fontFamily = fontFamily;
		this.applySubtitleStyle();
	}

	getSubtitleFontFamily(): string | undefined {
		return this.player.subtitleStyle.fontFamily;
	}

	setSubtitleTextColor(fontColor: string): void {
		this.player.subtitleStyle.textColor = fontColor;
		this.applySubtitleStyle();
	}

	getSubtitleTextColor(): string | undefined {
		return this.player.subtitleStyle.textColor;
	}

	setSubtitleBackgroundColor(backgroundColor: string): void {
		this.player.subtitleStyle.backgroundColor = backgroundColor;
		this.applySubtitleStyle();
	}

	getSubtitleBackgroundColor(): string | undefined {
		return this.player.subtitleStyle.backgroundColor;
	}

	setSubtitleBackgroundOpacity(backgroundOpacity: number): void {
		this.player.subtitleStyle.backgroundOpacity = backgroundOpacity;
		this.applySubtitleStyle();
	}

	getSubtitleBackgroundOpacity(): number | undefined {
		return this.player.subtitleStyle.backgroundOpacity;
	}

	setSubtitleAreaColor(areaColor: string): void {
		this.player.subtitleStyle.areaColor = areaColor;
		this.applySubtitleStyle();
	}

	getSubtitleAreaColor(): string | undefined {
		return this.player.subtitleStyle.areaColor;
	}

	setSubtitleAreaOpacity(windowOpacity: number): void {
		this.player.subtitleStyle.windowOpacity = windowOpacity;
		this.applySubtitleStyle();
	}

	setSubtitleTextEdgeStyle(edgeStyle: any): void {
		this.player.subtitleStyle.edgeStyle = edgeStyle;
		this.applySubtitleStyle();
	}

	getSubtitleTextEdgeStyle(): any | undefined {
		return this.player.subtitleStyle.edgeStyle;
	}

	getSubtitleTextWindowOpacity(): number | undefined {
		return this.player.subtitleStyle.windowOpacity;
	}
}

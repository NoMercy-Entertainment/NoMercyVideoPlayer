export interface SubtitlesOctopusOptions {
	video: HTMLVideoElement;
	subUrl: string;
	fonts?: string[];
	lossyRender?: boolean;
	accessToken?: string;
	targetFps?: number;
	debug?: boolean;
	blendRender?: boolean;
	lazyFileLoading?: boolean;
	renderAhead?: number;
	workerUrl?: string;
	legacyWorkerUrl?: string;
	fallbackFont?: string;
	onReady?: () => void;
	onError?: (event: unknown) => void;
}

declare class SubtitlesOctopus {
	worker: Worker;
	canvasParent: HTMLDivElement;

	constructor(options: SubtitlesOctopusOptions);
	dispose(): void;
}

export default SubtitlesOctopus;

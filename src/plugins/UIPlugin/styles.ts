
export const bottomBarStyles = [
	'bottom-bar',
	'nm-z-10',
	'nm-flex',
	'nm-flex-col',
	'nm-items-center',
	'nm-w-full',
	'nm-gap-2',
	'nm-text-center',
	'nm-px-6',
	'nm-py-4',
	'nm-mt-auto',
	'nm-translate-y-full',
	'group-[&.nomercyplayer.active]:nm-translate-y-0',
	'group-[&.nomercyplayer.paused]:!nm-translate-y-0',
	'group-[&.nomercyplayer:has(.open)]:!nm-translate-y-0',
	'nm-transition-all',
	'nm-duration-300',
];

export const bottomBarShadowStyles = [
	'nm-absolute',
	'nm-pointer-events-none',
	'nm-bottom-0',
	'nm-bg-gradient-to-t',
	'nm-via-black/20',
	'nm-from-black/90',
	'nm-pt-[20%]',
	'nm-w-available',
];

export const bottomRowStyles = [
	'bottom-row',
	'nm-flex',
	'nm-h-10',
	'nm-mb-2',
	'nm-p-1',
	'nm-px-4',
	'nm-items-center',
	'nm-relative',
	'nm-w-available',
];

export const buttonBaseStyles = [
	'button-base',
	'nm-flex',
	'nm-h-10',
	'nm-items-center',
	'nm-justify-center',
	'nm-w-10',
];

export const buttonStyles = [
	'nm-cursor-pointer',
	'nm-fill-white',
	'tv:nm-fill-white/30',
	'focus-visible:nm-fill-white',
	'nm-flex',
	'-nm-outline-offset-2',
	'focus-visible:nm-outline',
	'focus-visible:nm-outline-2',
	'focus-visible:nm-outline-white/20',
	'nm-group/button',
	'nm-h-10',
	'nm-items-center',
	'nm-justify-center',
	'nm-p-2',
	'nm-relative',
	'nm-rounded-full',
	'nm-w-10',
	'nm-min-w-[40px]',
];

export const centerStyles = [
	'center',
	'nm-absolute',
	'nm-grid',
	'nm-grid-cols-3',
	'nm-grid-rows-6',
	'nm-h-full',
	'nm-w-full',
	'nm-z-0',
];

export const chapterBarStyles = [
	'chapter-bar',
	'nm-bg-transparent',
	'nm-flex',
	'nm-h-2',
	'nm-relative',
	'nm-rounded-full',
	'nm-overflow-clip',
	'nm-w-available',
];

export const chapterMarkersStyles = [
	'chapter-marker',
	'nm-min-w-[2px]',
	'nm-absolute',
	'nm-h-available',
	'last:nm-translate-x-[1.5px]',
	'[&:last-child(2):.5px]',
	'nm-rounded-sm',
	'nm-overflow-hidden',
];

export const chapterMarkerBGStyles = [
	'chapter-marker-bg',
	'nm-bg-white/20',
	'nm-absolute',
	'nm-h-available',
	'nm-left-0',
	'nm-w-available',
	'nm-z-0',
	'nm-rounded-sm',
];

export const chapterMarkerBufferStyles = [
	'chapter-marker-buffer',
	'nm-absolute',
	'nm-bg-gray-300/30',
	'nm-h-available',
	'nm-left-0',
	'nm-origin-left',
	'nm-scale-x-0',
	'nm-w-available',
	'nm-z-10',
	'nm-rounded-sm',
];

export const chapterMarkerHoverStyles = [
	'chapter-marker-hover',
	'nm-absolute',
	'nm-bg-gray-200',
	'nm-h-available',
	'nm-left-0',
	'nm-origin-left',
	'nm-scale-x-0',
	'nm-w-available',
	'nm-z-10',
	'nm-rounded-sm',
];

export const chapterMarkerProgressStyles = [
	'chapter-marker-progress',
	'nm-absolute',
	'nm-bg-white',
	'nm-h-available',
	'nm-left-0',
	'nm-origin-left',
	'nm-scale-x-0',
	'nm-w-available',
	'nm-z-20',
	'nm-rounded-sm',
];

export const chapterTextStyles = ['chapter-text'];

export const dividerStyles = [
	'divider',
	'nm-flex',
	'nm-flex-1',
];

export const iconStyles = ['nm-text-white'];

export const languageButtonSpanStyles = [
	'language-button-span',
	'nm-MuiSvgIcon-root',
	'nm-cursor-pointer',
	'nm-h-6',
	'nm-object-contain',
	'nm-rounded-sm',
	'nm-w-6',
];

export const mainMenuStyles = [
	'main-menu',
	'nm-bg-neutral-900/95',
	'nm-duration-300',
	'nm-flex',
	'nm-flex-col',
	'nm-gap-1',
	'nm-h-auto',
	'nm-mt-auto',
	'nm-overflow-clip',
	'nm-p-2',
	'nm-pt-0',
	'nm-rounded-lg',
	'nm-w-1/2',
	'nm-max-h-full',
	'group-[&.nomercyplayer:has(.sub-menu-open)]:!nm-pointer-events-none',
];

export const menuButtonTextStyles = [
	'menu-button-text',
	'nm-cursor-pointer',
	'nm-font-semibold',
	'nm-pl-2',
	'nm-flex',
	'nm-gap-2',
	'nm-leading-[normal]',
];

export const menuContentStyles = [
	'menu-content',
	'nm-duration-300',
	'nm-flex',
	'nm-flex-row',
	'nm-overflow-clip',
	'nm-w-[200%]',
	'nm-h-available',
];

export const menuFrameStyles = [
	'menu-frame',
	'nm-fixed',
	'nm-overflow-clip',
	'nm-bottom-10',
	'nm-duration-300',
	'nm-flex',
	'nm-flex-col',
	'nm-hidden',
	'nm-right-[2%]',
	'nm-w-fit',
	'nm-z-50',
];

export const menuHeaderButtonTextStyles = [
	'menu-header-button-text',
	'nm-font-semibold',
	'nm-leading-[normal]',
	'nm-pl-2',
];

export const menuHeaderStyles = [
	'menu-header',
	'nm-flex',
	'nm-h-9',
	'nm-items-center',
	'nm-min-h-[2.5rem]',
	'nm-py-2',
	'nm-text-white',
	'nm-w-available',
];

export const scrollContainerStyles = [
	'scroll-container',
	'nm-flex',
	'nm-flex-col',
	'nm-gap-1',
	'nm-language-scroll-container',
	'nm-overflow-x-hidden',
	'nm-overflow-y-auto',
	'nm-p-2',
	'nm-w-available',

	// 	scroll-padding-block: 1rem;
	// scroll-snap-align: center;
	// scroll-behavior: smooth;
	'nm-scroll-p-4',
	'nm-scroll-snap-align-center',
	'nm-scroll-behavior-smooth',
];

export const sliderBarStyles = [
	'slider-bar',
	'nm-group/slider',
	'nm-flex',
	'nm-rounded-full',
	'nm-bg-white/20',
	'nm-h-2',
	'nm-mx-4',
	'nm-relative',
	'nm-w-available',
];

export const sliderBufferStyles = [
	'slider-buffer',
	'nm-absolute',
	'nm-flex',
	'nm-h-full',
	'nm-pointer-events-none',
	'nm-rounded-full',
	'nm-bg-white/20',
	'nm-z-0',
	'nm-overflow-hidden',
	'nm-overflow-clip',
];

export const sliderHoverStyles = [
	'slider-hover',
	'nm-absolute',
	'nm-opacity-1',
	'nm-flex',
	'nm-h-full',
	'nm-pointer-events-none',
	'nm-rounded-full',
	'nm-bg-white/30',
	'nm-z-0',
	'nm-overflow-hidden',
	'nm-overflow-clip',
];

export const sliderProgressStyles = [
	'slider-progress',
	'nm-absolute',
	'nm-flex',
	'nm-h-full',
	'nm-pointer-events-none',
	'nm-rounded-full',
	'nm-bg-white',
	'nm-z-10',
	'nm-overflow-hidden',
	'nm-overflow-clip',
];

export const sliderNippleStyles = [
	'slider-nipple',
	'nm--translate-x-1/2',
	'nm--translate-y-[25%]',
	'nm-absolute',
	'nm-hidden',
	'group-hover/slider:nm-flex',
	'nm-bg-white',
	'nm-h-4',
	'nm-left-0',
	'nm-rounded-full',
	'nm-top-0',
	'nm-w-4',
	'nm-z-20',
];

export const sliderPopImageStyles = ['slider-pop-image'];

export const sliderPopStyles = [
	'slider-pop',
	'nm--translate-x-1/2',
	'nm-absolute',
	'nm-bg-neutral-900/95',
	'nm-bottom-4',
	'nm-flex',
	'nm-flex-col',
	'nm-font-semibold',
	'nm-gap-1',
	'hover:nm-scale-110',
	'nm-overflow-clip',
	'nm-pb-1',
	'nm-pointer-events-none',
	'nm-rounded-md',
	'nm-text-center',
	'nm-z-20',
];

export const sliderTextStyles = [
	'slider-pop-text',
	'nm-font-mono',
];

export const speedButtonTextStyles = [
	'speed-button-text',
	'nm-cursor-pointer',
	'nm-font-semibold',
	'nm-pl-2',
	'nm-leading-[normal]',
];

export const subMenuContentStyles = [
	'sub-menu-content',
	'nm-flex',
	'nm-flex-col',
	'nm-gap-1',
	'nm-hidden',
	'nm-max-h-available',
	'nm-w-available',
	'nm-overflow-auto',
];

export const subMenuStyles = [
	'sub-menu',
	'nm-bg-neutral-900/95',
	'nm-duration-300',
	'nm-flex',
	'nm-flex-col',
	'nm-gap-1',
	'nm-h-auto',
	'nm-mt-auto',
	'nm-overflow-clip',
	'nm-rounded-lg',
	'nm-w-1/2',
	'nm-max-h-full',
	'nm-min-w-28',
];

export const svgSizeStyles = [
	'svg-size',
	'nm-h-5',
	'nm-w-5',
	'nm-pointer-events-none',
	'group-hover/button:nm-scale-110',
	'nm-duration-700',
];

export const timeStyles = [
	'time',
	'nm-flex',
	'nm-font-mono',
	'nm-items-center',
	'nm-pointer-events-none',
	'nm-select-none',
	'nm-text-sm',
];

export const topBarStyles = [
	'top-bar',
	'nm-z-10',
	'nm-flex',
	'nm-items-start',
	'nm-justify-between',
	'nm-w-full',
	'nm-gap-2',
	'nm-px-6',
	'nm-py-4',
	'nm-mb-auto',
	'-nm-translate-y-full',
	'group-[&.nomercyplayer.active]:nm-translate-y-0',
	'group-[&.nomercyplayer.paused]:!nm-translate-y-0',
	'group-[&.nomercyplayer:has(.open)]:!nm-translate-y-0',
	// 'group-[&.nomercyplayer:has(:focus)]:!nm-translate-y-0',
	'nm-transition-all',
	'nm-duration-300',
];

export const topRowStyles = [
	'top-row',
	'nm-flex',
	'nm-gap-1',
	'nm-h-2',
	'nm-items-center',
	'nm-pl-2',
	'nm-pr-2',
	'nm-relative',
	'nm-w-available',
];

export const touchPlaybackButtonStyles = [
	'touch-playback-button',
	'nm-pointer-events-none',
	'nm-fill-white',
];

export const touchPlaybackStyles = [
	'touch-playback',
	'nm-flex',
	'-nm-ml-2',
	'nm-items-center',
	'nm-justify-center',
];

export const volumeContainerStyles = [
	'volume-container',
	'nm-group/volume',
	'nm-flex',
	'nm-overflow-clip',
];

export const volumeSliderStyles = [
	'volume-slider',
	'nm-w-0',
	'nm-rounded-full',
	'nm-opacity-0',
	'nm-duration-300',
	'group-hover/volume:nm-w-20',
	'group-hover/volume:nm-mx-2',
	'group-hover/volume:nm-opacity-100',
	'group-focus-within/volume:nm-w-20',
	'group-focus-within/volume:nm-mx-2',
	'group-focus-within/volume:nm-opacity-100',
	'nm-appearance-none',
	'nm-volume-slider',
	'nm-bg-white/70',
	'nm-bg-gradient-to-r',
	'nm-from-white',
	'nm-to-white',
	'nm-self-center',
	'nm-h-1',
	'nm-bg-no-repeat',
	'nm-rounded-full',
	'nm-shadow-sm',
	'nm-transition-all',
	'range-track:nm-appearance-none',
	'range-track:nm-border-none',
	'range-track:nm-bg-transparent',
	'range-track:nm-shadow-none',
	'range-thumb:nm-h-3',
	'range-thumb:nm-w-3',
	'range-thumb:nm-appearance-none',
	'range-thumb:nm-rounded-full',
	'range-thumb:nm-bg-white',
	'range-thumb:nm-shadow-sm',
	'range-thumb:nm-border-none',
];

export const playerMessageStyles = [
	'player-message',
	'nm-hidden',
	'nm-absolute',
	'nm-rounded-md',
	'nm-bg-neutral-900/95',
	'nm-left-1/2',
	'nm-px-4',
	'nm-py-2',
	'nm-pointer-events-none',
	'nm-text-center',
	'nm-top-12',
	'nm--translate-x-1/2',
	'nm-z-50',
];

export const playlistMenuButtonStyles = [
	'playlist-menu-button',
	'nm-relative',
	'nm-flex',
	'nm-w-available',
	'nm-p-2',
	'nm-gap-2',
	'nm-rounded-lg',
	'nm-snap-center',
	'nm-outline-transparent',
	'nm-outline',
	'nm-outline-1',
	'nm-outline-solid',
	'nm-text-white',
	'focus-visible:nm-outline-2',
	'focus-visible:nm-outline-white',
	'nm-transition-all',
	'nm-duration-300',
	'hover:nm-bg-neutral-600/20',
];

export const episodeMenuButtonLeftStyles = [
	'playlist-card-left',
	'nm-relative',
	'nm-rounded-md',
	'nm-w-[30%]',
	'nm-overflow-clip',
	'nm-self-center',
	'nm-pointer-events-none',
];

export const episodeMenuButtonShadowStyles = [
	'episode-card-shadow',
	'nm-bg-[linear-gradient(0deg,rgba(0,0,0,0.87)_0%,rgba(0,0,0,0.7)_25%,rgba(0,0,0,0)_50%,rgba(0,0,0,0)_100%)]',
	'nm-shadow-[inset_0px_1px_0px_rgba(255,255,255,0.24),inset_0px_-1px_0px_rgba(0,0,0,0.24),inset_0px_-2px_0px_rgba(0,0,0,0.24)]',
	'nm-bottom-0',
	'nm-left-0',
	'nm-absolute',
	'!nm-h-available',
	'nm-w-available',
];

export const episodeMenuButtonImageStyles = [
	'playlist-card-image',
	'nm-w-available',
	'nm-h-auto',
	'nm-aspect-video',
	'nm-object-cover',
	'',
];

export const episodeMenuProgressContainerStyles = [
	'progress-container',
	'nm-absolute',
	'nm-bottom-0',
	'nm-w-available',
	'nm-flex',
	'nm-flex-col',
	'nm-px-3',
];

export const episodeMenuProgressBoxStyles = [
	'progress-box',
	'nm-flex',
	'nm-justify-between',
	'nm-h-available',
	'nm-sm:mx-2',
	'nm-mb-1',
	'nm-px-1',
];

export const progressContainerItemTextStyles = [
	'progress-item',
	'nm-text-[0.7rem]',
	'',
];

export const progressContainerDurationTextStyles = [
	'progress-duration',
	'nm-text-[0.7rem]',
];

export const sliderContainerStyles = [
	'slider-container',
	'nm-hidden',
	'nm-rounded-md',
	'nm-overflow-clip',
	'nm-bg-gray-500/80',
	'nm-h-1',
	'nm-mb-2',
	'nm-mx-1',
	'nm-sm:mx-2',
];

export const progressBarStyles = [
	'progress-bar',
	'nm-bg-white',
];

export const episodeMenuButtonRightSideStyles = [
	'playlist-card-right',
	'nm-w-3/4',
	'nm-flex',
	'nm-flex-col',
	'nm-text-left',
	'nm-gap-1',
	'nm-pointer-events-none',
];

export const episodeMenuButtonTitleStyles = [
	'playlist-menu-button-title',
	'nm-font-bold',
	'nm-line-clamp-1',
	'nm-text-white',
	'',
];

export const episodeMenuButtonOverviewStyles = [
	'playlist-menu-button-overview',
	'nm-text-[0.7rem]',
	'nm-leading-[1rem]',
	'nm-line-clamp-4',
	'nm-overflow-hidden',
	'nm-text-white',
	'',
];

export const tooltipStyles = [
	'tooltip',
	'nm-hidden',
	'nm-absolute',
	'nm-left-0',
	'nm-bottom-0',
	'nm-z-50',
	'nm-px-3',
	'nm-py-2',
	'nm-text-xs',
	'nm-text-white',
	'nm-rounded-lg',
	'nm-font-medium',
	'nm-bg-neutral-900/95',
	'nm-pointer-events-none',
];

export const pauseScreenStyles = [
	'pause-screen',
	'nm-absolute',
	'nm-bg-black/80',
	'nm-inset-0',
	'nm-flex',
	'nm-p-6',
	'nm-text-white',
	'nm-w-available',
	'nm-h-available',
	'nm-z-0',
	'nm-hidden',
];

export const episodeScreenStyles = [
	'episode-screen',
	'nm-absolute',
	'nm-bg-black/80',
	'nm-inset-0',
	'nm-flex',
	'nm-gap-4',
	'nm-p-6',
	'nm-text-white',
	'nm-w-available',
	'nm-h-available',
	'nm-z-0',
	'nm-hidden',
];

export const languageScreenStyles = [
	'language-screen',
	'nm-absolute',
	'nm-bg-black/80',
	'nm-inset-0',
	'nm-flex',
	'nm-p-6',
	'nm-text-white',
	'nm-w-available',
	'nm-h-available',
	'nm-z-0',
	'nm-hidden',
];

export const languageButtonStyles = [
	'language-button',
	'nm-w-available',
	'nm-mr-auto',
	'nm-h-8',
	'nm-px-1',
	'nm-py-2',
	'nm-flex',
	'nm-items-center',
	'nm-rounded',
	'nm-snap-center',
	'nm-outline-transparent',
	'nm-outline',
	'nm-whitespace-nowrap',
	'hover:nm-bg-neutral-600/50',
	'nm-transition-all',
	'nm-duration-200',
	'nm-outline-1',
	'nm-outline-solid',
	'focus-visible:nm-outline-2',
	'focus-visible:nm-outline-white',
	'active:nm-outline-white',
];

export const tvButtonStyles = [
	'nm-w-7/12',
	'nm-mr-auto',
	'nm-h-8',
	'nm-px-1',
	'nm-py-2',
	'nm-flex',
	'nm-items-center',
	'nm-rounded',
	'nm-snap-center',
	'nm-outline-transparent',
	'nm-outline',
	'nm-outline-1',
	'nm-outline-solid',
	'focus-visible:nm-outline-2',
	'focus-visible:nm-outline-white',
	'active:nm-outline-white',
];

export const tvButtonTextStyles = [
	'nm-text-white',
	'nm-text-sm',
	'nm-font-bold',
	'nm-mx-2',
	'nm-flex',
	'nm-justify-between',
];

export const tvSeasonButtonStyles = [
	'nm-w-available',
	'nm-mr-auto',
	'nm-h-8',
	'nm-px-1',
	'nm-py-2',
	'nm-flex',
	'nm-flex-nowrap',
	'nm-items-center',
	'nm-snap-center',
	'nm-rounded',
	'nm-outline-transparent',
	'nm-outline',
	'nm-outline-1',
	'nm-outline-solid',
	'focus-visible:nm-outline-2',
	'focus-visible:nm-outline-white',
	'active:nm-outline-white',
];

export const tvSeasonButtonTextStyles = [
	'nm-w-available',
	'nm-text-white',
	'nm-text-sm',
	'nm-font-bold',
	'nm-mx-2',
	'nm-flex',
	'nm-justify-between',
	'nm-flex-nowrap',
];


export const tvEpisodeMenuButtonLeftStyles = [
	'playlist-card-left',
	'nm-relative',
	'nm-rounded-md',
	'nm-w-[50%]',
	'nm-overflow-clip',
	'nm-self-center',
];

export const tvEpisodeMenuButtonRightSideStyles = [
	'playlist-card-right',
	'nm-w-3/4',
	'nm-flex',
	'nm-flex-col',
	'nm-text-left',
	'nm-gap-1',
	'nm-px-1',
	'nm-outline-transparent',
	'nm-outline',
	'nm-outline-1',
	'nm-outline-solid',
	'focus-visible:nm-outline-2',
	'focus-visible:nm-outline-white',
	'active:nm-outline-white',
];

export const tvEpisodeMenuButtonTitleStyles = [
	'playlist-menu-button-title',
	'nm-font-bold',
	'nm-text-lg',
	'nm-line-clamp-1',
	'nm-text-white',
	'',
];

export const tvEpisodeMenuButtonOverviewStyles = [
	'playlist-menu-button-overview',
	'nm-font-bold',
	'nm-text-[0.7rem]',
	'nm-leading-4',
	'nm-line-clamp-4',
	'nm-overflow-hidden',
	'nm-text-white',
];

export const leftSideStyles = [
	'nm-flex',
	'nm-flex-col',
	'nm-justify-between',
	'nm-items-center',
	'nm-w-2/3',
	'nm-h-available',
];

export const leftSideTopStyles = [
	'nm-flex',
	'nm-flex-col',
	'nm-justify-center',
	'nm-items-center',
	'nm-w-available',
	'nm-gap-2',
	'nm-h-auto',
];

export const logoContainerStyles = [
	'nm-flex',
	'nm-flex-col',
	'nm-justify-center',
	'nm-items-center',
	'nm-w-available',
	'nm-h-[85px]',
	'nm-min-h-[85px]',
];

export const logoStyles = [
	'nm-w-auto',
	'nm-px-2',
	'nm-py-2',
	'nm-mr-auto',
	'nm-object-fit',
	'nm-h-auto',
	'nm-max-w-[23rem]',
	'nm-max-h-available',
	'',
];

export const fallbackTextStyles = [
	'nm-w-auto',
	'nm-h-available',
	'nm-items-center',
	'nm-py-0',
	'nm-max-w-[38vw]',
	'nm-mr-auto',
	'nm-leading-[1.2]',
	'nm-font-bold',
	'nm-object-fit',
];

export const logoFooterStyles = [
	'nm-flex',
	'nm-flex-col',
	'nm-w-available',
	'nm-h-[40px]',
];

export const yearStyles = [
	'nm-flex',
	'nm-text-white',
	'nm-text-sm',
	'nm-font-bold',
	'nm-mx-2',
];

export const ratingContainerStyles = [
	'nm-flex',
	'nm-gap-2',
	'nm-items-center',
	'nm-w-available',
	'nm-text-white',
];

export const ratingImageStyles = [
	'nm-w-8',
	'nm-h-available',
	'nm-object-fit',
	'nm-invert',
];

export const episodesCountStyles = [
	'nm-flex',
	'nm-text-white',
	'nm-text-sm',
	'nm-font-bold',
	'nm-mx-2',
];

export const overviewContainerStyles = [
	'nm-flex',
	'nm-flex-col',
	'nm-w-available',
	'nm-h-available',
];

export const titleStyles = [
	'nm-flex',
	'nm-text-white',
	'nm-text-lg',
	'nm-font-bold',
	'nm-mx-2',
];

export const descriptionStyles = [
	'nm-text-white',
	'nm-text-sm',
	'nm-line-clamp-4',
	'nm-font-bold',
	'nm-leading-5',
	'nm-overflow-hidden',
	'nm-mx-2',
];

export const buttonContainerStyles = [
	'nm-flex',
	'nm-flex-col',
	'nm-gap-3',
	'nm-w-available',
	'nm-h-1/2',
	'nm-mt-7',
	'nm-mb-3',
	'nm-overflow-auto',
	'nm-px-2',
	'nm-py-0.5',
	'[*::-webkit-scrollbar]:nm-hidden',
];

export const subtitleButtonContainerStyles = [
	'nm-flex',
	'nm-flex-col',
	'nm-gap-3',
	'nm-w-available',
	'nm-h-available',
	'nm-mt-7',
	'nm-mb-3',
	'nm-overflow-auto',
	'nm-px-2',
	'nm-py-0.5',
	'[*::-webkit-scrollbar]:nm-hidden',
];

export const rightSideStyles = [
	'nm-flex',
	'nm-flex-col',
	'nm-justify-center',
	'nm-w-1/3',
	'nm-h-available',
];

export const languageRightSideStyles = [
	'nm-flex',
	'nm-flex-col',
	'nm-justify-start',
	'nm-mt-28',
	'nm-w-1/3',
	'nm-h-available',
];

export const episodeLeftSideStyles = [
	'nm-flex',
	'nm-flex-col',
	'nm-justify-between',
	'nm-items-center',
	'nm-w-2/5',
	'nm-h-available',
];

export const episodeRightSideStyles = [
	'nm-flex',
	'nm-flex-col',
	'nm-justify-center',
	'nm-w-3/5',
	'nm-h-available',
];

export const episodeScrollContainerStyles = [
	'nm-flex',
	'nm-flex-col',
	'nm-overflow-auto',
	'nm-h-available',
	'nm-pt-6',
	'nm-gap-2',
	'nm-p-1',
	'nm-min-h-[50%]',
];

export const spinnerContainerStyles = [
	'nm-absolute',
	'nm-inset-0',
	'nm-w-available',
	'nm-h-available',
	'nm-z-50',
	'nm-grid',
	'nm-pointer-events-none',
	'nm-place-content-center',
];

export const roleStyles = [
	'nm-flex',
	'nm-flex-col',
	'nm-items-center',
	'nm-gap-4',
	'nm-mt-11',
];

export const spinnerStyles = [
	'nm-inline',
	'nm-w-12',
	'nm-h-12',
	'nm-mr-2',
	'nm-animate-spin',
	'nm-text-white/20',
	'nm-fill-white',
];

export const statusTextStyles = [
	'nm-text-white',
	'nm-text-lg',
	'nm-font-bold',
];

export const nextTipStyles = [
	'nm-episode-tip',
	'nm-hidden',
	'nm-absolute',
	'nm-left-0',
	'-nm-bottom-10',
	'nm-z-50',
	'!nm-w-96',
	'nm-h-24',
	'nm-px-2',
	'nm-gap-2',
	'nm-py-2',
	'nm-text-xs',
	'nm-text-white',
	'nm-rounded-lg',
	'nm-font-medium',
	'nm-bg-neutral-900/95',
];

export const nextTipTextStyles = [
	'nm-playlist-card-left',
	'nm-relative',
	'nm-rounded-sm',
	'nm-w-[40%]',
	'nm-overflow-clip',
	'nm-self-center',
	'',
];

export const nextTipImageStyles = [
	'nm-playlist-card-image',
	'nm-w-available',
	'nm-h-auto',
	'nm-aspect-video',
	'nm-object-cover',
	'nm-rounded-md',
	'',
];

export const nextTipLeftSideStyles = [
	'nm-playlist-card-left',
	'nm-relative',
	'nm-rounded-sm',
	'nm-w-[40%]',
	'nm-overflow-clip',
	'nm-self-center',
	'',
];

export const nextTipRightSideStyles = [
	'nm-playlist-card-right',
	'nm-w-[60%]',
	'nm-flex',
	'nm-flex-col',
	'nm-text-left',
	'nm-gap-1',
];

export const nextTipHeaderStyles = [
	'nm-playlist-card-header',
	'nm-font-bold',
	'',
];

export const nextTipTitleStyles = [
	'nm-tooltip-title',
	'nm-font-bold',
	'nm-text-white',
];

export const nextUpStyles = [
	'nm-episode-tip',
	'nm-flex',
	'nm-gap-2',
	'nm-absolute',
	'nm-right-4',
	'nm-bottom-8',
	'!nm-w-80',
	'nm-h-24',
	'nm-px-2',
	'nm-py-2',
	'nm-z-50',
];

export const nextUpCreditsButtonStyles = [
	'nextup-button',
	'nm-bg-neutral-900/95',
	'nm-block',
	'!nm-text-[0.9rem]',
	'nm-font-bold',
	'!nm-text-neutral-100',
	'!nm-py-1.5',
	'nm-w-[45%]',
	'nm-outline',
	'nm-outline-transparent',
	'focus-visible:nm-outline-2',
	'focus-visible:nm-outline-white',
	'active:nm-outline-white',
	'',
];

export const nextUpNextButtonStyles = [
	'nextup-button',
	'animated',
	'nm-bg-neutral-100',
	'nm-w-[55%]',
	'nm-outline',
	'nm-outline-transparent',
	'focus-visible:nm-outline-2',
	'focus-visible:nm-outline-white',
	'active:nm-outline-white',
	'',
];

export const tvOverlayStyles = [
	'nm-absolute',
	'nm-flex',
	'nm-flex-col',
	'nm-justify-end',
	'nm-gap-4',
	'nm-w-available',
	'nm-h-available',
	'nm-z-0',
];

export const backgroundStyles = [
	'nm-absolute',
	'nm-inset-0',
	'nm-bg-black',
	'nm-pointer-events-none',
	'nm-bg-opacity-80',
	'nm-opacity-0',
	'nm-z-20',
	'nm-duration-300',
];

export const tvBottomRowStyles = [
	'nm-relative',
	'nm-flex',
	'nm-flex-row',
	'nm-items-center',
	'nm-gap-4',
	'nm-mt-auto',
	'nm-w-available',
	'nm-px-20',
	'nm-pb-10',
	'nm-z-0',
];

export const tvSeekBarStyles = [];

export const tvSeekBarInnerStyles = [];

export const tvSeekBarInnerProgressStyles = [];

export const tvSeekBarInnerBufferStyles = [];

export const tvCurrentItemContainerStyles = [
	'nm-flex',
	'nm-flex-col',
	'nm-justify-end',
	'nm-items-end',
	'nm-gap-2',
];

export const tvCurrentItemShowStyles = [
	'nm-text-white',
	'nm-text-sm',
	'nm-whitespace-pre',
	'nm-font-bold',
];

export const tvCurrentItemTitleContainerStyles = [
	'nm-flex',
	'nm-flex-row',
	'nm-gap-2',
];

export const tvCurrentItemEpisodeStyles = [];

export const tvCurrentItemTitleStyles = [];

export const seekContainerStyles = [
	'nm-relative',
	'nm-h-auto',
	'nm-mb-28',
	'nm-w-available',
	'nm-translate-y-[80vh]',
	'nm-z-40',
	'nm-w-available',
];

export const seekScrollContainerStyles = [
	'nm-relative',
	'nm-flex',
	'nm-h-available',
	'nm-w-available',
	'nm-overflow-auto',
	'nm-px-[calc(100%/2.14)]',
	'nm-gap-1.5',
	'scrollbar-none',
];

export const seekContainerChildStyles = [
	'nm-w-available',
	'nm-flex',
	'nm-gap-1.5',
	'nm-scroll-smooth',
	'nm-snap-x',
];

export const thumbnailStyles = [
	'nm-w-1/5',
	'nm-h-auto',
	'nm-object-cover',
	'nm-aspect-video',
	'nm-snap-center',
	'nm-duration-300',
	'',
	'',
];

export const seekScrollCloneStyles = [
	'[--gap:1.5rem]',
	'nm-absolute',
	'nm-flex',
	'nm-h-available',
	'nm-w-available',
	'nm-gap-[var(--gap)]',
	'z-10',
	'nm-pointer-events-none',
];

export const thumbnailCloneStyles = [
	'nm-w-[calc(26%+(var(--gap)/2))]',
	'nm-h-auto',
	'nm-object-cover',
	'nm-aspect-video',
	'nm-border-4',
	'nm-mx-auto',
	'',
];

// export const nextTipTextStyles = [];
// export const nextTipTextStyles = [];
// export const nextTipTextStyles = [];

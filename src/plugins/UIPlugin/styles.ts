
export const bottomBarStyles = [
	'bottom-bar',
	'z-10',
	'flex',
	'flex-col',
	'items-center',
	'w-full',
	'gap-2',
	'text-center',
	'px-6',
	'py-4',
	'mt-auto',
	'translate-y-full',
	'group-[&.nomercyplayer.active]:translate-y-0',
	'group-[&.nomercyplayer.paused]:translate-y-0',
	'group-[&.nomercyplayer:has(.open)]:translate-y-0',
	'transition-all',
	'duration-300',
];

export const bottomBarShadowStyles = [
	'absolute',
	'pointer-events-none',
	'bottom-0',
	'bg-gradient-to-t',
	'via-black/20',
	'from-black/90',
	'pt-[20%]',
	'w-available',
];

export const bottomRowStyles = [
	'bottom-row',
	'flex',
	'h-10',
	'mb-2',
	'p-1',
	'px-4',
	'items-center',
	'relative',
	'w-available',
];

export const buttonBaseStyles = [
	'button-base',
	'flex',
	'h-10',
	'items-center',
	'justify-center',
	'w-10',
];

export const buttonStyles = [
	'cursor-pointer',
	'fill-white',
	'tv:fill-white/30',
	'focus-visible:fill-white',
	'flex',
	'-outline-offset-2',
	'focus-visible:outline',
	'focus-visible:outline-2',
	'focus-visible:outline-white/20',
	'group/button',
	'h-10',
	'items-center',
	'justify-center',
	'p-2',
	'relative',
	'rounded-full',
	'w-10',
	'min-w-[40px]',
];

export const centerStyles = [
	'center',
	'absolute',
	'grid',
	'grid-cols-3',
	'grid-rows-6',
	'h-full',
	'w-full',
	'z-0',

	'transition-all',
	'duration-300',

	'bg-transparent',
	'group-[&.nomercyplayer.buffering]:bg-gradient-circle-c',
	'group-[&.nomercyplayer.error]:bg-gradient-circle-c',
	'group-[&.nomercyplayer.paused]:bg-gradient-circle-c',
	'from-black/50',
	'from-30%',
	'via-60%',
	'via-black/20',
	'to-80%',
	'via-black/20',
];

export const chapterBarStyles = [
	'chapter-bar',
	'bg-transparent',
	'flex',
	'h-2',
	'relative',
	'rounded-full',
	'overflow-clip',
	'w-available',
];

export const chapterMarkersStyles = [
	'chapter-marker',
	'min-w-[2px]',
	'absolute',
	'h-available',
	'last:translate-x-[1.5px]',
	'[&:last-child(2):.5px]',
	'rounded-sm',
	'overflow-hidden',
];

export const chapterMarkerBGStyles = [
	'chapter-marker-bg',
	'bg-white/20',
	'absolute',
	'h-available',
	'left-0',
	'w-available',
	'z-0',
	'rounded-sm',
];

export const chapterMarkerBufferStyles = [
	'chapter-marker-buffer',
	'absolute',
	'bg-gray-300/30',
	'h-available',
	'left-0',
	'origin-left',
	'scale-x-0',
	'w-available',
	'z-10',
	'rounded-sm',
];

export const chapterMarkerHoverStyles = [
	'chapter-marker-hover',
	'absolute',
	'bg-gray-200',
	'h-available',
	'left-0',
	'origin-left',
	'scale-x-0',
	'w-available',
	'z-10',
	'rounded-sm',
];

export const chapterMarkerProgressStyles = [
	'chapter-marker-progress',
	'absolute',
	'bg-white',
	'h-available',
	'left-0',
	'origin-left',
	'scale-x-0',
	'w-available',
	'z-20',
	'rounded-sm',
];

export const chapterTextStyles = ['chapter-text'];

export const dividerStyles = [
	'divider',
	'flex',
	'flex-1',
];

export const iconStyles = ['text-white'];

export const languageButtonSpanStyles = [
	'language-button-span',
	'MuiSvgIcon-root',
	'cursor-pointer',
	'h-6',
	'object-contain',
	'rounded-sm',
	'w-6',
];

export const mainMenuStyles = [
	'main-menu',
	'bg-neutral-900/95',
	'duration-300',
	'flex',
	'flex-col',
	'gap-1',
	'h-auto',
	'mt-auto',
	'overflow-clip',
	'p-2',
	'pt-0',
	'rounded-lg',
	'w-1/2',
	'max-h-full',
	'group-[&.nomercyplayer:has(.sub-menu-open)]:pointer-events-none',
];

export const menuButtonTextStyles = [
	'menu-button-text',
	'cursor-pointer',
	'font-semibold',
	'pl-2',
	'flex',
	'gap-2',
	'leading-[normal]',
];

export const menuContentStyles = [
	'menu-content',
	'duration-300',
	'flex',
	'flex-row',
	'overflow-clip',
	'w-[200%]',
	'h-available',
	'mt-auto',
];

export const menuFrameStyles = [
	'menu-frame',
	'fixed',
	'overflow-clip',
	'bottom-10',
	'duration-300',
	'flex',
	'flex-col',
	'hidden',
	'right-[2%]',
	'w-fit',
	'z-50',
];

export const menuHeaderButtonTextStyles = [
	'menu-header-button-text',
	'font-semibold',
	'leading-[normal]',
	'pl-2',
];

export const menuHeaderStyles = [
	'menu-header',
	'flex',
	'h-9',
	'items-center',
	'min-h-[2.5rem]',
	'py-2',
	'text-white',
	'w-available',
];

export const scrollContainerStyles = [
	'scroll-container',
	'flex',
	'flex-col',
	'gap-1',
	'language-scroll-container',
	'overflow-x-hidden',
	'overflow-y-auto',
	'p-2',
	'w-available',

	// 	scroll-padding-block: 1rem;
	// scroll-snap-align: center;
	// scroll-behavior: smooth;
	'scroll-p-4',
	'scroll-snap-align-center',
	'scroll-behavior-smooth',
];

export const sliderBarStyles = [
	'slider-bar',
	'group/slider',
	'flex',
	'rounded-full',
	'bg-white/20',
	'h-2',
	'mx-4',
	'relative',
	'w-available',
];

export const sliderBufferStyles = [
	'slider-buffer',
	'absolute',
	'flex',
	'h-full',
	'pointer-events-none',
	'rounded-full',
	'bg-white/20',
	'z-0',
	'overflow-hidden',
	'overflow-clip',
];

export const sliderHoverStyles = [
	'slider-hover',
	'absolute',
	'opacity-1',
	'flex',
	'h-full',
	'pointer-events-none',
	'rounded-full',
	'bg-white/30',
	'z-0',
	'overflow-hidden',
	'overflow-clip',
];

export const sliderProgressStyles = [
	'slider-progress',
	'absolute',
	'flex',
	'h-full',
	'pointer-events-none',
	'rounded-full',
	'bg-white',
	'z-10',
	'overflow-hidden',
	'overflow-clip',
];

export const sliderNippleStyles = [
	'slider-nipple',
	'-translate-x-1/2',
	'-translate-y-[25%]',
	'absolute',
	'hidden',
	'group-hover/slider:flex',
	'bg-white',
	'h-4',
	'left-0',
	'rounded-full',
	'top-0',
	'w-4',
	'z-20',
];

export const sliderPopImageStyles = ['slider-pop-image'];

export const sliderPopStyles = [
	'slider-pop',
	'-translate-x-1/2',
	'absolute',
	'bg-neutral-900/95',
	'bottom-4',
	'flex',
	'flex-col',
	'font-semibold',
	'gap-1',
	'hover:scale-110',
	'overflow-clip',
	'pb-1',
	'pointer-events-none',
	'rounded-md',
	'text-center',
	'z-20',
];

export const sliderTextStyles = [
	'slider-pop-text',
	'font-mono',
];

export const speedButtonTextStyles = [
	'speed-button-text',
	'cursor-pointer',
	'font-semibold',
	'pl-2',
	'leading-[normal]',
];

export const subMenuContentStyles = [
	'sub-menu-content',
	'flex',
	'flex-col',
	'gap-1',
	'hidden',
	'max-h-available',
	'w-available',
	'overflow-auto',
];

export const subMenuStyles = [
	'sub-menu',
	'bg-neutral-900/95',
	'duration-300',
	'flex',
	'flex-col',
	'gap-1',
	'h-auto',
	'mt-auto',
	'overflow-clip',
	'rounded-lg',
	'w-1/2',
	'max-h-full',
	'min-w-28',
];

export const svgSizeStyles = [
	'svg-size',
	'h-5',
	'w-5',
	'pointer-events-none',
	'group-hover/button:scale-110',
	'duration-700',
];

export const timeStyles = [
	'time',
	'flex',
	'font-mono',
	'items-center',
	'pointer-events-none',
	'select-none',
	'text-sm',
];

export const topBarStyles = [
	'top-bar',
	'z-10',
	'flex',
	'items-start',
	'justify-between',
	'w-full',
	'gap-2',
	'px-6',
	'py-4',
	'mb-auto',
	'-translate-y-full',
	'group-[&.nomercyplayer.active]:translate-y-0',
	'group-[&.nomercyplayer.paused]:translate-y-0',
	'group-[&.nomercyplayer:has(.open)]:translate-y-0',
	// 'group-[&.nomercyplayer:has(:focus)]:translate-y-0',
	'transition-all',
	'duration-300',
];

export const topRowStyles = [
	'top-row',
	'flex',
	'gap-1',
	'h-2',
	'items-center',
	'pl-2',
	'pr-2',
	'relative',
	'w-available',
];

export const touchPlaybackButtonStyles = [
	'touch-playback-button',
	'pointer-events-none',
	'fill-white',
];

export const touchPlaybackStyles = [
	'touch-playback',
	'flex',
	'-ml-2',
	'items-center',
	'justify-center',
];

export const volumeContainerStyles = [
	'volume-container',
	'group/volume',
	'flex',
	'overflow-clip',
];

export const volumeSliderStyles = [
	'volume-slider',
	'w-0',
	'rounded-full',
	'opacity-0',
	'duration-300',
	'group-hover/volume:w-20',
	'group-hover/volume:mx-2',
	'group-hover/volume:opacity-100',
	'group-focus-within/volume:w-20',
	'group-focus-within/volume:mx-2',
	'group-focus-within/volume:opacity-100',
	'appearance-none',
	'volume-slider',
	'bg-white/70',
	'bg-gradient-to-r',
	'from-white',
	'to-white',
	'self-center',
	'h-1',
	'bg-no-repeat',
	'rounded-full',
	'shadow-sm',
	'transition-all',
	'range-track:appearance-none',
	'range-track:border-none',
	'range-track:bg-transparent',
	'range-track:shadow-none',
	'range-track:transition-all',
	'range-track:duration-300',
	'range-thumb:h-3',
	'range-thumb:w-3',
	'range-thumb:transition-all',
	'range-thumb:duration-300',
	'range-thumb:appearance-none',
	'range-thumb:rounded-full',
	'range-thumb:bg-white',
	'range-thumb:shadow-sm',
	'range-thumb:border-none',
];

export const playerMessageStyles = [
	'player-message',
	'hidden',
	'absolute',
	'rounded-md',
	'bg-neutral-900/95',
	'left-1/2',
	'px-4',
	'py-2',
	'pointer-events-none',
	'text-center',
	'top-12',
	'-translate-x-1/2',
	'z-50',
];

export const playlistMenuButtonStyles = [
	'playlist-menu-button',
	'relative',
	'flex',
	'w-available',
	'p-2',
	'gap-2',
	'rounded-lg',
	'snap-center',
	'outline-transparent',
	'outline',
	'outline-1',
	'outline-solid',
	'text-white',
	'focus-visible:outline-2',
	'focus-visible:outline-white',
	'transition-all',
	'duration-300',
	'hover:bg-neutral-600/20',
];

export const episodeMenuButtonLeftStyles = [
	'playlist-card-left',
	'relative',
	'rounded-md',
	'w-[30%]',
	'overflow-clip',
	'self-center',
	'pointer-events-none',
];

export const episodeMenuButtonShadowStyles = [
	'episode-card-shadow',
	'bg-[linear-gradient(0deg,rgba(0,0,0,0.87)_0%,rgba(0,0,0,0.7)_25%,rgba(0,0,0,0)_50%,rgba(0,0,0,0)_100%)]',
	'shadow-[inset_0px_1px_0px_rgba(255,255,255,0.24),inset_0px_-1px_0px_rgba(0,0,0,0.24),inset_0px_-2px_0px_rgba(0,0,0,0.24)]',
	'bottom-0',
	'left-0',
	'absolute',
	'!h-available',
	'w-available',
];

export const episodeMenuButtonImageStyles = [
	'playlist-card-image',
	'w-available',
	'h-auto',
	'aspect-video',
	'object-cover',
	'',
];

export const episodeMenuProgressContainerStyles = [
	'progress-container',
	'absolute',
	'bottom-0',
	'w-available',
	'flex',
	'flex-col',
	'px-3',
];

export const episodeMenuProgressBoxStyles = [
	'progress-box',
	'flex',
	'justify-between',
	'h-available',
	'sm:mx-2',
	'mb-1',
	'px-1',
];

export const progressContainerItemTextStyles = [
	'progress-item',
	'text-[0.7rem]',
	'',
];

export const progressContainerDurationTextStyles = [
	'progress-duration',
	'text-[0.7rem]',
];

export const sliderContainerStyles = [
	'slider-container',
	'hidden',
	'rounded-md',
	'overflow-clip',
	'bg-gray-500/80',
	'h-1',
	'mb-2',
	'mx-1',
	'sm:mx-2',
];

export const progressBarStyles = [
	'progress-bar',
	'bg-white',
];

export const episodeMenuButtonRightSideStyles = [
	'playlist-card-right',
	'w-3/4',
	'flex',
	'flex-col',
	'text-left',
	'gap-1',
	'pointer-events-none',
];

export const episodeMenuButtonTitleStyles = [
	'playlist-menu-button-title',
	'font-bold',
	'line-clamp-1',
	'text-white',
	'',
];

export const episodeMenuButtonOverviewStyles = [
	'playlist-menu-button-overview',
	'text-[0.7rem]',
	'leading-[1rem]',
	'line-clamp-4',
	'overflow-hidden',
	'text-white',
	'',
];

export const tooltipStyles = [
	'tooltip',
	'hidden',
	'absolute',
	'left-0',
	'bottom-0',
	'z-50',
	'px-3',
	'py-2',
	'text-xs',
	'text-white',
	'rounded-lg',
	'font-medium',
	'bg-neutral-900/95',
	'pointer-events-none',
];

export const pauseScreenStyles = [
	'pause-screen',
	'absolute',
	'bg-black/80',
	'inset-0',
	'flex',
	'p-6',
	'text-white',
	'w-available',
	'h-available',
	'z-0',
	'hidden',
];

export const episodeScreenStyles = [
	'episode-screen',
	'absolute',
	'bg-black/80',
	'inset-0',
	'flex',
	'gap-4',
	'p-6',
	'text-white',
	'w-available',
	'h-available',
	'z-0',
	'hidden',
];

export const languageScreenStyles = [
	'language-screen',
	'absolute',
	'bg-black/80',
	'inset-0',
	'flex',
	'p-6',
	'text-white',
	'w-available',
	'h-available',
	'z-0',
	'hidden',
];

export const languageButtonStyles = [
	'language-button',
	'w-available',
	'mr-auto',
	'h-8',
	'px-1',
	'py-2',
	'flex',
	'items-center',
	'rounded',
	'snap-center',
	'outline-transparent',
	'outline',
	'whitespace-nowrap',
	'hover:bg-neutral-600/50',
	'transition-all',
	'duration-200',
	'outline-1',
	'outline-solid',
	'focus-visible:outline-2',
	'focus-visible:outline-white',
	'active:outline-white',
];

export const tvButtonStyles = [
	'w-7/12',
	'mr-auto',
	'h-8',
	'px-1',
	'py-2',
	'flex',
	'items-center',
	'rounded',
	'snap-center',
	'outline-transparent',
	'outline',
	'outline-1',
	'outline-solid',
	'focus-visible:outline-2',
	'focus-visible:outline-white',
	'active:outline-white',
];

export const tvButtonTextStyles = [
	'text-white',
	'text-sm',
	'font-bold',
	'mx-2',
	'flex',
	'justify-between',
];

export const tvSeasonButtonStyles = [
	'w-available',
	'mr-auto',
	'h-8',
	'px-1',
	'py-2',
	'flex',
	'flex-nowrap',
	'items-center',
	'snap-center',
	'rounded',
	'outline-transparent',
	'outline',
	'outline-1',
	'outline-solid',
	'focus-visible:outline-2',
	'focus-visible:outline-white',
	'active:outline-white',
];

export const tvSeasonButtonTextStyles = [
	'w-available',
	'text-white',
	'text-sm',
	'font-bold',
	'mx-2',
	'flex',
	'justify-between',
	'flex-nowrap',
];


export const tvEpisodeMenuButtonLeftStyles = [
	'playlist-card-left',
	'relative',
	'rounded-md',
	'w-[50%]',
	'overflow-clip',
	'self-center',
];

export const tvEpisodeMenuButtonRightSideStyles = [
	'playlist-card-right',
	'w-3/4',
	'flex',
	'flex-col',
	'text-left',
	'gap-1',
	'px-1',
	'outline-transparent',
	'outline',
	'outline-1',
	'outline-solid',
	'focus-visible:outline-2',
	'focus-visible:outline-white',
	'active:outline-white',
];

export const tvEpisodeMenuButtonTitleStyles = [
	'playlist-menu-button-title',
	'font-bold',
	'text-lg',
	'line-clamp-1',
	'text-white',
	'',
];

export const tvEpisodeMenuButtonOverviewStyles = [
	'playlist-menu-button-overview',
	'font-bold',
	'text-[0.7rem]',
	'leading-4',
	'line-clamp-4',
	'overflow-hidden',
	'text-white',
];

export const leftSideStyles = [
	'flex',
	'flex-col',
	'justify-between',
	'items-center',
	'w-2/3',
	'h-available',
];

export const leftSideTopStyles = [
	'flex',
	'flex-col',
	'justify-center',
	'items-center',
	'w-available',
	'gap-2',
	'h-auto',
];

export const logoContainerStyles = [
	'flex',
	'flex-col',
	'justify-center',
	'items-center',
	'w-available',
	'h-[85px]',
	'min-h-[85px]',
];

export const logoStyles = [
	'w-auto',
	'px-2',
	'py-2',
	'mr-auto',
	'object-fit',
	'h-auto',
	'max-w-[23rem]',
	'max-h-available',
	'',
];

export const fallbackTextStyles = [
	'w-auto',
	'h-available',
	'items-center',
	'py-0',
	'max-w-[38vw]',
	'mr-auto',
	'leading-[1.2]',
	'font-bold',
	'object-fit',
];

export const logoFooterStyles = [
	'flex',
	'flex-col',
	'w-available',
	'h-[40px]',
];

export const yearStyles = [
	'flex',
	'text-white',
	'text-sm',
	'font-bold',
	'mx-2',
];

export const ratingContainerStyles = [
	'flex',
	'gap-2',
	'items-center',
	'w-available',
	'text-white',
];

export const ratingImageStyles = [
	'w-8',
	'h-available',
	'object-fit',
	'invert',
];

export const episodesCountStyles = [
	'flex',
	'text-white',
	'text-sm',
	'font-bold',
	'mx-2',
];

export const overviewContainerStyles = [
	'flex',
	'flex-col',
	'w-available',
	'h-available',
];

export const titleStyles = [
	'flex',
	'text-white',
	'text-lg',
	'font-bold',
	'mx-2',
];

export const descriptionStyles = [
	'text-white',
	'text-sm',
	'line-clamp-4',
	'font-bold',
	'leading-5',
	'overflow-hidden',
	'mx-2',
];

export const buttonContainerStyles = [
	'flex',
	'flex-col',
	'gap-3',
	'w-available',
	'h-1/2',
	'mt-7',
	'mb-3',
	'overflow-auto',
	'px-2',
	'py-0.5',
	'[*::-webkit-scrollbar]:hidden',
];

export const subtitleButtonContainerStyles = [
	'flex',
	'flex-col',
	'gap-3',
	'w-available',
	'h-available',
	'mt-7',
	'mb-3',
	'overflow-auto',
	'px-2',
	'py-0.5',
	'[*::-webkit-scrollbar]:hidden',
];

export const rightSideStyles = [
	'flex',
	'flex-col',
	'justify-center',
	'w-1/3',
	'h-available',
];

export const languageRightSideStyles = [
	'flex',
	'flex-col',
	'justify-start',
	'mt-28',
	'w-1/3',
	'h-available',
];

export const episodeLeftSideStyles = [
	'flex',
	'flex-col',
	'justify-between',
	'items-center',
	'w-2/5',
	'h-available',
];

export const episodeRightSideStyles = [
	'flex',
	'flex-col',
	'justify-center',
	'w-3/5',
	'h-available',
];

export const episodeScrollContainerStyles = [
	'flex',
	'flex-col',
	'overflow-auto',
	'h-available',
	'pt-6',
	'gap-2',
	'p-1',
	'min-h-[50%]',
];

export const spinnerContainerStyles = [
	'absolute',
	'inset-0',
	'w-available',
	'h-available',
	'z-50',
	'grid',
	'pointer-events-none',
	'place-content-center',
];

export const roleStyles = [
	'flex',
	'flex-col',
	'items-center',
	'gap-4',
	'mt-11',
];

export const spinnerStyles = [
	'inline',
	'w-12',
	'h-12',
	'mr-2',
	'animate-spin',
	'text-white/20',
	'fill-white',
];

export const statusTextStyles = [
	'text-white',
	'text-lg',
	'font-bold',
];

export const nextTipStyles = [
	'episode-tip',
	'hidden',
	'absolute',
	'left-0',
	'-bottom-10',
	'z-50',
	'!w-96',
	'h-24',
	'px-2',
	'gap-2',
	'py-2',
	'text-xs',
	'text-white',
	'rounded-lg',
	'font-medium',
	'bg-neutral-900/95',
];

export const nextTipTextStyles = [
	'playlist-card-left',
	'relative',
	'rounded-sm',
	'w-[40%]',
	'overflow-clip',
	'self-center',
	'',
];

export const nextTipImageStyles = [
	'playlist-card-image',
	'w-available',
	'h-auto',
	'aspect-video',
	'object-cover',
	'rounded-md',
	'',
];

export const nextTipLeftSideStyles = [
	'playlist-card-left',
	'relative',
	'rounded-sm',
	'w-[40%]',
	'overflow-clip',
	'self-center',
	'',
];

export const nextTipRightSideStyles = [
	'playlist-card-right',
	'w-[60%]',
	'flex',
	'flex-col',
	'text-left',
	'gap-1',
];

export const nextTipHeaderStyles = [
	'playlist-card-header',
	'font-bold',
	'',
];

export const nextTipTitleStyles = [
	'tooltip-title',
	'font-bold',
	'text-white',
];

export const nextUpStyles = [
	'episode-tip',
	'flex',
	'gap-2',
	'absolute',
	'right-4',
	'bottom-8',
	'!w-80',
	'h-24',
	'px-2',
	'py-2',
	'z-50',
];

export const nextUpCreditsButtonStyles = [
	'nextup-button',
	'bg-neutral-900/95',
	'block',
	'!text-[0.9rem]',
	'font-bold',
	'!text-neutral-100',
	'!py-1.5',
	'w-[45%]',
	'outline',
	'outline-transparent',
	'focus-visible:outline-2',
	'focus-visible:outline-white',
	'active:outline-white',
	'',
];

export const nextUpNextButtonStyles = [
	'nextup-button',
	'animated',
	'bg-neutral-100',
	'w-[55%]',
	'outline',
	'outline-transparent',
	'focus-visible:outline-2',
	'focus-visible:outline-white',
	'active:outline-white',
	'',
];

export const tvOverlayStyles = [
	'absolute',
	'flex',
	'flex-col',
	'justify-end',
	'gap-4',
	'w-available',
	'h-available',
	'z-0',
];

export const backgroundStyles = [
	'absolute',
	'inset-0',
	'bg-black',
	'pointer-events-none',
	'bg-opacity-80',
	'opacity-0',
	'z-20',
	'duration-300',
];

export const tvBottomRowStyles = [
	'relative',
	'flex',
	'flex-row',
	'items-center',
	'gap-4',
	'mt-auto',
	'w-available',
	'px-20',
	'pb-10',
	'z-0',
];

export const tvSeekBarStyles = [];

export const tvSeekBarInnerStyles = [];

export const tvSeekBarInnerProgressStyles = [];

export const tvSeekBarInnerBufferStyles = [];

export const tvCurrentItemContainerStyles = [
	'flex',
	'flex-col',
	'justify-end',
	'items-end',
	'gap-2',
];

export const tvCurrentItemShowStyles = [
	'text-white',
	'text-sm',
	'whitespace-pre',
	'font-bold',
];

export const tvCurrentItemTitleContainerStyles = [
	'flex',
	'flex-row',
	'gap-2',
];

export const tvCurrentItemEpisodeStyles = [];

export const tvCurrentItemTitleStyles = [];

export const seekContainerStyles = [
	'relative',
	'h-auto',
	'mb-28',
	'w-available',
	'translate-y-[80vh]',
	'z-40',
	'w-available',
];

export const seekScrollContainerStyles = [
	'relative',
	'flex',
	'h-available',
	'w-available',
	'overflow-auto',
	'px-[calc(100%/2.14)]',
	'gap-1.5',
	'scrollbar-none',
];

export const seekContainerChildStyles = [
	'w-available',
	'flex',
	'gap-1.5',
	'scroll-smooth',
	'snap-x',
];

export const thumbnailStyles = [
	'w-1/5',
	'h-auto',
	'object-cover',
	'aspect-video',
	'snap-center',
	'duration-300',
	'',
	'',
];

export const seekScrollCloneStyles = [
	'[--gap:1.5rem]',
	'absolute',
	'flex',
	'h-available',
	'w-available',
	'gap-[var(--gap)]',
	'z-10',
	'pointer-events-none',
];

export const thumbnailCloneStyles = [
	'w-[calc(26%+(var(--gap)/2))]',
	'h-auto',
	'object-cover',
	'aspect-video',
	'border-4',
	'mx-auto',
	'',
];

// export const nextTipTextStyles = [];
// export const nextTipTextStyles = [];
// export const nextTipTextStyles = [];

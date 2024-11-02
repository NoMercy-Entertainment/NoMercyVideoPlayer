
export const bottomBarStyles = [
	'bottom-bar',
	'absolute',
	'bottom-0',
	'flex',
	'flex-col',
	'gap-2',
	'items-center',
	'mt-auto',
	'px-6',
	'py-4',
	'text-center',
	'translate-y-full',
	'w-available',
	'z-10',
	'group-[&.nomercyplayer.active]:translate-y-0',
	'group-[&.nomercyplayer.paused]:translate-y-0',
	'group-[&.nomercyplayer:has(.open)]:translate-y-0',
	// 'group-[&.nomercyplayer:has(:focus)]:translate-y-0',
	'group-[&.nomercyplayer:has(:focus)]:duration-0',
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
	'pt-[10%]',
	'w-available',
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

export const scrollContainerStyles = [
	'scroll-container',
	'flex',
	'flex-col',
	'gap-1',
	'language-scroll-container',
	'overflow-x-hidden',
	'overflow-y-auto',
	'p-2',
	'transition-all',
	'duration-300',
	'w-available',
	'scroll-p-4',
	'scroll-snap-align-center',
	'scroll-smooth',
	'scroll-p-4',
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
	'line-clamp-1',
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
	'min-w-52',
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
	'justify-center',
];

export const topBarStyles = [
	'top-bar',
	'-translate-y-full',
	'absolute',
	'flex',
	'gap-2',
	'items-start',
	'justify-between',
	'mb-auto',
	'pb-[10%]',
	'px-6',
	'py-4',
	'top-0',
	'w-available',
	'z-10',
	'group-[&.nomercyplayer.active]:translate-y-0',
	'group-[&.nomercyplayer.paused]:translate-y-0',
	'group-[&.nomercyplayer:has(.open)]:translate-y-0',
	// 'group-[&.nomercyplayer:has(:focus)]:translate-y-0',
	'group-[&.nomercyplayer:has(:focus)]:duration-0',
	'transition-all',
	'duration-300',

	'bg-gradient-to-b',
	'from-black/90',
	'via-black/50',
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
	'range-thumb:h-3',
	'range-thumb:w-3',
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
	'episode-menu-button-left',
	'relative',
	'rounded-md',
	'w-[30%]',
	'h-available',
	'overflow-clip',
	'self-center',
	'pointer-events-none',
];

export const episodeMenuButtonShadowStyles = [
	'episode-menu-button-shadow',
	'bg-[linear-gradient(0deg,rgba(0,0,0,0.87)_0%,rgba(0,0,0,0.7)_25%,rgba(0,0,0,0)_50%,rgba(0,0,0,0)_100%)]',
	'shadow-[inset_0px_1px_0px_rgba(255,255,255,0.24),inset_0px_-1px_0px_rgba(0,0,0,0.24),inset_0px_-2px_0px_rgba(0,0,0,0.24)]',
	'bottom-0',
	'left-0',
	'absolute',
	'!h-available',
	'w-available',
];

export const episodeMenuButtonImageStyles = [
	'episode-menu-button-image',
	'w-available',
	'h-auto',
	'aspect-video',
	'object-cover',
	'',
];

export const episodeMenuProgressContainerStyles = [
	'episode-menu-progress-container',
	'absolute',
	'bottom-0',
	'w-available',
	'flex',
	'flex-col',
	'px-3',
];

export const episodeMenuProgressBoxStyles = [
	'episode-menu-progress-box',
	'flex',
	'justify-between',
	'h-available',
	'sm:mx-2',
	'mb-1',
	'px-1',
];

export const progressContainerItemTextStyles = [
	'progress-item-text',
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
	'line-clamp-2',
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

export const spinnerContainerStyles = [
	'absolute',
	'inset-0',
	'hidden',
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
	'next-tip-text',
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
	'next-tip-left',
	'relative',
	'rounded-sm',
	'w-[40%]',
	'overflow-clip',
	'self-center',
	'',
];

export const nextTipRightSideStyles = [
	'next-tip-right',
	'w-[60%]',
	'flex',
	'flex-col',
	'text-left',
	'gap-1',
];

export const nextTipHeaderStyles = [
	'next-tip-header',
	'font-bold',
	'',
];

export const nextTipTitleStyles = [
	'next-tip-title',
	'font-bold',
	'text-white',
];

export const nextUpStyles = [
	'next-up',
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
	'next-up-credits-button',
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
	'next-up-next-button',
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

export const seekContainerStyles = [
	'relative',
	'h-auto',
	'-mb-28',
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
	'w-[calc(23%+(var(--gap)/2))]',
	'h-auto',
	'object-cover',
	'aspect-video',
	'border-4',
	'mx-auto',
	'',
];

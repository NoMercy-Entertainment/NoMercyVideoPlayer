export interface Icon {
    [key: string]: {
        classes: string[];
        hover: string;
        normal: string;
        title: string;
    };
}
/**
 * An object containing Fluent UI icon definitions.
 */
export declare const fluentIcons: Icon;
/**
 * Returns an object containing button icons for the video player.
 * @param options - The options for the video player.
 * @returns An object containing button icons.
 */
export declare const buttons: () => Icon;

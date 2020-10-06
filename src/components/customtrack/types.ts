export type AddTrackProps = {
    domain: Domain;
    onOpen: () => void;
    open: boolean;
    endpoint: string;
    onClose: () => void;
    onAccept: (
        modalState: {
            title: string;
            url: string;
            baiUrl?: string;
            displayMode?: string;
            color: string;
            domain: Domain;
        }[]
    ) => void;
};

export interface Domain {
    chromosome?: string;
    start: number;
    end: number;
}

export type ColorPickerProps = {
    color: string;
    onChangeComplete: (color: string) => void;
};

export type CustomTrackProps = {
    data?: any;
    loading?: boolean;
    id: string;
    height: number;
    displayMode?: string;
    svgRef?: React.RefObject<SVGSVGElement>;
    width: number;
    title: string;
    color?: string;
    domain: Domain;
    onHeightChanged?: (value: number) => void;
    transform: string;
};

export const DEFAULT_BIGBED_DISPLAYMODE = 'dense';
export const DEFAULT_BIGWIG_DISPLAYMODE = 'full';
export const DEFAULT_BAM_DISPLAYMODE = 'squish';

export const TrackType = {
    INVALID: 'INVALID',
    BIGWIG: 'BIGWIG',
    BIGBED: 'BIGBED',
    BAM: 'BAM',
};

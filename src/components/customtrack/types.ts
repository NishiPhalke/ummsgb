export type AddTrackProps = {
    domain: Domain;
    onOpen: () => void;
    open: boolean;
    endpoint: string;
    onClose: () => void;
    onAccept: (modalState: { title: string; url: string; color: string; domain: Domain }[]) => void;
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
    id: string;
    // i: number;
    height: number;
    width: number;
    title: string;
    color: string;
    domain: Domain;
    onHeightChanged?: any;
    transform: string;
};

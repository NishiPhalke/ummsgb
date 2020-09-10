export type customTrack = {
    title: string;
    color: string;
    displayMode?: string;
    track: { start: number; end: number; chr1: string; url: string; baiUrl?: string; preRenderedWidth: number };
};

export interface Domain {
    chromosome?: string;
    start: number;
    end: number;
}

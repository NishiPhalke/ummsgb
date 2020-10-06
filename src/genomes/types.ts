export type customTrack = {
    title: string;
    color?: string;
    displayMode?: string;
    track: { start: number; end: number; chr1: string; url: string; baiUrl?: string; preRenderedWidth: number };
};

export interface Domain {
    chromosome?: string;
    start: number;
    end: number;
}

export const formatBEDRegion = (chromosome: string) => (region: { start: number; end: number }) => ({
    chr: chromosome,
    start: region.start,
    end: region.end,
});

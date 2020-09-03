export interface Domain {
    chromosome?: string;
    start: number;
    end: number;
}
export type GenomeBrowserPageProps = {
    assembly: string;
    session?: {
        customTracks: customTrack[] | undefined;
        domain: Domain;
    };
};

export type AssemblyInfo = { species: string; name: string; description: string };

export type SessionModalProps = { open: boolean; data: string; onClose: () => void; warn: number };

export type customTrack = {
    title: string;
    color: string;
    track: { start: number; end: number; chr1: string; url: string; preRenderedWidth: number };
};

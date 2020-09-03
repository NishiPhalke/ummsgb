export type GenomeBrowserPageProps = {
    assembly: string;
};

export type AssemblyInfo = { species: string; name: string; description: string };


export type customTrack = {
    title: string;
    color: string;
    track: { start: number; end: number; chr1: string; url: string; preRenderedWidth: number };
}
export type SearchBoxProps = {
    assembly: string;
    onSearchSubmit: (domain: string) => void;
};

export type RefSeqSearchBoxProps = {
    assembly: string;
    onSearchSubmit: (domain: string) => void;
};

export type Result = {
    title?: string;
    description: string;
}

export type RefSeqGenes = {id: string, transcripts: { coordinates: { chromosome: string, start: number, end: number }}[] }
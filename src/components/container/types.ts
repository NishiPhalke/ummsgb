export type GenomeBrowserContainerProps = {
    domain: Domain;
    chromSizes: Record<string, number>;
    onDomainChanged?: (domain: Domain) => void;
};

export interface Domain {
    chromosome?: string;
    start: number;
    end: number;
}

export type customTracks = { bigWigs: any[]; bigBeds: any[] };

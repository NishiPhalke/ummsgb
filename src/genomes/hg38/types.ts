export interface Domain {
    chromosome?: string;
    start: number;
    end: number;
}

export type Hg38BrowserProps = {
    domain: Domain;
    onDomainChanged: (domain: Domain) => void;
    customTracks?:
        | null
        | {
              title: string;
              color: string;
              track: { start: number; end: number; chr1: string; url: string; preRenderedWidth: number };
          }[];
};

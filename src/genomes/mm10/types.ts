export interface Domain {
    chromosome?: string;
    start: number;
    end: number;
}

export type Mm10BrowserProps = {
    domain: Domain;
    assembly: string;
    svgRef?: React.RefObject<SVGSVGElement>;
    onDomainChanged: (domain: Domain) => void;
    customTracks?:
        | null
        | {
              title: string;
              color: string;
              track: { start: number; end: number; chr1: string; url: string; preRenderedWidth: number };
          }[];
};

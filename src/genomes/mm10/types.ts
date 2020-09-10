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
    customTracks?: {
        title: string;
        color: string;
        track: { start: number; end: number; chr1: string; url: string; baiUrl?: string; preRenderedWidth: number };
    }[];
};

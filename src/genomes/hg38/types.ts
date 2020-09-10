export interface Domain {
    chromosome?: string;
    start: number;
    end: number;
}

export type Hg38BrowserProps = {
    domain: Domain;
    svgRef?: React.RefObject<SVGSVGElement>;
    onDomainChanged: (domain: Domain) => void;
    customTracks?: {
        title: string;
        color: string;
        track: { start: number; end: number; chr1: string; url: string; baiUrl?: string; preRenderedWidth: number };
    }[];
};

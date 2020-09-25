import { customTrack, Domain } from '../types';

export type Hg38BrowserProps = {
    domain: Domain;
    svgRef?: React.RefObject<SVGSVGElement>;
    onDomainChanged: (domain: Domain) => void;
    customTracks?: customTrack[];
    anchor?: string;
    setAnchor?: (snp: string) => void;
    customFiles?: { file: File; title: string; displayMode?: string }[];
    customPeaks?: { peaks: { chr: string; start: number; end: number }[] | []; title: string; displayMode?: string }[];
};

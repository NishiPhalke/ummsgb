import { customTrack, Domain } from '../types';

export type Hg19BrowserProps = {
    domain: Domain;
    svgRef?: React.RefObject<SVGSVGElement>;
    onDomainChanged: (domain: Domain) => void;
    anchor?: string;
    setAnchor?: (snp: string) => void;
    customTracks?: Record<string, customTrack>;
    customFiles?: Record<string, { file: File; title: string; displayMode?: string }>;
    customPeaks?: Record<string, { peaks: any | []; title: string; displayMode?: string }>;
    setCustomTracks?: (ct: Record<string, customTrack>) => void;
    setCustomFiles?: (cf: Record<string, { file: File; title: string; displayMode?: string }>) => void;
    setCustomPeaks?: (cp: Record<string, { peaks: any | []; title: string; displayMode?: string }>) => void;
};

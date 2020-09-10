import { customTrack, Domain } from '../types';

export type Hg38BrowserProps = {
    domain: Domain;
    svgRef?: React.RefObject<SVGSVGElement>;
    onDomainChanged: (domain: Domain) => void;
    customTracks?: customTrack[];
};

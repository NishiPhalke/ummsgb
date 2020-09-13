import { customTrack, Domain } from '../types';

export type Mm10BrowserProps = {
    domain: Domain;
    svgRef?: React.RefObject<SVGSVGElement>;
    onDomainChanged: (domain: Domain) => void;
    customTracks?: customTrack[];
};

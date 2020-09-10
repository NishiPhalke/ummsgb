import { customTrack } from '../types';
import { Domain } from '../types';

export type DefaultProps = {
    domain: Domain;
    assembly: string;
    svgRef?: React.RefObject<SVGSVGElement>;
    onDomainChanged: (domain: Domain) => void;
    customTracks?: customTrack[];
};

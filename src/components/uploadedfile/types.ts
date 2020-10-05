import { Domain } from '../../genomes/types';

export type UploadedFileProps = {
    file: File;
    domain: Domain;
    width: number;
    id: string;
    transform: string;
    svgRef?: React.RefObject<SVGSVGElement>;
    onHeightChanged?: (value: number) => void;
};

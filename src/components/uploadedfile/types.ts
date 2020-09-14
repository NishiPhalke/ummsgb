import { Domain } from '../../genomes/types';

export type UploadedFileProps = {
    file: File;
    domain: Domain;
    width: number;
    id: string;
    transform: string;
    onHeightChanged?: (value: number) => void;
};

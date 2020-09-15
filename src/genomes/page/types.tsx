import { customTrack, Domain } from '../types';

export type GenomeBrowserPageProps = {
    assembly: string;
    session?: {
        customTracks: Record<string, customTrack> | undefined;
        domain: Domain;
        anchor?: string;
    };
};

export type AssemblyInfo = { species: string; name: string; description: string };

export type SessionModalProps = { open: boolean; data: string; onClose: () => void; warn?: number };

export type MetadataModalProps = {
    open: boolean;
    onClose: () => void;
    assembly: string;
    onOpen: () => void;
    domain: Domain;
    onAccept: (
        modalState:
            | {
                  title: string;
                  url: string;
                  baiUrl?: string;
                  displayMode?: string;
                  color: string;
                  domain: Domain;
              }[]
            | undefined
    ) => void;
};

export type TrackConfigsProps = {
    tracks?: customTrack[];
    files?: Record<string, { file: File; title: string; displayMode?: string }>;
    onFileSelect: (title: string, displayMode: string) => void;
    onSelect: (
        modalState: {
            title: string;
            url: string;
            baiUrl?: string;
            displayMode?: string;
            color: string;
            domain: Domain;
        }[]
    ) => void;
};

export const DEFAULT_BIGBED_DISPLAYMODE = 'dense';
export const DEFAULT_BIGWIG_DISPLAYMODE = 'full';
export const DEFAULT_BAM_DISPLAYMODE = 'squish';

export const TrackType = {
    INVALID: 'INVALID',
    BIGWIG: 'BIGWIG',
    BIGBED: 'BIGBED',
    BAM: 'BAM',
};

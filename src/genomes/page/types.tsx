import { customTrack, Domain } from '../types';

export type GenomeBrowserPageProps = {
    assembly: string;
    session?: {
        customTracks: customTrack[] | undefined;
        domain: Domain;
    };
};

export type AssemblyInfo = { species: string; name: string; description: string };

export type SessionModalProps = { open: boolean; data: string; onClose: () => void; warn: number };

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

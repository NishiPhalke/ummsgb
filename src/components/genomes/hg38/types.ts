export interface Domain {
    chromosome?: string;
    start: number;
    end: number;
};

export type Hg38BrowserProps = {
    domain: Domain;
    onDomainChanged: (domain: Domain) => void;
};

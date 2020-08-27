export type Highlight = {
    color: string;
    start: number;
    end: number;
};

export interface Domain {
    chromosome?: string;
    start: number;
    end: number;
}

export type CytobandColors = {
    default: string;
    centromere: string;
    stalk: string;
};

export type CytobandsRProps = {
    assembly: string;
    chromosome: string;
    width: number;
    height: number;
    id: string;
    domain: Domain;
    highlight?: Highlight;
    colors?: CytobandColors;
    transform?: string;
};

export type Cytoband = {
    bandname: string;
    stain: string;
    coordinates: {
        chromosome: string;
        start: number;
        end: number;
    };
};

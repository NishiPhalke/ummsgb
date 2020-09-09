import { Result, RefSeqGenes } from "./types";

/**
 * Filters for unique search results, as non-unique results cause undefined
 * behavior in the semantic UI search component.
 *
 * @param results the list of results, each with a title field which distinguishes unique results.
 */
export const uniq = (results: Result[], d: string) : Result[] => {
    let r: Result[] = [];
    results.forEach((result: any) => {
        let found = false;
        r.forEach((rr) => {
            if (rr.title === result.title) found = true;
        });
        if (!found) r.push(result);
    });
    return r.length ? r : [{ title: d, description: '' }];
};

/**
 * Checks whether the entire string is a genomic coordinate in the form
 * chromosome:start-end.
 *
 * @param value the value to check
 */
export const isCoordinate = (value: string) => {
    const match = value.match && value.match(/^[a-zA-Z0-9]+[:][0-9,]+[-][0-9,]+$/g);
    return match && match.length && match.length === 1;
};

export const refsequniq = (results: RefSeqGenes[]) => {
    results = results.filter((x: any) => x.transcripts && x.transcripts.length);
    let r: {name: string, coordinates: { chromosome: string, start: number, end: number}}[] = [];
    results.forEach((result: RefSeqGenes) => {
        if (r.length === 3) return;
        let found = false;
        r.forEach(rr => { if (rr.name === result.id) found = true; });
        if (!found) r.push({
            name: result.id,
            coordinates: {
                chromosome: result.transcripts[0].coordinates.chromosome,
                start: Math.min(...result.transcripts.map((x) => x.coordinates.start)),
                end: Math.max(...result.transcripts.map((x: any) => x.coordinates.end))
            }
        });
    });
    return r;
};

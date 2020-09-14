import { MemoHg38Browser } from './hg38';
import { MemoHg19Browser } from './hg19';
import { MemoMm10Browser } from './mm10';
export const genomeConfig: Record<
    string,
    { browser: any; domain: { chromosome: string; start: number; end: number } }
> = {
    hg38: {
        browser: MemoHg38Browser,
        // domain: { chromosome: 'chr1', start: 10248, end: 10356 },
        domain: { chromosome: 'chr12', start: 53379291, end: 53416942 },
    },
    hg19: {
        browser: MemoHg19Browser,
        domain: { chromosome: 'chr12', start: 53772979, end: 53810726 },
    },
    mm10: {
        browser: MemoMm10Browser,
        domain: { chromosome: 'chr7', start: 19695109, end: 19699688 },
    },
};

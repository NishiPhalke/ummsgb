import { Hg38Browser } from './hg38';
import { Hg19Browser } from './hg19';
import Mm10Browser from './mm10/browser';
export const genomeConfig = {
    hg38: {
        browser: Hg38Browser,
        domain: { chr1: 'chr12', start: 53379291, end: 53416942 },
    },
    hg19: {
        browser: Hg19Browser,
        domain: { chr1: 'chr12', start: 53379291, end: 53416942 },
    },
    mm10: {
        browser: Mm10Browser,
        domain: { chr1: 'chr12', start: 53379291, end: 53416942 },
    },
};

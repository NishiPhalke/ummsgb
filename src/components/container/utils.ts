import { Domain } from './types';

/**
import { Domain } from './../genomes/hg38/types';
 * Confirms that a domain falls within the current chromosome limits;
 * if it does not, trims the ends so that it does.
 *
 * @param domain the input domain to validate.
 * @param chromlimit the maximum value on the current chromosome.
 */
export const validateDomain = (domain: Domain, chromlimit: number) => {
    if (domain.end > chromlimit) domain.end = chromlimit;
    if (domain.start < 0) domain.start = 0;
    else if (domain.start >= domain.end) domain.start = domain.end - 1;
    return domain;
};

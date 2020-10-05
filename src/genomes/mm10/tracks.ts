import { Domain } from '../types';
/**

 * tracks.jsx
 *
 * Provides track objects for mm10. These objects are intended to be provided to
 * GraphQL tracksets.
 */

/**
 * Creates a track object for requesting conservation for a given region.
 *
 * @param domain the chromosome, start, and end positions of the requested region.
 */
export const conservationtrack = (domain: Domain) => ({
    start: domain.start,
    end: domain.end,
    chr1: domain.chromosome!!,
    url: 'gs://data.genomealmanac.org/mm10.60way.phyloP60way.bw',
    preRenderedWidth: 1850,
    id: 'phyloP',
    color: '#000088',
    title: 'phyloP 100-way conservation',
    zoomLevel: Math.round((domain.end - domain.start) / 1850),
});

/**
 * Creates a track object for requesting aggregate DNase-seq for a given region.
 *
 * @param domain the chromosome, start, and end positions of the requested region.
 */
export const dnasetrack = (domain: Domain) => ({
    start: domain.start,
    end: domain.end,
    chr1: domain.chromosome!!,
    url: 'gs://data.genomealmanac.org/mm10.dnase.bigWig',
    preRenderedWidth: 1850,
    id: 'dnase',
    color: '#06da93',
    title: 'Aggregated DNase-seq from ENCODE',
    zoomLevel: Math.round((domain.end - domain.start) / 1850),
});

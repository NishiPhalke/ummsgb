/**
 * tracks.jsx
 *
 * Provides track objects for hg38. These objects are intended to be provided to
 * GraphQL tracksets.
 */

import { Domain } from '../types';

/**
 * Creates a track object for requesting aggregated DNase signal for a given region.
 *
 * @param domain the chromosome, start, and end positions of the requested region.
 */
export const dnasetrack = (domain: Domain) => ({
    start: domain.start,
    end: domain.end,
    chr1: domain.chromosome!!,
    url: 'gs://data.genomealmanac.org/dnase.hg38.sum.bigWig',
    preRenderedWidth: 1850,
    id: 'dnase',
    title: 'Aggregated DNase-seq from ENCODE',
    color: '#06da93',
    zoomLevel: Math.round((domain.end - domain.start) / 1850),
});

/**
 * Creates a track object for requesting aggregated H3K4me3 signal for a given region.
 *
 * @param domain the chromosome, start, and end positions of the requested region.
 */
export const h3k4me3track = (domain: Domain) => ({
    start: domain.start,
    end: domain.end,
    chr1: domain.chromosome!!,
    url: 'gs://data.genomealmanac.org/h3k4me3.hg38.sum.bigWig',
    preRenderedWidth: 1850,
    id: 'H3K4me3',
    title: 'Aggregated H3K4me3 ChIP-seq from ENCODE',
    color: '#ff0000',
    zoomLevel: Math.round((domain.end - domain.start) / 1850),
});

/**
 * Creates a track object for requesting aggregated H3K27ac signal for a given region.
 *
 * @param domain the chromosome, start, and end positions of the requested region.
 */
export const h3k27actrack = (domain: Domain) => ({
    start: domain.start,
    end: domain.end,
    chr1: domain.chromosome!!,
    url: 'gs://data.genomealmanac.org/h3k27ac.hg38.sum.bigWig',
    preRenderedWidth: 1850,
    id: 'H3K27ac',
    title: 'Aggregated H3K27ac ChIP-seq from ENCODE',
    color: '#ffcd00',
    zoomLevel: Math.round((domain.end - domain.start) / 1850),
});

/**
 * Creates a track object for requesting aggregated CTCF signal for a given region.
 *
 * @param domain the chromosome, start, and end positions of the requested region.
 */
export const ctcftrack = (domain: Domain) => ({
    start: domain.start,
    end: domain.end,
    chr1: domain.chromosome!!,
    url: 'gs://data.genomealmanac.org/ctcf.hg38.sum.bigWig',
    preRenderedWidth: 1850,
    id: 'ctcf',
    title: 'Aggregated CTCF ChIP-seq from ENCODE',
    color: '#00b0f0',
    zoomLevel: Math.round((domain.end - domain.start) / 1850),
});

/**
 * Creates a track object for requesting conservation for a given region.
 *
 * @param domain the chromosome, start, and end positions of the requested region.
 */
export const conservationtrack = (domain: Domain) => ({
    start: domain.start,
    end: domain.end,
    chr1: domain.chromosome!!,
    url: 'gs://data.genomealmanac.org/hg38.phyloP100way.bigWig',
    preRenderedWidth: 1850,
    id: 'phyloP',
    title: 'phyloP 100-way conservation',
    color: '#000088',
    zoomLevel: Math.round((domain.end - domain.start) / 1850),
});

/**
 * Creates a track object for requesting plus strand rampage signal for a given region.
 *
 * @param domain the chromosome, start, and end positions of the requested region.
 */
export const rampageplus = (domain: Domain) => ({
    start: domain.start,
    end: domain.end,
    chr1: domain.chromosome!!,
    url: 'gs://data.genomealmanac.org/rampage.plus.bigWig',
    preRenderedWidth: 1850,
    id: 'rampplus',
    title: 'RAMPAGE plus',
    color: '#000000',
    zoomLevel: Math.round((domain.end - domain.start) / 1850),
});

/**
 * Creates a track object for requesting minus strand rampage signal for a given region.
 *
 * @param domain the chromosome, start, and end positions of the requested region.
 */
export const rampageminus = (domain: Domain) => ({
    start: domain.start,
    end: domain.end,
    chr1: domain.chromosome!!,
    url: 'gs://data.genomealmanac.org/rampage.minus.bigWig',
    preRenderedWidth: 1850,
    id: 'rampminus',
    title: 'RAMPAGE minus',
    color: '#000000',
    zoomLevel: Math.round((domain.end - domain.start) / 1850),
});

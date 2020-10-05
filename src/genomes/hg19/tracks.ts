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
    url: 'gs://gcp.wenglab.org/dnase.hg19.sum.bigWig',
    preRenderedWidth: 1850,
    id: 'dnase',
    title: 'Aggregated DNase-seq from ENCODE',
    color: '#ff0000',
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
    url: 'http://users.wenglab.org/pratth/h3k4me3.hg19.sum.bigWig',
    preRenderedWidth: 1850,
    id: 'h3k4me3',
    title: 'Aggregated h3k4me3 chip-seq  from ENCODE',
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
    url: 'http://users.wenglab.org/pratth/h3k27ac.hg19.sum.bigWig',
    preRenderedWidth: 1850,
    id: 'h3k27ac',
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
    url: 'http://users.wenglab.org/pratth/ctcf.hg19.sum.bigWig',
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
    url: 'gs://gcp.wenglab.org/phyloP100way.hg19.bigWig',
    preRenderedWidth: 1850,
    title: 'phyloP 100-way conservation',
    id: 'phyloP',
    color: '#000088',
    zoomLevel: Math.round((domain.end - domain.start) / 1850),
});

/**
 * Creates a track object for requesting DHSs for a given region.
 *
 * @param domain the chromosome, start, and end positions of the requested region.
 */
export const dhstrack = (domain: Domain) => ({
    start: domain.start,
    end: domain.end,
    chr1: domain.chromosome!!,
    url: 'http://users.wenglab.org/pratth/dnase.sum.hg19.rDHS.sorted.bigBed',
    preRenderedWidth: 1850,
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
    url: 'https://users.wenglab.org/pratth/rampage.hg19.plus.bigWig',
    preRenderedWidth: 1850,
    title: 'rampage plus',
    id: 'ramplus',
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
    url: 'https://users.wenglab.org/pratth/rampage.hg19.minus.bigWig',
    preRenderedWidth: 1850,
    id: 'rampminus',
    title: 'rampage minus',
    color: '#000000',
    zoomLevel: Math.round((domain.end - domain.start) / 1850),
});

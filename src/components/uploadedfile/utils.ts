import React from 'react';
import { BigWigData, BigZoomData } from 'bigwig-reader';
import { Domain } from '../../genomes/types';

export function isReactElement(child: React.ReactNode): child is React.ReactElement {
    return (child as React.ReactElement) && (child as React.ReactElement).props !== undefined;
}

const initialPreRenderedValues = (domain: Domain) => {
    let retval = [];
    for (let i = domain.start; i <= domain.end; ++i) {
        retval.push({
            x: i,
            max: -Infinity,
            min: Infinity,
        });
    }
    return retval;
};

/**
 * Creates a proimse for condensing zoomed bigWig data to return exactly one element per pixel.
 *
 * @param data the zoom data returned by the bigWig reader
 * @param request the request, containing coordinates and number of basepairs per pixel
 */
export const condensedData = (data: BigWigData[], preRenderedWidth: number, domain: Domain) => {
    const x = (i: number) => ((i - domain.start) * preRenderedWidth) / (domain.end - domain.start);

    const cbounds = { start: Math.floor(x(domain.start)), end: Math.floor(x(domain.end)) };
    let retval = initialPreRenderedValues(cbounds);

    data.forEach((point: BigWigData) => {
        const cxs = Math.floor(x(point.start < domain.start ? domain.start : point.start));
        const cxe = Math.floor(x(point.end > domain.end ? domain.end : point.end));
        if (point.value < retval[cxs].min) retval[cxs].min = point.value;
        if (point.value > retval[cxs].max) retval[cxs].max = point.value;
        for (let i = cxs + 1; i <= cxe; ++i) {
            retval[i].min = point.value;
            retval[i].max = point.value;
        }
    });
    return retval;
};

/**
 * Creates a proimse for condensing zoomed bigWig data to return exactly one element per pixel.
 *
 * @param data the zoom data returned by the bigWig reader
 * @param request the request, containing coordinates and number of basepairs per pixel
 */
export const condensedZoomData = (data: BigZoomData[], preRenderedWidth: number, domain: Domain) => {
    const x = (i: number) => ((i - domain.start) * preRenderedWidth) / (domain.end - domain.start);
    const cbounds = { start: Math.floor(x(domain.start)), end: Math.floor(x(domain.end)) };
    let retval = initialPreRenderedValues(cbounds);

    data.forEach((point: BigZoomData) => {
        const cxs = Math.floor(x(point.start < domain.start ? domain.start : point.start));
        const cxe = Math.floor(x(point.end > domain.end ? domain.end : point.end));
        if (point.minVal < retval[cxs].min) retval[cxs].min = point.minVal;
        if (point.maxVal > retval[cxs].max) retval[cxs].max = point.maxVal;
        for (let i = cxs + 1; i <= cxe; ++i) {
            retval[i].min = point.minVal;
            retval[i].max = point.maxVal;
        }
    });
    return retval;
};

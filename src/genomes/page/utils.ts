import { DEFAULT_BIGWIG_DISPLAYMODE, TrackType, DEFAULT_BAM_DISPLAYMODE, DEFAULT_BIGBED_DISPLAYMODE } from './types';
import { inflate } from 'pako';

const svgData = (_svg: any): string => {
    let svg = _svg.cloneNode(true);
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    let preface = '<?xml version="1.0" standalone="no"?>';
    return preface + svg.outerHTML.replace(/\n/g, '').replace(/[ ]{8}/g, '');
};

const downloadData = (text: string, filename: string, type: string = 'text/plain') => {
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.setAttribute('style', 'display: none');
    const blob = new Blob([text], { type });
    const url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
};

export const downloadSVG = (ref: React.MutableRefObject<any>, filename: string) => () =>
    ref.current && downloadData(svgData(ref.current!), filename, 'image/svg;charset=utf-8');

export const getTrackDisplayModes = (url: string): { key: string; text: string; value: string }[] => {
    if (getTrackType(url) === 'BIGWIG') {
        return [
            { key: 'dense', text: 'dense', value: 'dense' },
            { key: 'full', text: 'full', value: 'full' },
            { key: 'hide', text: 'hide', value: 'hide' },
        ];
    } else if (getTrackType(url) === 'BAM' || getTrackType(url) === 'BIGBED') {
        return [
            { key: 'dense', text: 'dense', value: 'dense' },
            { key: 'squish', text: 'squish', value: 'squish' },
            { key: 'hide', text: 'hide', value: 'hide' },
        ];
    } else {
        return [
            { key: 'dense', text: 'dense', value: 'dense' },
            { key: 'squish', text: 'squish', value: 'squish' },
            { key: 'full', text: 'full', value: 'full' },
            { key: 'hide', text: 'hide', value: 'hide' },
        ];
    }
};

export const getDefaultDisplayMode = (url: string): string | undefined => {
    if (getTrackType(url) === 'BIGWIG') {
        return DEFAULT_BIGWIG_DISPLAYMODE;
    } else if (getTrackType(url) === 'BIGBED') {
        return DEFAULT_BIGBED_DISPLAYMODE;
    } else if (getTrackType(url) === 'BAM') {
        return DEFAULT_BAM_DISPLAYMODE;
    } else {
        return undefined;
    }
};
const getTrackType = (url: string): string | undefined => {
    if (url.toLowerCase().includes('.bigwig') || url.toLowerCase().includes('.bw')) {
        return TrackType.BIGWIG;
    } else if (
        url.toLowerCase().includes('.bigbed') ||
        url.toLowerCase().includes('.bb') ||
        url.toLowerCase().includes('.bed')
    ) {
        return TrackType.BIGBED;
    } else if (url.toLowerCase().includes('.bam')) {
        return TrackType.BAM;
    } else {
        return undefined;
    }
};

const parseBed = (e: string) => {    
    const lines = e.split('\n');
    return lines
        .map((l: string) => l.split('\t'))
        .filter((l: string[]) => l.length >= 3)
        .map((r: string[]) => ({
            chromosome: r[0],
            start: +r[1],
            end: +r[2],
        }))
        .filter((r: { start: number, end: number}) => !isNaN(r.start) && !isNaN(r.end));
};

export const readBed =(file: File, onComplete: (regions: {chromosome: string, start: number, end: number}[]) => void, onError: (e: Error) => void) =>{
    const textReader = new FileReader();
    textReader.onload = (e: any) => {
        const newRegions = parseBed(e.target.result);
        if (newRegions.length > 0) onComplete(newRegions);
        else {
            const binaryReader = new FileReader();
            binaryReader.onload = (e) => {
                try {
                    e.target && onComplete(parseBed(new TextDecoder().decode(inflate(e.target.result as any))));
                } catch (ex) {
                    onError(ex);
                }
            };
            binaryReader.readAsBinaryString(file);
        }
    };
    textReader.readAsText(file);
}

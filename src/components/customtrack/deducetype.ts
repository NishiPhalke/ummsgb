import { TrackType } from './types';

export const deduceTrackType = (data: any) => {
    if (!data.length) return TrackType.INVALID;
    if (data[0].name !== undefined) return TrackType.BIGBED;
    if (data[0].max !== undefined && data[0].min !== undefined) return TrackType.BIGWIG;
    if (data[0].value !== undefined) return TrackType.BIGWIG;
    return TrackType.INVALID;
};

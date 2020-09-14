import React from 'react';
import { CustomTrackProps, TrackType } from './types';
import {
    WrappedTrack,
    WrappedFullBigWig,
    EmptyTrack,
    WrappedDenseBigBed,
    WrappedSquishBigBed,
    WrappedDenseBigWig,
} from 'umms-gb';
import { deduceTrackType } from './deducetype';
const CustomTrack: React.FC<CustomTrackProps> = (props) => {
    if (!props.data || props.loading) {
        return (
            <WrappedTrack width={props.width} height={props.height} noData loading>
                <EmptyTrack {...(props || {})} />
            </WrappedTrack>
        );
    }
    const trackType = deduceTrackType(props.data);
    const displayMode = props.displayMode;
    switch (trackType) {
        case TrackType.BIGBED:
            return displayMode === 'dense' ? (
                <WrappedDenseBigBed
                    title={props.title}
                    width={props.width}
                    height={props.height}
                    transform={'translate (0,0)'}
                    id={props.id}
                    color={props.color}
                    domain={props.domain}
                    data={props.data}
                    titleSize={12}
                    trackMargin={12}
                />
            ) : (
                <WrappedSquishBigBed
                    title={props.title}
                    width={props.width}
                    height={props.height}
                    rowHeight={10}
                    transform={'translate (0,0)'}
                    id={props.id}
                    color={props.color}
                    domain={props.domain}
                    data={props.data}
                    titleSize={12}
                    trackMargin={12}
                />
            );
        case TrackType.BIGWIG:
            return displayMode === 'dense' ? (
                <WrappedDenseBigWig
                    title={props.title}
                    width={props.width}
                    height={props.height}
                    transform={'translate (0,0)'}
                    id={props.id}
                    color={props.color}
                    domain={props.domain}
                    data={props.data}
                    titleSize={12}
                    trackMargin={12}
                />
            ) : (
                <WrappedFullBigWig
                    title={props.title}
                    width={props.width}
                    height={props.height}
                    transform={'translate (0,0)'}
                    id={props.id}
                    color={props.color}
                    domain={props.domain}
                    data={props.data}
                    titleSize={12}
                    trackMargin={12}
                />
            );
        default:
            return (
                <WrappedTrack width={props.width} height={props.height} noData>
                    <EmptyTrack {...(props || {})} />
                </WrappedTrack>
            );
    }
};

export default CustomTrack;

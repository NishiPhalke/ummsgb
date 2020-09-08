import React from 'react';
import { CustomTrackProps } from './types';
import { WrappedTrack, WrappedFullBigWig, EmptyTrack, WrappedDenseBigBed } from 'umms-gb';
import { TrackType, deduceTrackType } from './deducetype';
const CustomTrack: React.FC<CustomTrackProps> = (props) => {
    if (!props.data) {
        return (
            <WrappedTrack width={props.width} height={props.height} noData loading>
                <EmptyTrack {...(props || {})} />
            </WrappedTrack>
        );
    }
    switch (deduceTrackType(props.data)) {
        case TrackType.BIGBED:
            return (
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
            );
        case TrackType.BIGWIG:
            return (
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

import React from 'react';
import { CustomTrackProps, TrackType, DEFAULT_BAM_DISPLAYMODE } from './types';
import {
    WrappedTrack,
    WrappedFullBigWig,
    EmptyTrack,
    WrappedDenseBigBed,
    WrappedSquishBigBed,
    WrappedDenseBigWig,
} from 'umms-gb';
import { deduceTrackType } from './deducetype';
import { DEFAULT_BIGBED_DISPLAYMODE } from '../../genomes/page/types';
import { DEFAULT_BIGWIG_DISPLAYMODE } from './../../genomes/page/types';
const CustomTrack: React.FC<CustomTrackProps> = (props) => {
    if (!props.data || props.loading) {
        return (
            <WrappedTrack width={props.width} height={props.height} noData loading>
                <EmptyTrack {...(props || {})} />
            </WrappedTrack>
        );
    }
    const trackType = deduceTrackType(props.data);
    const displayMode =
        props.displayMode ||
        (trackType === TrackType.BIGBED
            ? DEFAULT_BIGBED_DISPLAYMODE
            : trackType === TrackType.BIGWIG
            ? DEFAULT_BIGWIG_DISPLAYMODE
            : DEFAULT_BAM_DISPLAYMODE);
    switch (trackType) {
        case TrackType.BIGBED:
            return displayMode === 'dense' ? (
                <WrappedDenseBigBed
                    {...props}
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
                    {...props}
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
                    {...props}
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
                    {...props}
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
                <WrappedTrack
                    width={props.width}
                    title={props.title}
                    height={props.height}
                    noData
                    titleSize={12}
                    trackMargin={12}
                >
                    <EmptyTrack {...(props || {})} />
                </WrappedTrack>
            );
    }
};

export default CustomTrack;

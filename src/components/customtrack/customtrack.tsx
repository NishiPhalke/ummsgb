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
    if (props.loading) {
        return (
            <WrappedTrack
                {...props}
                id={props.id}
                width={props.width}
                height={props.height}
                loading
                title={props.title}
            >
                <EmptyTrack {...props} />
            </WrappedTrack>
        );
    }

    /*if (!props.data || (props.data && props.data.length===0) ) {
        if(props.displayMode==='hide')
        {   
            return (<WrappedTrack {...props} width={props.width} height={0} id={props.id} title={undefined} >
                <EmptyTrack  width={props.width} transform={'translate (0,0)'} height={0} id={props.id} />
            </WrappedTrack>)

        }  else { return  (
            <WrappedTrack {...props} id={props.id} width={props.width} height={props.height} noData title={props.title}  titleSize={12}
            svgRef={props.svgRef}
            trackMargin={12}>
                <EmptyTrack   width={props.width}
                             transform={'translate (0,0)'}
                             height={props.height}
                             id={props.id}/>
            </WrappedTrack>
        );
        }
        
    }*/
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
            if (displayMode === 'squish') {
                return (
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
            } else if (displayMode === 'hide') {
                return (
                    <WrappedTrack {...props} width={props.width} height={0} title={undefined} id={props.id}>
                        <EmptyTrack width={props.width} transform={'translate (0,0)'} height={0} id={props.id} />
                    </WrappedTrack>
                );
            } else {
                return (
                    <WrappedDenseBigBed
                        {...props}
                        title={props.title}
                        width={props.width}
                        height={props.height / 2}
                        transform={'translate (0,0)'}
                        id={props.id}
                        color={props.color}
                        domain={props.domain}
                        data={props.data}
                        titleSize={12}
                        trackMargin={12}
                    />
                );
            }
        case TrackType.BIGWIG:
            if (displayMode === 'hide') {
                return (
                    <WrappedTrack {...props} width={props.width} height={0} id={props.id} title={undefined}>
                        <EmptyTrack width={props.width} transform={'translate (0,0)'} height={0} id={props.id} />
                    </WrappedTrack>
                );
            } else if (displayMode === 'dense') {
                return (
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
                );
            } else {
                return (
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
            }
        default:
            if (displayMode === 'hide') {
                return (
                    <WrappedTrack {...props} width={props.width} height={0} id={props.id} title={undefined}>
                        <EmptyTrack width={props.width} transform={'translate (0,0)'} height={0} id={props.id} />
                    </WrappedTrack>
                );
            } else {
                return (
                    <WrappedTrack
                        {...props}
                        width={props.width}
                        title={props.title}
                        height={props.height}
                        noData
                        id={props.id}
                        titleSize={12}
                        trackMargin={12}
                    >
                        <EmptyTrack
                            width={props.width}
                            transform={'translate (0,0)'}
                            height={props.height}
                            id={props.id}
                        />
                    </WrappedTrack>
                );
            }
    }
};

export default CustomTrack;

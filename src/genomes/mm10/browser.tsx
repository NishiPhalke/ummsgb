import { Mm10BrowserProps } from './types';
import React, { useState } from 'react';
import {
    StackedTracks,
    RulerTrack,
    GraphQLTrackSet,
    WrappedFullBigWig,
    WrappedTrack,
    GraphQLTranscriptTrack,
    WrappedPackTranscriptTrack,
} from 'umms-gb';
import { dnasetrack, conservationtrack } from './tracks';
import { Domain } from './types';
import { CustomTrack } from '../../components/customtrack';
const tracks = (range: Domain) => [dnasetrack(range), conservationtrack(range)];
const Mm10Browser: React.FC<Mm10BrowserProps> = (props) => {
    const [height, setHeight] = useState<number>(200);
    console.log(height, props.customTracks);

    return (
        <svg width={2000} height={height} ref={props.svgRef}>
            <StackedTracks id="test_stacked" onHeightChanged={setHeight}>
                <WrappedTrack width={2000} height={50} title="scale" titleSize={12} trackMargin={12}>
                    <RulerTrack width={2000} height={50} {...(props || {})} />
                </WrappedTrack>
                <GraphQLTrackSet
                    tracks={tracks(props.domain)}
                    transform={'translate (0,0)'}
                    id={'testbigwig'}
                    width={2000}
                    endpoint={'https://ga.staging.wenglab.org/graphql'}
                >
                    <WrappedFullBigWig
                        title="Aggregated DNase-seq from ENCODE"
                        width={2000}
                        height={50}
                        id="dnase"
                        color="#06da93"
                        domain={props.domain}
                        titleSize={12}
                        trackMargin={12}
                    />

                    <WrappedFullBigWig
                        title="phyloP 100-way conservatio"
                        width={2000}
                        height={50}
                        id="phyloP"
                        color="#000088"
                        domain={props.domain}
                        titleSize={12}
                        trackMargin={12}
                    />
                </GraphQLTrackSet>

                {props.customTracks !== null && props.customTracks !== undefined && props.customTracks!!.length > 0 && (
                    <GraphQLTrackSet
                        tracks={props.customTracks!!.map((x) => x.track)}
                        endpoint={'https://ga.staging.wenglab.org/graphql'}
                        width={2000}
                        transform={'translate (0,0)'}
                        id={'customtrack,' + props.customTracks!!.map((x, i) => i).join(',')}
                    >
                        {props.customTracks!!.map((track, i) => (
                            <CustomTrack
                                //  i={i}
                                key={'ct' + i}
                                width={2000}
                                height={50}
                                id={'ct' + i}
                                transform={'translate (0,0)'}
                                title={track.title}
                                color={track.color}
                                domain={props.domain}
                            />
                        ))}
                    </GraphQLTrackSet>
                )}
                <GraphQLTranscriptTrack
                    domain={props.domain}
                    transform={'translate (0,0)'}
                    assembly={props.assembly}
                    endpoint={'https://ga.staging.wenglab.org/graphql'}
                >
                    <WrappedPackTranscriptTrack
                        titleSize={12}
                        trackMargin={12}
                        title={'GENCODE v29 transcripts'}
                        color="#8b0000"
                        onHeightChanged={(h: number) => {
                            setHeight(
                                h +
                                    150 +
                                    (props.customTracks !== null &&
                                    props.customTracks !== undefined &&
                                    props.customTracks!!.length > 0
                                        ? props.customTracks!!.length * 50
                                        : 0)
                            );
                        }}
                        id="transrthcript"
                        rowHeight={14}
                        width={2000}
                        domain={props.domain}
                    />
                </GraphQLTranscriptTrack>
            </StackedTracks>
        </svg>
    );
};

export default Mm10Browser;

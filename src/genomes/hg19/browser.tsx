import { Hg19BrowserProps } from './types';
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
import {
    dnasetrack,
    h3k4me3track,
    h3k27actrack,
    ctcftrack,
    conservationtrack,
    rampageplus,
    rampageminus,
} from './tracks';
import { Domain } from './types';
import { CustomTrack } from '../../components/customtrack';
const tracks = (range: Domain) => [
    dnasetrack(range),
    h3k4me3track(range),
    h3k27actrack(range),
    ctcftrack(range),
    conservationtrack(range),
    rampageplus(range),
    rampageminus(range),
];
const Hg38Browser: React.FC<Hg19BrowserProps> = (props) => {
    const [height, setHeight] = useState<number>(200);
    console.log(height, props.customTracks);

    return (
        <svg width={2000} height={height} ref={props.svgRef}>
            <StackedTracks id="test_stacked" onHeightChanged={setHeight}>
                <WrappedTrack width={2000} height={50} title="scale" titleSize={12} trackMargin={12}>
                    <RulerTrack width={2000} height={50} {...(props || {})} />
                </WrappedTrack>
                
              
                <GraphQLTranscriptTrack
                    domain={props.domain}
                    transform={'translate (0,0)'}
                    assembly={'hg19'}
                    endpoint={'https://ga.staging.wenglab.org/graphql'}
                >
                    <WrappedPackTranscriptTrack
                        titleSize={12}
                        trackMargin={12}
                        title={'GENCODE v29 transcripts'}
                        color="#8b0000"
                        onHeightChanged={(h: number) => {
                            let ht = height
                            setHeight(
                                h + ht
                            );
                        }}
                        id="transrthcript"
                        rowHeight={14}
                        width={2000}
                        domain={props.domain}
                    />
                </GraphQLTranscriptTrack>
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
                        title="Aggregated H3K4me3 ChIP-seq from ENCODE"
                        width={2000}
                        height={50}
                        id="H3K4me3"
                        color="#ff0000"
                        domain={props.domain}
                        titleSize={12}
                        trackMargin={12}
                    />
                    <WrappedFullBigWig
                        title="Aggregated H3K27ac ChIP-seq from ENCODE"
                        width={2000}
                        height={50}
                        id="H3K27ac"
                        color="#ffcd00"
                        domain={props.domain}
                        titleSize={12}
                        trackMargin={12}
                    />
                    <WrappedFullBigWig
                        title="Aggregated CTCF ChIP-seq from ENCODE"
                        width={2000}
                        height={50}
                        id="ctcf"
                        color="#00b0f0"
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
                    <WrappedFullBigWig
                        title="rampage plus"
                        width={2000}
                        height={50}
                        id="ramplus"
                        domain={props.domain}
                        titleSize={12}
                        trackMargin={12}
                    />
                    <WrappedFullBigWig
                        title="rampage minus"
                        width={2000}
                        height={50}
                        id="ramminus"
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
                                onHeightChanged={(h: number) => {
                                    let ht = height
                                    setHeight(
                                        h + ht
                                           )
                                    
                                }}
                                id={'ct' + i}
                                transform={'translate (0,0)'}
                                title={track.title}
                                color={track.color}
                                domain={props.domain}
                            />
                        ))}
                    </GraphQLTrackSet>
                )}
            </StackedTracks>
        </svg>
    );
};

export default Hg38Browser;

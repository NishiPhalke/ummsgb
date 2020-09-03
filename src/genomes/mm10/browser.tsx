import { Mm10BrowserProps } from './types';
import React from 'react';
import {
    RulerTrack,
    GraphQLTrackSet,
    WrappedFullBigWig,
    WrappedTrack,
    GraphQLTranscriptTrack,
    WrappedPackTranscriptTrack,
    GenomeBrowser,
} from 'umms-gb';
import { dnasetrack, conservationtrack } from './tracks';
import { Domain } from './types';
import { CustomTrack } from '../../components/customtrack';
import { Container } from 'semantic-ui-react';

const tracks = (range: Domain) => [dnasetrack(range), conservationtrack(range)];

const Mm10Browser: React.FC<Mm10BrowserProps> = props => (
    <Container style={{ width: "90%" }}>
        <GenomeBrowser innerWidth={2000} width="100%" domain={props.domain} svgRef={props.svgRef}>
            <WrappedTrack width={2000} height={50} title="scale" titleSize={12} trackMargin={12}>
                <RulerTrack width={2000} height={50} {...(props || {})} />
            </WrappedTrack>
            <GraphQLTrackSet
                tracks={tracks(props.domain)}
                transform={'translate (0,0)'}
                id={'mm10_tracks'}
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
            <GraphQLTranscriptTrack
                domain={props.domain}
                transform={'translate (0,0)'}
                assembly={props.assembly}
                endpoint={'https://ga.staging.wenglab.org/graphql'}
                id="g"
            >
                <WrappedPackTranscriptTrack
                    titleSize={12}
                    trackMargin={12}
                    title={'GENCODE v29 transcripts'}
                    color="#8b0000"
                    id="transcript"
                    rowHeight={14}
                    width={2000}
                    domain={props.domain}
                />
            </GraphQLTranscriptTrack>
            { props.customTracks && props.customTracks!!.length > 0 && (
                <GraphQLTrackSet
                    tracks={props.customTracks!.map(x => ({ ...x.track, chr1: props.domain.chromosome!, start: props.domain.start, end: props.domain.end }))}
                    endpoint={'https://ga.staging.wenglab.org/graphql'}
                    width={2000}
                    transform={'translate(0,0)'}
                    id={`customtrack,${props.customTracks!.map((x, i) => i).join(',')}`}
                >
                    {props.customTracks!!.map((track, i) => (
                        <CustomTrack
                            key={`ct${i}`}
                            width={2000}
                            height={50}
                            id={`ct${i}`}
                            transform={'translate(0,0)'}
                            title={track.title}
                            color={track.color}
                            domain={props.domain}
                        />
                    ))}
                </GraphQLTrackSet>
            )}
        </GenomeBrowser>
    </Container>
);
export default Mm10Browser;

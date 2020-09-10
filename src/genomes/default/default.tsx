import { DefaultProps } from './types';
import React from 'react';
import {
    RulerTrack,
    GraphQLTrackSet,
    WrappedTrack,
    GenomeBrowser,
    WrappedPackTranscriptTrack,
    GraphQLTranscriptTrack,
} from 'umms-gb';
import { CustomTrack } from '../../components/customtrack';
import { Container } from 'semantic-ui-react';

const DefaultBrowser: React.FC<DefaultProps> = (props) => (
    <Container style={{ width: '90%' }}>
        <GenomeBrowser width="100%" innerWidth={2000} domain={props.domain} svgRef={props.svgRef}>
            <WrappedTrack width={2000} height={50} title="scale" titleSize={12} trackMargin={12}>
                <RulerTrack width={2000} height={50} {...(props || {})} />
            </WrappedTrack>
            <GraphQLTranscriptTrack
                domain={props.domain}
                transform={'translate (0,0)'}
                assembly={props.assembly}
                endpoint={'http://35.201.115.1/graphql'}
                id="refseqgenes"
                queryType={'refseqgenes'}
            >
                <WrappedPackTranscriptTrack
                    titleSize={12}
                    trackMargin={12}
                    title="RefSeq transcripts"
                    color="#8b0000"
                    id="refseqgenes_transcript_track"
                    rowHeight={14}
                    width={2000}
                    domain={props.domain}
                />
            </GraphQLTranscriptTrack>
            <GraphQLTranscriptTrack
                domain={props.domain}
                transform={'translate (0,0)'}
                assembly={props.assembly}
                endpoint={'http://35.201.115.1/graphql'}
                id="refseqxenogenes"
                queryType={'refseqxenogenes'}
            >
                <WrappedPackTranscriptTrack
                    titleSize={12}
                    trackMargin={12}
                    title="RefSeq transcripts in other species"
                    color="#8b0000"
                    id="refseqxeno_transcript_track"
                    rowHeight={14}
                    width={2000}
                    domain={props.domain}
                />
            </GraphQLTranscriptTrack>
            {props.customTracks && props.customTracks!.length > 0 && (
                <GraphQLTrackSet
                    tracks={props.customTracks!.map((x) => ({
                        ...x.track,
                        chr1: props.domain.chromosome!,
                        start: props.domain.start,
                        end: props.domain.end,
                    }))}
                    endpoint="https://ga.staging.wenglab.org/graphql"
                    width={2000}
                    transform="translate(0,0)"
                    id={`customtrack,${props.customTracks!.map((x, i) => i).join(',')}`}
                >
                    {props.customTracks!.map((track, i) => (
                        <CustomTrack
                            key={`ct${i}`}
                            width={2000}
                            height={50}
                            id={`ct${i}`}
                            transform="translate(0,0)"
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
export default DefaultBrowser;

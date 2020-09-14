import { DefaultProps } from './types';
import React from 'react';
import {
    RulerTrack,
    GraphQLTrackSet,
    WrappedTrack,
    GenomeBrowser,
    WrappedPackTranscriptTrack,
    GraphQLTranscriptTrack,
    WrappedSquishBam,
    BamTrack,
    WrappedDenseBam,
} from 'umms-gb';
import { CustomTrack } from '../../components/customtrack';
import { Container } from 'semantic-ui-react';
import { UploadedFile } from './../../components/uploadedfile';

const DefaultBrowser: React.FC<DefaultProps> = (props) => {
    
    let customTracks = props.customTracks?.filter((ct) => !ct.track.baiUrl);
    let bamCustomTracks = props.customTracks?.filter((ct) => ct.track.baiUrl);
    return (
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
                {customTracks && (
                    <GraphQLTrackSet
                        tracks={customTracks.map((x) => ({
                            ...x.track,
                            chr1: props.domain.chromosome!,
                            start: props.domain.start,
                            end: props.domain.end,
                        }))}
                        endpoint="https://ga.staging.wenglab.org/graphql"
                        width={2000}
                        transform="translate(0,0)"
                        id={`customtrack,${customTracks.map((x, i) => i).join(',')}`}
                    >
                        {customTracks.map((track, i) => (
                            <CustomTrack
                                key={`ct${i}`}
                                width={2000}
                                height={50}
                                id={`ct${i}`}
                                transform="translate(0,0)"
                                title={track.title}
                                color={track.color}
                                displayMode={track.displayMode}
                                domain={props.domain}
                            />
                        ))}
                    </GraphQLTrackSet>
                )}
                 {props.customFiles &&
                    props.customFiles.map((ufile, i) => {
                        return (
                            <UploadedFile
                                key={ufile.title + '_' + i}
                                file={ufile.file}
                                id={ufile.title + '_' + i}
                                transform="translate(0,0)"
                                width={2000}
                                domain={props.domain}
                            >
                                <CustomTrack
                                    key={`ct${i}`}
                                    width={2000}
                                    height={50}
                                    id={`ct${i}`}
                                    transform="translate(0,0)"
                                    displayMode={ufile.displayMode}
                                    title={ufile.title}
                                    color={'#ff0000'}
                                    domain={props.domain}
                                />
                            </UploadedFile>
                        );
                    })}
                {bamCustomTracks?.map((bt, i) => {
                    return (
                        <BamTrack
                            key={bt.track.url}
                            transform={'translate (0 0)'}
                            id={i + '_bamtrack'}
                            width={2000}
                            track={{
                                bamUrl: bt.track.url,
                                baiUrl: bt.track.baiUrl!!,
                                chr: props.domain.chromosome!!,
                                start: props.domain.start,
                                end: props.domain.end,
                            }}
                            endpoint={'https://ga.staging.wenglab.org'}
                        >
                            {bt.displayMode === 'dense' ? (
                                <WrappedDenseBam
                                    width={2000}
                                    titleSize={12}
                                    trackMargin={12}
                                    title={bt.title}
                                    color={bt.color}
                                    height={50}
                                    domain={{ start: props.domain.start, end: props.domain.end }}
                                    id={i + '_densebam'}
                                />
                            ) : (
                                <WrappedSquishBam
                                    width={2000}
                                    titleSize={12}
                                    trackMargin={12}
                                    title={bt.title}
                                    color={bt.color}
                                    rowHeight={10}
                                    domain={{ start: props.domain.start, end: props.domain.end }}
                                    id={i + '_squishbam'}
                                />
                            )}
                        </BamTrack>
                    );
                })}
            </GenomeBrowser>
        </Container>
    );
};
export default DefaultBrowser;

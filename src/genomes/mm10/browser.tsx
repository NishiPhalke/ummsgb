import { Mm10BrowserProps } from './types';
import React from 'react';
import {
    RulerTrack,
    GraphQLTrackSet,
    WrappedFullBigWig,
    WrappedTrack,
    GraphQLTranscriptTrack,
    WrappedPackTranscriptTrack,
    WrappedSquishBam,
    BamTrack,
    GenomeBrowser,
    WrappedDenseBam,
} from 'umms-gb';
import { dnasetrack, conservationtrack } from './tracks';
import { Domain } from '../types';
import { CustomTrack } from '../../components/customtrack';
import { Container } from 'semantic-ui-react';
import { UploadedFile } from './../../components/uploadedfile';

const tracks = (range: Domain) => [dnasetrack(range), conservationtrack(range)];

const Mm10Browser: React.FC<Mm10BrowserProps> = (props) => {
    let customTracks = props.customTracks?.filter((ct) => !ct.track.baiUrl);
    let bamCustomTracks = props.customTracks?.filter((ct) => ct.track.baiUrl);
    return (
        <Container style={{ width: '90%' }}>
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
                    assembly={'mm10'}
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
                {customTracks &&
                    customTracks.map((track, i) => (
                        <GraphQLTrackSet
                            tracks={[
                                {
                                    ...track.track,
                                    chr1: props.domain.chromosome!,
                                    start: props.domain.start,
                                    end: props.domain.end,
                                },
                            ]}
                            endpoint="https://ga.staging.wenglab.org/graphql"
                            width={2000}
                            transform="translate(0,0)"
                            id={`customtrack,${i}`}
                            key={`ct${i}`}
                        >
                            <CustomTrack
                                width={2000}
                                height={50}
                                id={`ct${i}`}
                                transform="translate(0,0)"
                                displayMode={track.displayMode}
                                title={track.title}
                                color={track.color}
                                domain={props.domain}
                            />
                        </GraphQLTrackSet>
                    ))}
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
export default Mm10Browser;

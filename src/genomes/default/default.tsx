import { DefaultProps } from './types';
import React, { useState } from 'react';
import {
    RulerTrack,
    GraphQLTrackSet,
    WrappedTrack,
    GenomeBrowser,
    WrappedPackTranscriptTrack,
    WrappedSquishTranscriptTrack,
    GraphQLTranscriptTrack,
    WrappedSquishBam,
    BamTrack,
    EmptyTrack,
    WrappedDenseBam,
    StackedTracks,
    WrappedSquishBigBed,
    WrappedDenseBigBed,
} from 'umms-gb';
import { CustomTrack } from '../../components/customtrack';
import { Container, Dropdown } from 'semantic-ui-react';
import { UploadedFile } from './../../components/uploadedfile';
import { customTrack, formatBEDRegion } from './../types';
import { GenomicRange } from 'ts-bedkit';
const BamTrack_Limit = 50000;
const transcriptPack_Limit = 3000000;
const transcript_Limit = 10000000;
const bigbed_Limit = 10000000

const DefaultBrowser: React.FC<DefaultProps> = (props) => {
    let defaultTracksModes: Record<string, string> = {};

    defaultTracksModes['refseqgenes_transcript_track'] = '';
    defaultTracksModes['refseqxeno_transcript_track'] = '';

    let noOfRows = 1;
    const [defaultTracks, setDefaultTracks] = useState<Record<string, string>>(defaultTracksModes);
    const customTracks = props.customTracks && Object.values(props.customTracks).filter((ct) => !ct.track.baiUrl);
    const bamCustomTracks = props.customTracks && Object.values(props.customTracks).filter((ct) => ct.track.baiUrl);

    let pks: Record<
        string,
        { peaks: { chr: string; start: number; end: number }[] | []; title: string; displayMode?: string }
    > = {};
    props.customPeaks &&
        Object.keys(props.customPeaks).forEach((cp) => {
            const c =
                props.customPeaks!![cp].peaks &&
                props
                    .customPeaks!![cp].peaks.findInRange(new GenomicRange(props.domain!!.start, props.domain!!.end))
                    .map(formatBEDRegion(props.domain!!.chromosome!!));
            pks[cp] = {
                ...props.customPeaks!![cp],
                peaks: c && c.length > 0 ? c : [],
            };
        });
    return (
        <Container style={{ width: '90%' }}>
            <GenomeBrowser
                width="100%"
                innerWidth={2000}
                domain={props.domain}
                svgRef={props.svgRef}
                onDomainChanged={props.onDomainChanged}
                onModeChange={(id: string, mode: string) => {
                    if (defaultTracks[id] !== undefined) {
                        let dTracks = { ...defaultTracks };
                        dTracks[id] = mode;
                        setDefaultTracks(dTracks);
                    } else if (props.customFiles && props.customFiles[id]) {
                        let cf: Record<string, { file: File; title: string; displayMode?: string }> = {
                            ...props.customFiles,
                        };

                        cf[id] = {
                            ...cf[id],
                            displayMode: mode,
                        };
                        props.setCustomFiles && props.setCustomFiles(cf);
                    } else if (props.customPeaks && props.customPeaks[id]) {
                        let cf: Record<string, { peaks: any | []; title: string; displayMode?: string }> = {
                            ...props.customPeaks,
                        };
                        cf[id] = {
                            ...cf[id],
                            displayMode: mode,
                        };
                        props.setCustomPeaks && props.setCustomPeaks(cf);
                    } else {
                        let ct: Record<string, customTrack> = { ...props.customTracks };

                        ct[id] = {
                            ...ct[id],
                            displayMode: mode,
                        };
                        props.setCustomTracks && props.setCustomTracks(ct);
                    }
                }}
            >
                <WrappedTrack width={2000} height={70} title="scale" id="ruler" titleSize={12} trackMargin={12}>
                    <RulerTrack width={2000} height={70} domain={props.domain} />
                </WrappedTrack>
                {defaultTracks['refseqgenes_transcript_track'] === 'hide' ? (
                    <WrappedTrack width={2000} height={0} id={'refseqgenes_transcript_track'}>
                        <EmptyTrack
                            width={2000}
                            transform={'translate (0,0)'}
                            height={0}
                            id={'refseqgenes_transcript_track'}
                        />
                    </WrappedTrack>
                ) : props.domain.end - props.domain.start <= transcript_Limit ? (
                    <GraphQLTranscriptTrack
                        domain={props.domain}
                        transform={'translate (0,0)'}
                        assembly={props.assembly}
                        endpoint={'https://ga.staging.wenglab.org/graphql'}
                        id="refseqgenes_transcript_track"
                        queryType={'refseqgenes'}
                    >
                        {defaultTracks['refseqgenes_transcript_track'] === 'pack' ? (
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
                        ) : defaultTracks['refseqgenes_transcript_track'] === '' ? (
                            props.domain.end - props.domain.start < transcriptPack_Limit ? (
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
                            ) : (
                                <WrappedSquishTranscriptTrack
                                    titleSize={12}
                                    trackMargin={12}
                                    title="RefSeq transcripts"
                                    color="#8b0000"
                                    id="refseqgenes_transcript_track"
                                    rowHeight={14}
                                    width={2000}
                                    domain={props.domain}
                                />
                            )
                        ) : (
                            <WrappedSquishTranscriptTrack
                                titleSize={12}
                                trackMargin={12}
                                title="RefSeq transcripts"
                                color="#8b0000"
                                id="refseqgenes_transcript_track"
                                rowHeight={14}
                                width={2000}
                                domain={props.domain}
                            />
                        )}
                    </GraphQLTranscriptTrack>
                ) : (
                    <WrappedTrack
                        id="refseqgenes_transcript_track"
                        width={2000}
                        height={50}
                        title={'RefSeq transcripts'}
                        titleSize={12}
                        trackMargin={12}
                    >
                        <EmptyTrack
                            id={'refseqgenes_transcript_track'}
                            height={50}
                            width={2000}
                            text={'Zoom in to view refseqgenes transcript track'}
                            transform={'translate (0,0)'}
                        />
                    </WrappedTrack>
                )}
                {defaultTracks['refseqxeno_transcript_track'] === 'hide' ? (
                    <WrappedTrack width={2000} height={0} id={'refseqxeno_transcript_track'}>
                        <EmptyTrack
                            width={2000}
                            transform={'translate (0,0)'}
                            height={0}
                            id={'refseqxeno_transcript_track'}
                        />
                    </WrappedTrack>
                ) : props.domain.end - props.domain.start <= transcript_Limit ? (
                    <GraphQLTranscriptTrack
                        domain={props.domain}
                        transform={'translate (0,0)'}
                        assembly={props.assembly}
                        endpoint={'https://ga.staging.wenglab.org/graphql'}
                        id="refseqxeno_transcript_track"
                        queryType={'refseqxenogenes'}
                    >
                        {defaultTracks['refseqxeno_transcript_track'] === 'pack' ? (
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
                        ) : defaultTracks['refseqxeno_transcript_track'] === '' ? (
                            props.domain.end - props.domain.start < transcriptPack_Limit ? (
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
                            ) : (
                                <WrappedSquishTranscriptTrack
                                    titleSize={12}
                                    trackMargin={12}
                                    title="RefSeq transcripts in other species"
                                    color="#8b0000"
                                    id="refseqxeno_transcript_track"
                                    rowHeight={14}
                                    width={2000}
                                    domain={props.domain}
                                />
                            )
                        ) : (
                            <WrappedSquishTranscriptTrack
                                titleSize={12}
                                trackMargin={12}
                                title="RefSeq transcripts in other species"
                                color="#8b0000"
                                id="refseqxeno_transcript_track"
                                rowHeight={14}
                                width={2000}
                                domain={props.domain}
                            />
                        )}
                    </GraphQLTranscriptTrack>
                ) : (
                    <WrappedTrack
                        id="refseqxeno_transcript_track"
                        width={2000}
                        height={50}
                        title={'RefSeq transcripts in other species'}
                        titleSize={12}
                        trackMargin={12}
                    >
                        <EmptyTrack
                            id={'refseqxeno_transcript_track'}
                            height={50}
                            width={2000}
                            text={'Zoom in to view refseqxeno transcript track'}
                            transform={'translate (0,0)'}
                        />
                    </WrappedTrack>
                )}

                {customTracks &&
                    customTracks.map((track, i) => (
                        <GraphQLTrackSet
                            tracks={[
                                {
                                    ...track.track,
                                    chr1: props.domain.chromosome!,
                                    start: props.domain.start,
                                    end: props.domain.end,
                                    zoomLevel: Math.round((props.domain.end - props.domain.start) / 1850),
                                },
                            ]}
                            endpoint="https://ga.staging.wenglab.org/graphql"
                            width={2000}
                            transform="translate(0,0)"
                            id={track.track.url}
                            key={`ct${track.track.url}`}
                        >
                            <CustomTrack
                                width={2000}
                                height={100}
                                id={track.track.url}
                                svgRef={props.svgRef}
                                transform="translate(0,0)"
                                displayMode={track.displayMode}
                                title={track.title}
                                color={track.color}
                                domain={props.domain}
                            />
                        </GraphQLTrackSet>
                    ))}
                {props.customFiles &&
                    Object.values(props.customFiles).map((ufile, i) => {
                        return (
                            <UploadedFile
                                key={ufile.title}
                                file={ufile.file}
                                id={ufile.title}
                                transform="translate(0,0)"
                                width={2000}
                                svgRef={props.svgRef}
                                domain={props.domain}
                            >
                                <CustomTrack
                                    key={ufile.title}
                                    width={2000}
                                    height={100}
                                    id={ufile.title}
                                    transform="translate(0,0)"
                                    displayMode={ufile.displayMode}
                                    title={ufile.title}
                                    color={'#ff0000'}
                                    domain={props.domain}
                                />
                            </UploadedFile>
                        );
                    })}

                {pks &&
                    Object.values(pks).map(
                        (
                            peak: {
                                peaks: { chr: string; start: number; end: number }[] | [];
                                title: string;
                                displayMode?: string;
                            },
                            i: number
                        ) => {
                            return (
                                <StackedTracks
                                    transform={'translate (0,0)'}
                                    key={peak.title + i}
                                    id={peak.title}
                                    height={0}
                                    svgRef={props.svgRef}
                                >
                                    {peak.displayMode === 'squish' ? (
                                        <WrappedSquishBigBed
                                            title={peak.title}
                                            width={2000}
                                            height={50}
                                            rowHeight={10}
                                            transform={'translate (0,0)'}
                                            id={peak.title}
                                            domain={props.domain}
                                            color={'black'}
                                            data={peak.peaks}
                                            titleSize={12}
                                            trackMargin={12}
                                        />
                                    ) : peak.displayMode === 'hide' ? (
                                        <WrappedTrack
                                            {...props}
                                            width={2000}
                                            height={0}
                                            title={undefined}
                                            id={peak.title}
                                        >
                                            <EmptyTrack
                                                width={2000}
                                                transform={'translate (0,0)'}
                                                height={0}
                                                id={peak.title}
                                            />
                                        </WrappedTrack>
                                    ) :  props.domain.end - props.domain.start > bigbed_Limit && !peak.displayMode ? (
                                        <WrappedSquishBigBed
                                            title={peak.title}
                                            width={2000}
                                            height={50}
                                            rowHeight={10}
                                            transform={'translate (0,0)'}
                                            id={peak.title}
                                            domain={props.domain}
                                            color={'#000000'}
                                            data={peak.peaks}
                                            titleSize={12}
                                            trackMargin={12}
                                        />
                                    ): (
                                        <WrappedDenseBigBed
                                            title={peak.title}
                                            width={2000}
                                            height={50}
                                            transform={'translate (0,0)'}
                                            id={peak.title}
                                            domain={props.domain}
                                            color={'black'}
                                            data={peak.peaks}
                                            titleSize={12}
                                            trackMargin={12}
                                        />
                                    )}
                                </StackedTracks>
                            );
                        }
                    )}
                {bamCustomTracks?.map((bt, i) => {
                    return props.domain.end - props.domain.start <= BamTrack_Limit ? (
                        <BamTrack
                            key={bt.track.url}
                            transform={'translate (0 0)'}
                            id={bt.track.url}
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
                                    id={bt.track.url}
                                />
                            ) : bt.displayMode === 'hide' ? (
                                <WrappedTrack width={2000} height={0} id={bt.track.url}>
                                    <EmptyTrack
                                        width={2000}
                                        transform={'translate (0,0)'}
                                        height={0}
                                        id={bt.track.url}
                                    />
                                </WrappedTrack>
                            ) : (
                                <WrappedSquishBam
                                    width={2000}
                                    titleSize={12}
                                    trackMargin={12}
                                    title={bt.title}
                                    color={bt.color}
                                    rowHeight={10}
                                    domain={{ start: props.domain.start, end: props.domain.end }}
                                    id={bt.track.url}
                                />
                            )}
                        </BamTrack>
                    ) : (
                        <WrappedTrack
                            title={bt.title}
                            id={bt.track.url}
                            width={2000}
                            height={50}
                            titleSize={12}
                            trackMargin={12}
                        >
                            <EmptyTrack
                                id={bt.track.url}
                                height={50}
                                width={2000}
                                text={`Zoom in to view ${bt.title} track`}
                                transform={'translate (0,0)'}
                            />
                        </WrappedTrack>
                    );
                })}
            </GenomeBrowser>
            <h4>{props.assembly} Default Tracks</h4>
            {Array.from(Array(noOfRows).keys()).map((k) => {
                return (
                    <React.Fragment key={k}>
                        {Object.keys(defaultTracks)
                            .slice(
                                k * 5,
                                k * 5 + 5 > Object.keys(defaultTracks).length
                                    ? Object.keys(defaultTracks).length
                                    : k * 5 + 5
                            )
                            .map((t) => {
                                return (
                                    <React.Fragment key={t}>
                                        <strong>{t}</strong> &nbsp; &nbsp;
                                        <Dropdown
                                            placeholder="Select Display Mode"
                                            selection
                                            value={
                                                (t === 'refseqgenes_transcript_track' ||
                                                    t === 'refseqxeno_transcript_track') &&
                                                defaultTracks[t] === ''
                                                    ? props.domain.end - props.domain.start < transcriptPack_Limit
                                                        ? 'pack'
                                                        : 'squish'
                                                    : defaultTracks[t]
                                            }
                                            onChange={(_, data) => {
                                                if (defaultTracks[t] !== undefined) {
                                                    let dTracks = { ...defaultTracks };
                                                    dTracks[t] = data.value as string;
                                                    setDefaultTracks(dTracks);
                                                }
                                            }}
                                            options={[
                                                { text: 'pack', value: 'pack' },
                                                { text: 'squish', value: 'squish' },
                                                { text: 'hide', value: 'hide' },
                                            ]}
                                        />{' '}
                                        &nbsp; &nbsp; &nbsp; &nbsp;
                                    </React.Fragment>
                                );
                            })}
                        <br />
                        <br />
                    </React.Fragment>
                );
            })}
        </Container>
    );
};
export default DefaultBrowser;

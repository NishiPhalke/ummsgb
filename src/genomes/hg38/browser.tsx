import { Hg38BrowserProps } from './types';
import React, { useState } from 'react';
import { customTrack } from '../types';
import { GenomicRange } from 'ts-bedkit';
import {
    RulerTrack,
    GraphQLTrackSet,
    WrappedFullBigWig,
    WrappedTrack,
    GraphQLTranscriptTrack,
    EmptyTrack,
    WrappedDenseBigWig,
    WrappedPackTranscriptTrack,
    WrappedSquishTranscriptTrack,
    GenomeBrowser,
    WrappedDenseBam,
    WrappedSquishBam,
    GraphQLLDTrack,
    WrappedLDTrack,
    BamTrack,
    WrappedDenseBigBed,
    StackedTracks,
    WrappedSquishBigBed,
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
import { CustomTrack } from '../../components/customtrack';
import { Container, Dropdown } from 'semantic-ui-react';
import { Domain } from '../types';
import { UploadedFile } from './../../components/uploadedfile';
import { getTrackDisplayModes, getTrackType } from '../page/utils';
import { formatBEDRegion } from './../types';

const tracks = (range: Domain) => [
    dnasetrack(range),
    h3k4me3track(range),
    h3k27actrack(range),
    ctcftrack(range),
    conservationtrack(range),
    rampageplus(range),
    rampageminus(range),
];

const ldTrack_Limit = 5000000;
const BamTrack_Limit = 50000;
const transcriptPack_Limit = 3000000;
const transcript_Limit = 10000000;
const bigbed_Limit = 10000000;

const Hg38Browser: React.FC<Hg38BrowserProps> = (props) => {
    let defaultTracksModes: Record<string, string> = {};
    tracks(props.domain).forEach((t) => {
        let trackType = getTrackType(t.url);
        defaultTracksModes[t.id] = trackType === 'BIGBED' ? 'dense' : trackType === 'BIGWIG' ? 'full' : 'dense';
    });
    defaultTracksModes['transcript'] = '';
    defaultTracksModes['ASN_LdTrack'] = 'dense';
    defaultTracksModes['AFR_LdTrack'] = 'dense';
    defaultTracksModes['EUR_LdTrack'] = 'dense';
    defaultTracksModes['AMR_LdTrack'] = 'dense';

    let noOfRows = +(+Math.round((tracks(props.domain).length + 5) / 5)).toFixed() + 1;
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
                onDomainChanged={props.onDomainChanged}
                svgRef={props.svgRef}
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
                <WrappedTrack width={2000} height={60} title="scale" id="ruler" titleSize={12} trackMargin={12}>
                    <RulerTrack width={2000} height={60} domain={props.domain} />
                </WrappedTrack>
                {defaultTracks['transcript'] === 'hide' ? (
                    <WrappedTrack width={2000} height={0} id={'transcript'}>
                        <EmptyTrack width={2000} transform={'translate (0,0)'} height={0} id={'transcript'} />
                    </WrappedTrack>
                ) : props.domain.end - props.domain.start < transcript_Limit ? (
                    <GraphQLTranscriptTrack
                        domain={props.domain}
                        transform={'translate (0,0)'}
                        assembly={'GRCh38'}
                        endpoint={'https://ga.staging.wenglab.org/graphql'}
                        id="transcript"
                    >
                        {defaultTracks['transcript'] === 'pack' ? (
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
                        ) : defaultTracks['transcript'] === '' ? (
                            props.domain.end - props.domain.start < transcriptPack_Limit ? (
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
                            ) : (
                                <WrappedSquishTranscriptTrack
                                    titleSize={12}
                                    trackMargin={12}
                                    title={'GENCODE v29 transcripts'}
                                    color="#8b0000"
                                    id="transcript"
                                    rowHeight={14}
                                    width={2000}
                                    domain={props.domain}
                                />
                            )
                        ) : (
                            <WrappedSquishTranscriptTrack
                                titleSize={12}
                                trackMargin={12}
                                title={'GENCODE v29 transcripts'}
                                color="#8b0000"
                                id="transcript"
                                rowHeight={14}
                                width={2000}
                                domain={props.domain}
                            />
                        )}
                    </GraphQLTranscriptTrack>
                ) : (
                    <WrappedTrack
                        id="emptytrack"
                        width={2000}
                        height={50}
                        title={'GENCODE v29 transcripts'}
                        titleSize={12}
                        trackMargin={12}
                    >
                        <EmptyTrack
                            id={'transcript'}
                            height={50}
                            width={2000}
                            text={'Zoom in to view transcript track'}
                            transform={'translate (0,0)'}
                        />
                    </WrappedTrack>
                )}
                {tracks(props.domain).map((t) => (
                    <GraphQLTrackSet
                        tracks={[
                            {
                                chr1: t.chr1,
                                url: t.url,
                                start: t.start,
                                end: t.end,
                                preRenderedWidth: t.preRenderedWidth,
                                zoomLevel: t.zoomLevel,
                            },
                        ]}
                        transform={'translate (0,0)'}
                        id={t.id}
                        key={t.id}
                        width={2000}
                        endpoint={'https://ga.staging.wenglab.org/graphql'}
                    >
                        {defaultTracks[t.id] === 'dense' ? (
                            <WrappedDenseBigWig
                                title={t.title}
                                width={2000}
                                height={80}
                                id={t.id}
                                color={t.color}
                                domain={props.domain}
                                titleSize={12}
                                trackMargin={12}
                            />
                        ) : defaultTracks[t.id] === 'hide' ? (
                            <WrappedTrack width={2000} height={0} id={t.id}>
                                <EmptyTrack width={2000} transform={'translate (0,0)'} height={0} id={t.id} />
                            </WrappedTrack>
                        ) : (
                            <WrappedFullBigWig
                                title={t.title}
                                width={2000}
                                height={80}
                                id={t.id}
                                color={t.color}
                                domain={props.domain}
                                titleSize={12}
                                trackMargin={12}
                            />
                        )}
                    </GraphQLTrackSet>
                ))}
                {props.domain.end - props.domain.start <= ldTrack_Limit ? (
                    <GraphQLLDTrack
                        domain={props.domain}
                        width={2000}
                        transform={'translate (0,0)'}
                        id={'hg38_ldtrack'}
                        population={['EUR', 'AMR', 'ASN', 'AFR']}
                        anchor={props.anchor}
                        assembly={'hg38'}
                        endpoint={'https://snps.staging.wenglab.org/graphql'}
                    >
                        {defaultTracks['EUR_LdTrack'] === 'hide' ? (
                            <WrappedTrack width={2000} height={0} id={'EUR_LdTrack'}>
                                <EmptyTrack width={2000} transform={'translate (0,0)'} height={0} id={'EUR_LdTrack'} />
                            </WrappedTrack>
                        ) : (
                            <WrappedLDTrack
                                titleSize={12}
                                trackMargin={12}
                                height={100}
                                domain={props.domain}
                                width={2000}
                                id={'EUR_LdTrack'}
                                title={'common EUROPEAN SNPs with LD'}
                                onVariantClick={(snp: { rsId: string }) => {
                                    props.setAnchor && props.setAnchor(snp.rsId);
                                }}
                            />
                        )}
                        {defaultTracks['AMR_LdTrack'] === 'hide' ? (
                            <WrappedTrack width={2000} height={0} id={'AMR_LdTrack'}>
                                <EmptyTrack width={2000} transform={'translate (0,0)'} height={0} id={'AMR_LdTrack'} />
                            </WrappedTrack>
                        ) : (
                            <WrappedLDTrack
                                titleSize={12}
                                trackMargin={12}
                                height={100}
                                domain={props.domain}
                                width={2000}
                                id={'AMR_LdTrack'}
                                title={'common AMERICAN SNPs with LD'}
                                onVariantClick={(snp: { rsId: string }) => {
                                    props.setAnchor && props.setAnchor(snp.rsId);
                                }}
                            />
                        )}
                        {defaultTracks['ASN_LdTrack'] === 'hide' ? (
                            <WrappedTrack width={2000} height={0} id={'ASN_LdTrack'}>
                                <EmptyTrack width={2000} transform={'translate (0,0)'} height={0} id={'ASN_LdTrack'} />
                            </WrappedTrack>
                        ) : (
                            <WrappedLDTrack
                                height={100}
                                titleSize={12}
                                trackMargin={12}
                                domain={props.domain}
                                width={2000}
                                id={'ASN_LdTrack'}
                                title={'common ASIAN SNPs with LD'}
                                onVariantClick={(snp: { rsId: string }) => {
                                    props.setAnchor && props.setAnchor(snp.rsId);
                                }}
                            />
                        )}
                        {defaultTracks['AFR_LdTrack'] === 'hide' ? (
                            <WrappedTrack width={2000} height={0} id={'AFR_LdTrack'}>
                                <EmptyTrack width={2000} transform={'translate (0,0)'} height={0} id={'AFR_LdTrack'} />
                            </WrappedTrack>
                        ) : (
                            <WrappedLDTrack
                                height={100}
                                titleSize={12}
                                trackMargin={12}
                                domain={props.domain}
                                width={2000}
                                id={'AFR_LdTrack'}
                                title={'common AFRICAN SNPs with LD'}
                                onVariantClick={(snp: { rsId: string }) => {
                                    props.setAnchor && props.setAnchor(snp.rsId);
                                }}
                            />
                        )}
                    </GraphQLLDTrack>
                ) : (
                    <WrappedTrack id="EUR_LdTrack" width={2000} height={50}>
                        <EmptyTrack
                            id="EUR_LdTrack"
                            height={50}
                            width={2000}
                            text={'Zoom in to view LdTracks'}
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
                                key={ufile.title + i}
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
                                    color={'#000000'}
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
                                    ) : props.domain.end - props.domain.start > bigbed_Limit && !peak.displayMode ? (
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
                                    ) : (
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
            <h4>Hg38 Default Tracks</h4>
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
                                                t === 'transcript' && defaultTracks[t] === ''
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
                                            options={
                                                t === 'transcript'
                                                    ? [
                                                          { text: 'pack', value: 'pack' },
                                                          { text: 'squish', value: 'squish' },
                                                          { text: 'hide', value: 'hide' },
                                                      ]
                                                    : t.includes('LdTrack')
                                                    ? [
                                                          { text: 'dense', value: 'dense' },
                                                          { text: 'hide', value: 'hide' },
                                                      ]
                                                    : getTrackDisplayModes(
                                                          tracks(props.domain).find((t1) => t1.id === t)?.url!!
                                                      )
                                            }
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
export default Hg38Browser;

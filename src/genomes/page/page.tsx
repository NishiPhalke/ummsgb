import { GenomeBrowserPageProps, AssemblyInfo } from './types';
import { customTrack, Domain } from '../types';
import { genomeConfig } from '../genomes';
import React, { useState, useEffect, useRef } from 'react';
import GenomePageMenu from './menu';
import { ASSEMBLY_INFO_QUERY, CHROM_LENGTHS_QUERY, SINGLE_TRANSCRIPT_QUERY } from './queries';
import { SearchBox } from '../../components/search';
import { Cytobands } from '../../components/cytobands';
import { UCSCControls } from 'umms-gb';
import { Container, Dimmer, Loader, Button } from 'semantic-ui-react';
import { AddTrackModal } from '../../components/customtrack';
import { downloadSVG } from './utils';
import SessionModal from './sessionmodal';
import MetadataModal from './metadatamodal';
import MemoDefaultBrowser from './../default/default';
import { RefSeqSearchBox } from './../../components/search';
import TrackConfigs from './trackconfigs';

const parseDomain = (domain: string) => ({
    chromosome: domain.split(':')[0],
    start: +domain.split(':')[1].split('-')[0].replace(/,/g, ''),
    end: +domain.split('-')[1].replace(/,/g, ''),
});

const GenomeBrowserPage: React.FC<GenomeBrowserPageProps> = (props) => {
    const uploadTrackList = React.useRef<HTMLInputElement>(null);
    const uploadTrackFile = React.useRef<HTMLInputElement>(null);

    const [domain, setDomain] = useState<Domain | undefined>(props.session && props.session.domain);
    const [assemblyInfo, setAssemblyInfoData] = useState<AssemblyInfo | null>(null);
    const [chromLength, setChromLength] = useState<number>(0);
    const [addTrackModalShown, setAddTrackModalShown] = useState<boolean>(false);
    const [saveSessionModalShown, setSaveSessionModalShown] = useState<boolean>(false);
    const [metadataModalShown, setMetadataModalShown] = useState<boolean>(false);
    const [sessionData, setSessionData] = useState<string>();
    const [customFiles, setCustomFiles] = useState<
        Record<string, { file: File; title: string; displayMode?: string }>
    >();
    const [transcriptCoordinates, setTranscriptCoordinates] = useState<{
        coordinates: { chromosome: string; start: number; end: number };
    }>();

    const [customTracks, setCustomTracks] = useState<undefined | Record<string, customTrack>>(
        props.session && props.session.customTracks
    );

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch('http://35.201.115.1/graphql', {
                method: 'POST',
                body: JSON.stringify({
                    query: ASSEMBLY_INFO_QUERY,
                    variables: { name: props.assembly },
                }),
                headers: { 'Content-Type': 'application/json' },
            });
            setAssemblyInfoData((await response.json()).data?.genomicAssemblies[0] || null);
        };
        fetchData();
    }, [props.assembly]);
    useEffect(() => {
        const getSingleTranscriptCoordinates = async () => {
            const response = await fetch('http://35.201.115.1/graphql', {
                method: 'POST',
                body: JSON.stringify({
                    query: SINGLE_TRANSCRIPT_QUERY,
                    variables: { assembly: props.assembly, limit: 1 },
                }),
                headers: { 'Content-Type': 'application/json' },
            });
            let data = (await response.json()).data;
            let genes = data?.refseqgenes && data?.refseqgenes.length ? data?.refseqgenes : data?.refseqxenogenes;
            if (!genes || !genes.length || !genes[0].transcripts || !genes[0].transcripts) {
                setTranscriptCoordinates(undefined);
            }
            setTranscriptCoordinates(genes[0].transcripts[0]);
        };
        if (!genomeConfig[props.assembly]) {
            getSingleTranscriptCoordinates();
        }
    }, [props.assembly]);
    useEffect(() => {
        if ((!genomeConfig[props.assembly] || !genomeConfig[props.assembly].domain) && chromLength) {
            if (transcriptCoordinates) {
                let genelength = transcriptCoordinates.coordinates.end - transcriptCoordinates.coordinates.start;
                setDomain({
                    chromosome: transcriptCoordinates.coordinates.chromosome,
                    start:
                        Math.floor(transcriptCoordinates.coordinates.start - genelength / 2) < 0
                            ? 0
                            : Math.floor(transcriptCoordinates.coordinates.start - genelength / 2),
                    end:
                        Math.ceil(transcriptCoordinates.coordinates.end + genelength / 2) > chromLength
                            ? chromLength
                            : Math.ceil(transcriptCoordinates.coordinates.end + genelength / 2),
                });
            }
        }
    }, [transcriptCoordinates, chromLength, props.assembly]);
    const chromosome = domain?.chromosome;

    useEffect(() => {
        const fetchChromLength = async (chrom: string) => {
            const response = await fetch('http://35.201.115.1/graphql', {
                method: 'POST',
                body: JSON.stringify({
                    query: CHROM_LENGTHS_QUERY,
                    variables: { assembly: props.assembly, chromosome: chrom },
                }),
                headers: { 'Content-Type': 'application/json' },
            });
            let chrLength = (await response.json()).data?.chromlengths[0]?.length || 0;
            setChromLength(chrLength);
        };
        let d =
            chromosome ||
            (genomeConfig[props.assembly]
                ? genomeConfig[props.assembly].domain.chromosome
                : transcriptCoordinates && transcriptCoordinates.coordinates.chromosome);
        if (d) fetchChromLength(d);
    }, [props.assembly, transcriptCoordinates, props.session, chromosome]);
    useEffect(() => {
        let d: Domain | undefined =
            (props.session && props.session.domain) ||
            (genomeConfig[props.assembly]
                ? genomeConfig[props.assembly].domain
                : transcriptCoordinates && {
                      chromosome: transcriptCoordinates.coordinates.chromosome,
                      start: transcriptCoordinates.coordinates.start,
                      end: transcriptCoordinates.coordinates.end,
                  });
        d &&
            setDomain({
                chromosome: d.chromosome,
                start: d.start,
                end: d.end,
            });
    }, [props.assembly, transcriptCoordinates, props.session]);
    const saveSession = () => {
        const sessionDetails = JSON.stringify({
            customTracks: customTracks,
            domain: domain,
        });
        const location = window.location.protocol + '//' + window.location.host + window.location.pathname;
        setSessionData(location + '?session=' + encodeURIComponent(Buffer.from(sessionDetails).toString('base64')));
        setSaveSessionModalShown(true);
    };

    const onDomainChanged = React.useCallback(
        (d: Domain) => {
            if (d.chromosome && d.chromosome !== domain!!.chromosome) {
                setDomain({
                    chromosome: d.chromosome,
                    start: d.start < 0 ? 0 : d.start,
                    end: d.end > chromLength ? chromLength : d.end,
                });
            } else {
                setDomain({
                    chromosome: domain!!.chromosome,
                    start: d.start < 0 ? 0 : d.start,
                    end: d.end > chromLength ? chromLength : d.end,
                });
            }
        },
        [domain, chromLength]
    );
    const onModalAccept = React.useCallback(
        (
            modalState:
                | { title: string; url: string; baiUrl?: string; displayMode?: string; color: string; domain: Domain }[]
                | undefined
        ) => {
            let tracks: customTrack[] | undefined =
                modalState &&
                modalState.map(
                    (m: {
                        title: string;
                        url: string;
                        baiUrl?: string;
                        displayMode?: string;
                        color: string;
                        domain: Domain;
                    }) => {
                        return {
                            title: m.title,
                            color: m.color,
                            displayMode: m.displayMode,
                            track: {
                                start: m.domain.start,
                                end: m.domain.end,
                                chr1: m.domain.chromosome!!,
                                url: m.url,
                                baiUrl: m.baiUrl,
                                preRenderedWidth: 1850,
                            },
                        };
                    }
                );
            setCustomTracks((customTracks) => {
                let ct: Record<string, customTrack> = {};
                if (customTracks !== undefined) {
                    ct = { ...customTracks };
                    tracks?.forEach((t) => {
                        ct[t.track.url] = t;
                    });
                } else {
                    tracks?.forEach((t) => {
                        ct[t.track.url] = t;
                    });
                }
                return !tracks && !customTracks ? undefined : ct;
            });
            setAddTrackModalShown(false);
        },
        []
    );
    const trackListReceived = (e: React.ChangeEvent<HTMLInputElement>) => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
            const tracks: customTrack[] = JSON.parse(e.target.result);
            setCustomTracks((customTracks) => {
                let ct: Record<string, customTrack> = {};
                if (customTracks !== undefined) {
                    ct = { ...customTracks };
                    tracks?.forEach((t) => {
                        ct[t.track.url] = t;
                    });
                } else {
                    tracks?.forEach((t) => {
                        ct[t.track.url] = t;
                    });
                }
                return !tracks && !customTracks ? undefined : ct;
            });
        };
        e.target.files && reader.readAsText(e.target.files[0]);
    };

    const trackFileReceived = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const fileList = Array.from(e.target.files!!);
            let cFiles: Record<string, { file: File; title: string; displayMode?: string }> = {};
            const title: string = fileList[0].name;
            if (customFiles !== undefined) {
                cFiles = { ...customFiles };
                cFiles[title] = { file: fileList[0], title };
            } else {
                cFiles[title] = { file: fileList[0], title };
            }
            setCustomFiles(cFiles);
        }
    };

    const svg = useRef<SVGSVGElement>(null);
    const download = downloadSVG(svg, 'tracks.svg');

    if (!assemblyInfo || !domain || !domain.end || !chromLength)
        return (
            <>
                <GenomePageMenu />
                <Container>
                    <Dimmer active>
                        <Loader>Loading...</Loader>
                    </Dimmer>
                </Container>
            </>
        );
    const BrowserComponent =
        (genomeConfig[props.assembly] && genomeConfig[props.assembly].browser) || MemoDefaultBrowser;
    let SearchBoxComponent = genomeConfig[props.assembly] ? SearchBox : RefSeqSearchBox;
    return (
        <>
            <GenomePageMenu />
            <div style={{ width: '100%' }} className="App">
                <br />
                <h1>
                    UMMS Genome Browser {assemblyInfo?.species} {assemblyInfo?.description}
                </h1>
                <>
                    <UCSCControls onDomainChanged={onDomainChanged} domain={domain} withInput={false} />
                    <br />
                    <div style={{ width: '75%', margin: '0 auto' }}>
                        <SearchBoxComponent
                            onSearchSubmit={(domain: string) => onDomainChanged(parseDomain(domain))}
                            assembly={props.assembly === 'hg38' ? 'GRCh38' : props.assembly}
                        />
                    </div>
                    <br />
                    <div>
                        <span style={{ verticalAlign: 'top', fontWeight: 'bold' }}>
                            {domain.chromosome}:{Number(domain.start).toLocaleString()}-
                            {Number(domain.end).toLocaleString()}&nbsp;&nbsp;
                        </span>
                        {chromLength !== 0 && (
                            <svg width="75%" viewBox="0 0 2000 30">
                                <Cytobands
                                    assembly={props.assembly}
                                    chromosome={domain.chromosome!!}
                                    width={2000}
                                    height={30}
                                    highlight={{ ...domain, color: '#0000ff' }}
                                    id="cytobands"
                                    domain={{ start: 0, end: chromLength }}
                                />
                            </svg>
                        )}
                    </div>
                    <BrowserComponent
                        domain={domain}
                        assembly={props.assembly}
                        onDomainChanged={onDomainChanged}
                        customTracks={
                            customTracks
                                ? Object.values(customTracks).filter((ct) => ct.displayMode !== 'hide')
                                : undefined
                        }
                        svgRef={svg}
                        customFiles={
                            customFiles
                                ? Object.values(customFiles).filter((cf) => cf.displayMode !== 'hide')
                                : undefined
                        }
                    />
                    <br />
                    <AddTrackModal
                        onOpen={() => setAddTrackModalShown(true)}
                        onAccept={onModalAccept}
                        onClose={() => setAddTrackModalShown(false)}
                        open={addTrackModalShown}
                        endpoint={'https://ga.staging.wenglab.org/graphql'}
                        domain={domain}
                    />
                    &nbsp;
                    {(props.assembly === 'hg38' || props.assembly === 'hg19' || props.assembly === 'mm10') && (
                        <MetadataModal
                            open={metadataModalShown}
                            onOpen={() => setMetadataModalShown(true)}
                            onAccept={onModalAccept}
                            onClose={() => setMetadataModalShown(false)}
                            assembly={props.assembly === 'hg38' ? 'GRCh38' : props.assembly}
                            domain={domain}
                        />
                    )}
                    &nbsp;
                    <Button onClick={download}>{'Download'} </Button>
                    <Button onClick={saveSession}>{'Save Session'} </Button>
                    <Button
                        onClick={() => uploadTrackList && uploadTrackList.current && uploadTrackList.current!!.click()}
                    >
                        Upload Track List
                    </Button>
                    <input name={'file'} type={'file'} ref={uploadTrackList} hidden onChange={trackListReceived} />
                    <Button
                        onClick={() => uploadTrackFile && uploadTrackFile.current && uploadTrackFile.current!!.click()}
                    >
                        Upload Track File
                    </Button>
                    <input
                        name={'file'}
                        type={'file'}
                        ref={uploadTrackFile}
                        hidden
                        onChange={trackFileReceived}
                        multiple
                    />
                    <div style={{ height: '40px' }} />
                    <SessionModal
                        open={saveSessionModalShown}
                        data={sessionData!!}
                        onClose={() => setSaveSessionModalShown(false)}
                        warn={customFiles && Object.values(customFiles).length}
                    />
                    <br />
                    <TrackConfigs
                        files={customFiles}
                        tracks={customTracks ? Object.values(customTracks) : undefined}
                        onSelect={onModalAccept}
                        onFileSelect={(title: string, displayMode: string) => {
                            if (customFiles) {
                                let cFiles = { ...customFiles };
                                cFiles[title] = { ...cFiles[title], displayMode };
                                setCustomFiles(cFiles);
                            }
                        }}
                    />
                </>
            </div>
        </>
    );
};

export default GenomeBrowserPage;

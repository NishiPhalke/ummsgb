import { GenomeBrowserPageProps, AssemblyInfo, customTrack, Domain } from './types';
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
import DefaultBrowser from './../default/default';
import { RefSeqSearchBox } from './../../components/search';

const parseDomain = (domain: string) => ({
    chromosome: domain.split(':')[0],
    start: +domain.split(':')[1].split('-')[0].replace(/,/g, ''),
    end: +domain.split('-')[1].replace(/,/g, ''),
});

const GenomeBrowserPage: React.FC<GenomeBrowserPageProps> = (props) => {
    const uploadTrackList = React.useRef<HTMLInputElement>(null);
    const [domain, setDomain] = useState<Domain | undefined>(props.session && props.session.domain);
    const [assemblyInfo, setAssemblyInfoData] = useState<AssemblyInfo | null>(null);
    const [chromLength, setChromLength] = useState<number>(0);
    const [addTrackModalShown, setAddTrackModalShown] = useState<boolean>(false);
    const [saveSessionModalShown, setSaveSessionModalShown] = useState<boolean>(false);
    const [metadataModalShown, setMetadataModalShown] = useState<boolean>(false);
    const [sessionData, setSessionData] = useState<string>();
    const [transcriptCoordinates, setTranscriptCoordinates] = useState<{
        coordinates: { chromosome: string; start: number; end: number };
    }>();

    const [customTracks, setCustomTracks] = useState<undefined | customTrack[]>(
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

    useEffect(() => {
        const fetchChromLength = async (d: Domain) => {
            const response = await fetch('http://35.201.115.1/graphql', {
                method: 'POST',
                body: JSON.stringify({
                    query: CHROM_LENGTHS_QUERY,
                    variables: { assembly: props.assembly, chromosome: d!!.chromosome },
                }),
                headers: { 'Content-Type': 'application/json' },
            });
            let chrLength = (await response.json()).data?.chromlengths[0]?.length || 0;
            setChromLength(chrLength);

            setDomain({
                chromosome: d.chromosome,
                start: d.start < 0 ? 0 : d.start,
                end: d.end > chrLength ? chrLength : d.end,
            });
        };
        let d =
            (props.session && props.session.domain) ||
            (genomeConfig[props.assembly]
                ? genomeConfig[props.assembly].domain
                : transcriptCoordinates && {
                      chromosome: transcriptCoordinates.coordinates.chromosome,
                      start: transcriptCoordinates.coordinates.start,
                      end: transcriptCoordinates.coordinates.end,
                  });
        if (d) fetchChromLength(d);
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
                setDomain({ chromosome: domain!!.chromosome, ...d });
            }
        },
        [domain, chromLength]
    );
    const onModalAccept = (
        modalState: { title: string; url: string; baiUrl?: string; color: string; domain: Domain }[] | undefined
    ) => {
        let tracks =
            modalState &&
            modalState.map((m: { title: string; url: string; baiUrl?: string; color: string; domain: Domain }) => {
                return {
                    title: m.title,
                    color: m.color,
                    track: {
                        start: m.domain.start,
                        end: m.domain.end,
                        chr1: m.domain.chromosome!!,
                        url: m.url,
                        baiUrl: m.baiUrl,
                        preRenderedWidth: 1850,
                    },
                };
            });

        let cTracks =
            customTracks !== undefined
                ? tracks
                    ? [
                          ...customTracks!!,
                          ...tracks!!.filter(
                              (t) => customTracks!!.find((ct) => ct.track.url === t.track.url) === undefined
                          ),
                      ]
                    : customTracks
                : tracks
                ? tracks
                : undefined;

        setCustomTracks(cTracks);

        setAddTrackModalShown(false);
    };
    const trackListReceived = (e: React.ChangeEvent<HTMLInputElement>) => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
            const tracks: customTrack[] = JSON.parse(e.target.result);
            setCustomTracks(customTracks ? [...customTracks, ...tracks] : [...tracks]);
        };
        e.target.files && reader.readAsText(e.target.files[0]);
    };

    const svg = useRef<SVGSVGElement>(null);
    const download = downloadSVG(svg, 'tracks.svg');

    if (!assemblyInfo || !domain || !chromLength)
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
    const BrowserComponent = (genomeConfig[props.assembly] && genomeConfig[props.assembly].browser) || DefaultBrowser;
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
                        customTracks={customTracks}
                        svgRef={svg}
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
                    <div style={{ height: '40px' }} />
                    <SessionModal
                        open={saveSessionModalShown}
                        data={sessionData!!}
                        onClose={() => setSaveSessionModalShown(false)}
                        warn={0}
                    />
                </>
            </div>
        </>
    );
};

export default GenomeBrowserPage;

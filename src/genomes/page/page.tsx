import { GenomeBrowserPageProps, AssemblyInfo, customTrack } from './types';
import { genomeConfig } from '../genomes';
import React, { useState, useEffect, useRef } from 'react';
import GenomePageMenu from './menu';
import { ASSEMBLY_INFO_QUERY, CHROM_LENGTHS_QUERY } from './queries';
import { Domain } from './../hg38/types';
import { SearchBox } from '../../components/search';
import { Cytobands } from '../../components/cytobands';
import { UCSCControls } from 'umms-gb';
import { Container, Dimmer, Loader, Button } from 'semantic-ui-react';
import { AddTrackModal } from '../../components/customtrack';
import { downloadSVG } from './utils';
import SessionModal from './sessionmodal';

const parseDomain = (domain: string) => ({
    chromosome: domain.split(':')[0],
    start: +domain.split(':')[1].split('-')[0].replace(/,/g, ''),
    end: +domain.split('-')[1].replace(/,/g, ''),
});

const GenomeBrowserPage: React.FC<GenomeBrowserPageProps> = (props) => {
    const uploadFile = React.useRef<HTMLInputElement>(null);
    const [domain, setDomain] = useState<Domain>(
        (props.session && props.session.domain) || { chromosome: 'chr12', start: 53379291, end: 53416942 }
    );
    const [assemblyInfo, setAssemblyInfoData] = useState<AssemblyInfo | null>(null);
    const [chromLength, setChromLength] = useState<number>(0);
    const [addTrackModalShown, setAddTrackModalShown] = useState<boolean>(false);
    const [saveSessionModalShown, setSaveSessionModalShown] = useState<boolean>(false);
    const [sessionData, setSessionData] = useState<string>();

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
        const fetchChromLength = async () => {
            const response = await fetch('http://35.201.115.1/graphql', {
                method: 'POST',
                body: JSON.stringify({
                    query: CHROM_LENGTHS_QUERY,
                    variables: { assembly: props.assembly, chromosome: domain.chromosome },
                }),
                headers: { 'Content-Type': 'application/json' },
            });
            setChromLength((await response.json()).data?.chromlengths[0].length || null);
        };
        fetchChromLength();
    }, [props.assembly, domain]);

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
            if (d.chromosome && d.chromosome !== domain.chromosome) {
                setDomain({
                    chromosome: d.chromosome,
                    start: d.start < 0 ? 0 : d.start,
                    end: d.end > chromLength ? chromLength : d.end,
                });
            } else {
                setDomain({ chromosome: domain.chromosome, ...d });
            }
        },
        [domain.chromosome, chromLength]
    );
    const onModalAccept = (modalstate: { title: string; url: string; color: string; domain: Domain } | null) => {
        let tracks =
            modalstate === null
                ? customTracks
                : customTracks !== undefined
                ? [
                      ...customTracks!!,
                      {
                          title: modalstate.title,
                          color: modalstate.color,
                          track: {
                              start: modalstate.domain.start,
                              end: modalstate.domain.end,
                              chr1: modalstate.domain.chromosome!!,
                              url: modalstate.url,
                              preRenderedWidth: 1850,
                          },
                      },
                  ]
                : [
                      {
                          title: modalstate.title,
                          color: modalstate.color,
                          track: {
                              start: modalstate.domain.start,
                              end: modalstate.domain.end,
                              chr1: modalstate.domain.chromosome!!,
                              url: modalstate.url,
                              preRenderedWidth: 1850,
                          },
                      },
                  ];
        setCustomTracks(tracks);

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
    if (props.assembly !== 'hg38' && props.assembly !== 'hg19' && props.assembly !== 'mm10')
        return <>{'Page under Construction'}</>;
    if (!assemblyInfo || !domain || !chromLength)
        return (
            <React.Fragment>
                <GenomePageMenu />
                <Container>
                    <Dimmer active>
                        <Loader>Loading...</Loader>
                    </Dimmer>
                </Container>
            </React.Fragment>
        );
    const BrowserComponent = genomeConfig[props.assembly].browser;
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
                        <SearchBox
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
                    <AddTrackModal
                        onOpen={() => setAddTrackModalShown(true)}
                        onAccept={onModalAccept}
                        open={addTrackModalShown}
                        endpoint={'https://ga.staging.wenglab.org/graphql'}
                        domain={domain}
                    />
                    &nbsp;
                    <Button onClick={download}>{'Download'} </Button>
                    <Button onClick={saveSession}>{'Save Session'} </Button>
                    <Button onClick={() => uploadFile && uploadFile.current && uploadFile.current!!.click()}>
                        Upload Track List
                    </Button>
                    <input name={'file'} type={'file'} ref={uploadFile} hidden onChange={trackListReceived} />
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

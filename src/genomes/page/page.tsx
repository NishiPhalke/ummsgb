import { GenomeBrowserPageProps, AssemblyInfo } from './types';
import React, { useState, useEffect } from 'react';
import { Hg38Browser } from '../hg38';
import GenomePageMenu from './menu';
import { ASSEMBLY_INFO_QUERY, CHROM_LENGTHS_QUERY } from './queries';
import { Domain } from './../hg38/types';
import { SearchBox } from '../../components/search';
import { Cytobands } from '../../components/cytobands';
import { UCSCControls } from 'umms-gb';
import { Container, Dimmer, Loader } from 'semantic-ui-react';
import { AddTrackModal } from '../../components/customtrack';
const parseDomain = (domain: string) => ({
    chromosome: domain.split(':')[0],
    start: +domain.split(':')[1].split('-')[0].replace(/,/g, ''),
    end: +domain.split('-')[1].replace(/,/g, ''),
});

const GenomeBrowserPage: React.FC<GenomeBrowserPageProps> = (props) => {
    const [domain, setDomain] = useState<Domain>({ chromosome: 'chr12', start: 53379291, end: 53416942 });
    const [assemblyInfo, setAssemblyInfoData] = useState<AssemblyInfo | null>(null);
    const [chromLength, setChromLength] = useState<number>(0);
    const [modalShown, setModalShown] = useState<boolean>(false);
    const [customTracks, setCustomTracks] = useState<
        | null
        | {
              title: string;
              color: string;
              track: { start: number; end: number; chr1: string; url: string; preRenderedWidth: number };
          }[]
    >([
        {
            title: 'testtitle',
            color: '#ff0000',
            track: {
                start: 53379291,
                end: 53416942,
                chr1: 'chr12',
                url:
                    'https://encode-public.s3.amazonaws.com/2016/11/15/09d1d648-2ff7-413d-8b31-a14cc81b3a23/ENCFF991NDB.bigWig',
                preRenderedWidth: 1850,
            },
        },
    ]);
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
            setAssemblyInfoData((await response.json()).data?.assemblies[0] || null);
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
                : [
                      ...customTracks!!,
                      {
                          title: modalstate.title,
                          color: modalstate.color,
                          track: {
                              url: modalstate.url,
                              chr1: modalstate.domain.chromosome!!,
                              start: modalstate.domain.start,
                              end: modalstate.domain.end,
                              preRenderedWidth: 1850,
                          },
                      },
                  ];
        setCustomTracks(tracks);
        setModalShown(false);
    };

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
                        <SearchBox onSearchSubmit={(domain: any) => onDomainChanged(parseDomain(domain))} />
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
                    <Hg38Browser domain={domain} onDomainChanged={onDomainChanged} customTracks={customTracks} />
                    <AddTrackModal
                        onOpen={() => setModalShown(true)}
                        onAccept={onModalAccept}
                        open={modalShown}
                        endpoint={'https://ga.staging.wenglab.org/graphql'}
                        domain={domain}
                    />
                    &nbsp;
                </>
            </div>
        </>
    );
};

export default GenomeBrowserPage;

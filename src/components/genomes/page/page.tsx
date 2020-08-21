import { GenomeBrowserPageProps, AssemblyInfo } from "./types"
import React,{ useState,useEffect } from 'react';
import { Hg38Browser } from "../hg38";
import GenomePageMenu from './menu';
import { ASSEMBLY_INFO_QUERY } from './queries';
import { Domain } from './../hg38/types';
import { SearchBox } from "../../search";
const parseDomain = (domain: string) => ({
    chromosome: domain.split(':')[0],
    start: +domain.split(':')[1].split('-')[0].replace(/,/g, ""),
    end: +domain.split('-')[1].replace(/,/g, "")
});

const GenomeBrowserPage:React.FC<GenomeBrowserPageProps> = props => {
    const [ domain, setDomain ] = useState<Domain>({ chromosome: "chr12",start: 53379291, end: 53416942 })
    const [ assemblyInfo, setAssemblyInfoData ] = useState< AssemblyInfo | null>(null);
    console.log(props.assembly)
    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch('http://35.201.115.1/graphql', {
                method: "POST",
                body: JSON.stringify({
                    query: ASSEMBLY_INFO_QUERY,
                    variables: { name: props.assembly }
                }),
                headers: { "Content-Type": "application/json" }
            });
            setAssemblyInfoData((await response.json()).data?.assemblies[0] || null);
        };
        fetchData();
    }, [ props.assembly ]);

    const onDomainChanged = React.useCallback((d:Domain)=>{
        if(d.chromosome && d.chromosome !== domain.chromosome)
        {
            setDomain({ chromosome: d.chromosome, start: d.start < 0 ? 0 : d.start, end: d.end })

        } else {
            setDomain({chromosome: domain.chromosome,...d })
        }
        
    },[domain.chromosome])
    
    return(  
        <>
        <GenomePageMenu />
        <div style={{ width: "100%" }} className="App">
            <br/>
            <h1>UMMS Genome Browser {assemblyInfo?.species} {assemblyInfo?.description}</h1>
            <div style={{ width: "75%", margin: "0 auto" }}>
                          <SearchBox onSearchSubmit={(domain: any) => onDomainChanged(parseDomain(domain))} />
                        </div>
                        <br />
            <span style={{ verticalAlign: "top", fontWeight: "bold" }}>
                    {domain.chromosome}:{Number(domain.start).toLocaleString()}-{Number(domain.end).toLocaleString()}&nbsp;&nbsp;
            </span>
            <Hg38Browser domain={domain} onDomainChanged={onDomainChanged}/>
        </div>
    </>)
}

export default GenomeBrowserPage    
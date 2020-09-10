import React, { useState, useEffect, useCallback } from 'react';
import { ASSEMBLY_QUERY } from './queries';
import { AssemblyInfo } from '../../genomes/page/types';
import { Segment, Container, Grid, Header, Input } from 'semantic-ui-react';
import MainMenu from './../homepage/masthead/menu';
import { mainMenuItems } from './../homepage/config/menuitems';
import dna from '../../dna.png';
import { Link } from 'react-router-dom';
import ContentDivider from './../homepage/content/divider';
const groupBySpecies = (assemblies: AssemblyInfo[]) => {
    let retval: Record<string,AssemblyInfo[]> = {};
    assemblies.forEach((x: AssemblyInfo) => {
        if (!retval[x.species]) retval[x.species] = [];
        retval[x.species].push(x);
    });
    return retval;
};
const compareAssembly = (a: AssemblyInfo, b: AssemblyInfo) => +b.name.replace(/\D/g, '') - +a.name.replace(/\D/g, '');
const groupHas = (group: any, q: string) => {    
    if (q === '') return true;
    for (let i = 0; i < group.length; ++i)
        if (group[i].name.toLowerCase().includes(q) || group[i].description.toLowerCase().includes(q)) return true;
    return false;
};

const GenomePage: React.FC = () => {
    const [assemblies, setAssemblies] = useState<AssemblyInfo[] | null>(null);
    const [q, setQ] = useState<string>('');
    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch('http://35.201.115.1/graphql', {
                method: 'POST',
                body: JSON.stringify({
                    query: ASSEMBLY_QUERY,
                }),
                headers: { 'Content-Type': 'application/json' },
            });
            setAssemblies((await response.json()).data?.genomicAssemblies || null);
        };
        fetchData();
    }, []);
    const onSearchChange = useCallback((e, d) => {
        //setSearchVal(d.result);
        setQ(e.target.value.toLowerCase());
    }, []);
    let groupedAssemblies = assemblies && groupBySpecies(assemblies);
    let genomeAssemblies =
        groupedAssemblies!==null &&
        Object.keys(groupedAssemblies)
            .sort()
            .filter((x) => q === '' || x.toLowerCase().includes(q) || groupHas(groupedAssemblies!![x], q));
    return (
        <>
            <Segment inverted fixed="top" attached="top">
                <Container>
                    <MainMenu items={mainMenuItems.items} active="Biologists" />
                </Container>
            </Segment>
            {genomeAssemblies && assemblies && groupedAssemblies && (
                <Container>
                    <Grid>
                        <Grid.Row />
                        <Grid.Row>
                            <Grid.Column width={2}>
                                <img src={dna} alt="DNA icon" />
                            </Grid.Column>
                            <Grid.Column className="middle aligned" width={14}>
                                <Header as="h1">
                                    Browse {assemblies.length} assemblies from {Object.keys(groupedAssemblies).length}{' '}
                                    species
                                </Header>
                                Click a link to open the UMMS Genome Browser for that assembly. Don't see the assembly
                                you want?&nbsp;
                                <Link to="/genomes/add">Add it</Link>!
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column>
                                <Input
                                    icon="search"
                                    placeholder="filter by species or assembly"
                                    style={{ width: '100%' }}
                                    onChange={onSearchChange}
                                />
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row />
                        {genomeAssemblies.map((species, i) => (
                            <React.Fragment key={species}>
                                <Grid.Row>
                                    <Grid.Column width={5}>
                                        <Header as="h1">{species}</Header>
                                    </Grid.Column>
                                    <Grid.Column width={11}>
                                        {groupedAssemblies!![species]
                                            .sort(compareAssembly)
                                            .map((assembly: AssemblyInfo, j: number) => (
                                                <React.Fragment key={species + '_' + assembly.name}>
                                                    <Link
                                                        to={'/browser/' + assembly.name}
                                                        style={{ fontWeight: 'bold', fontSize: '1.3em' }}
                                                    >
                                                        {assembly.name}
                                                    </Link>
                                                    <br />
                                                    {assembly.description}
                                                    {j < groupedAssemblies!![species].length - 1 && (
                                                        <React.Fragment>
                                                            <br />
                                                            <br />
                                                        </React.Fragment>
                                                    )}
                                                </React.Fragment>
                                            ))}
                                    </Grid.Column>
                                </Grid.Row>
                                {genomeAssemblies && i < genomeAssemblies.length - 1 && <ContentDivider />}
                            </React.Fragment>
                        ))}
                    </Grid>
                </Container>
            )}
        </>
    );
};
export default GenomePage;

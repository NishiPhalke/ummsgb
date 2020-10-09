import React, { useState, useCallback } from 'react';
import { Form, Search } from 'semantic-ui-react';
import { GENE_AUTOCOMPLETE_QUERY, SNP_AUTOCOMPLETE_QUERY } from './queries';
import { uniq, isCoordinate } from './utils';
import { SearchBoxProps, Result } from './types';

const SearchBox: React.FC<SearchBoxProps> = (props) => {
    const [searchVal, setSearchVal] = useState<string | undefined>();
    const [selectedSearchVal, setSelectedsearchVal] = useState<Result | undefined>();
    const [results, setResults] = useState<Result[]>();

    const onSubmit = useCallback(() => {
        if (searchVal && isCoordinate(searchVal)) {
            props.onSearchSubmit && props.onSearchSubmit(searchVal);
            return;
        }
        let gene = selectedSearchVal ? selectedSearchVal : results && results[0];

        if (gene === undefined) return;
        const coords = gene.description.split('\n');
        props.onSearchSubmit &&
            isCoordinate(coords.length === 2 ? coords[1] : coords[0]) &&
            props.onSearchSubmit(coords.length === 2 ? coords[1] : coords[0], gene.title, !(coords.length === 2));
    }, [searchVal, results, props, selectedSearchVal]);
    const onSearchChange = useCallback(
        async (e, { value }) => {
            let val: string = value.toLowerCase();
            let rs: Result[] = [];
            setSearchVal(value);
            if (val.startsWith('rs') && props.assembly === 'GRCh38') {
                const response = await fetch('https://snps.staging.wenglab.org/graphql', {
                    method: 'POST',
                    body: JSON.stringify({
                        query: SNP_AUTOCOMPLETE_QUERY,
                        variables: { snpid: value, assembly: 'hg38', limit: 3 },
                    }),
                    headers: { 'Content-Type': 'application/json' },
                });
                let rst = (await response.json()).data?.snpAutocompleteQuery
                    ?.slice(0, 3)
                    .map(
                        (result: {
                            rsId: string;
                            coordinates: { chromosome: string; start: number; end: number };
                        }) => ({
                            title: result.rsId,
                            description:
                                result.coordinates.chromosome +
                                ':' +
                                result.coordinates.start +
                                '-' +
                                result.coordinates.end,
                        })
                    );
                rs = uniq(rst, value);
            }
            if (
                value.toLowerCase().match(/^chr[0-9x-y]+$/g) &&
                value.toLowerCase().match(/^chr[0-9x-y]+$/g).length === 1 &&
                value.length <= 5
            ) {
                rs = [
                    { title: value + ':' + '1' + '-100000', description: '' + '\n' + value + ':' + '1' + '-100000' },
                    { title: value + ':' + '1' + '-1000000', description: '' + '\n' + value + ':' + '1' + '-1000000' },
                    {
                        title: value + ':' + '1' + '-10000000',
                        description: '' + '\n' + value + ':' + '1' + '-10000000',
                    },
                ];
            }
            const response = await fetch('https://ga.staging.wenglab.org/graphql', {
                method: 'POST',
                body: JSON.stringify({
                    query: GENE_AUTOCOMPLETE_QUERY,
                    variables: { name_prefix: value, assembly: props.assembly, orderby: 'name', limit: 3 },
                }),
                headers: { 'Content-Type': 'application/json' },
            });
            let genesRes = (await response.json()).data?.gene?.map(
                (result: {
                    name: string;
                    id: string;
                    coordinates: { chromosome: string; start: number; end: number };
                }) => ({
                    title: result.name,
                    description:
                        result.id +
                        '\n' +
                        result.coordinates.chromosome +
                        ':' +
                        result.coordinates.start +
                        '-' +
                        result.coordinates.end,
                })
            );

            let res: Result[] | undefined =
                genesRes && genesRes.length === 0 && rs.length > 0 ? undefined : uniq(genesRes, value);
            setResults(rs ? (res ? [...rs, ...res] : rs) : res);
        },
        [props.assembly]
    );
    const onResultSelect = useCallback((e, d) => {
        setSelectedsearchVal(d.result);
    }, []);
    return (
        <>
            {' '}
            <Form onSubmit={onSubmit}>
                <Search
                    input={{ fluid: true }}
                    placeholder="enter gene name,snp or locus"
                    onSearchChange={onSearchChange}
                    onResultSelect={onResultSelect}
                    results={results}
                />
            </Form>
        </>
    );
};

export default SearchBox;

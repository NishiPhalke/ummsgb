import React, { useState, useCallback } from 'react';
import { Form, Search } from 'semantic-ui-react';
import { GENE_AUTOCOMPLETE_QUERY } from './queries';
import { uniq, isCoordinate } from './utils';
import { SearchBoxProps } from './types';

const SearchBox: React.FC<SearchBoxProps> = (props) => {
    const [searchVal, setSearchVal] = useState<any | undefined>();
    const [results, setResults] = useState<any>();

    const onSubmit = useCallback(() => {
        if (isCoordinate(searchVal)) props.onSearchSubmit && props.onSearchSubmit(searchVal);
        let gene = searchVal && searchVal.description ? searchVal : results[0];

        if (gene === undefined) return;
        props.onSearchSubmit && props.onSearchSubmit(gene.description.split('\n')[1]);
    }, [searchVal, results, props]);
    const onSearchChange = useCallback(
        async (e, { value }) => {
            const response = await fetch('https:/ga.staging.wenglab.org/graphql', {
                method: 'POST',
                body: JSON.stringify({
                    query: GENE_AUTOCOMPLETE_QUERY,
                    variables: { name_prefix: value, assembly: props.assembly, limit: 3 },
                }),
                headers: { 'Content-Type': 'application/json' },
            });
            setSearchVal(value);
            setResults(
                uniq(
                    (await response.json()).data?.gene.map((result: any) => ({
                        title: result.name,
                        description:
                            result.id +
                            '\n' +
                            result.coordinates.chromosome +
                            ':' +
                            result.coordinates.start +
                            '-' +
                            result.coordinates.end,
                    })),
                    value
                )
            );
        },
        [props.assembly]
    );
    const onResultSelect = useCallback((e, d) => {
        setSearchVal(d.result);
    }, []);
    return (
        <>
            {' '}
            <Form onSubmit={onSubmit}>
                <Search
                    input={{ fluid: true }}
                    placeholder="enter gene name or locus"
                    onSearchChange={onSearchChange}
                    onResultSelect={onResultSelect}
                    results={results}
                />
            </Form>
        </>
    );
};

export default SearchBox;

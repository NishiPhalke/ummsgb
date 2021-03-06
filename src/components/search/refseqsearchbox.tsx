import React, { useState, useCallback } from 'react';
import { Form, Search } from 'semantic-ui-react';
import { REFSEQ_AUTOCOMPLETE_QUERY } from './queries';
import { isCoordinate, refsequniq } from './utils';
import { RefSeqSearchBoxProps, Result } from './types';

const RefSeqSearchBox: React.FC<RefSeqSearchBoxProps> = (props) => {
    const [selectedGene, setSelectedGene] = useState<Result | undefined>();
    const [results, setResults] = useState<Result[]>();

    const onSubmit = useCallback(() => {
        if (selectedGene && isCoordinate(selectedGene.description)) {
            props.onSearchSubmit && props.onSearchSubmit(selectedGene.description);
            return;
        }
        let g = selectedGene && selectedGene.description ? selectedGene.description : results && results[0].description;
        if (g === undefined) return;
        props.onSearchSubmit && isCoordinate(g) && props.onSearchSubmit(g);
    }, [results, props, selectedGene]);
    const onSearchChange = useCallback(
        async (e, { value }) => {
            const response = await fetch('https://ga.staging.wenglab.org/graphql', {
                method: 'POST',
                body: JSON.stringify({
                    query: REFSEQ_AUTOCOMPLETE_QUERY,
                    variables: {
                        searchTerm: value,
                        assembly: props.assembly,
                        limit: 10,
                    },
                }),
                headers: { 'Content-Type': 'application/json' },
            });

            let d = (await response.json()).data;
            let sresults = refsequniq([...d?.refseqgenes, ...d?.refseqxenogenes]).map((result) => ({
                title: result.name,
                description:
                    result.coordinates.chromosome + ':' + result.coordinates.start + '-' + result.coordinates.end,
            }));
            setSelectedGene({ description: value });
            setResults(sresults.length ? sresults : [{ title: value, description: '' }]);
        },
        [props.assembly]
    );
    const onResultSelect = useCallback((e, d) => {
        setSelectedGene(d.result);
    }, []);
    return (
        <>
            {' '}
            <Form onSubmit={onSubmit}>
                <Search
                    input={{ fluid: true }}
                    placeholder="enter gene name"
                    onSearchChange={onSearchChange}
                    onResultSelect={onResultSelect}
                    results={results}
                />
            </Form>
        </>
    );
};

export default RefSeqSearchBox;

import React, { useEffect, useState } from 'react';
import { CytobandsRProps, Cytoband } from './types';
import { CYTOBAND_QUERY } from './queries';
import { Cytobands } from 'umms-gb';
const CytobandsR: React.FC<CytobandsRProps> = (props) => {
    const [cytobands, setCytobands] = useState<Cytoband[] | null>(null);
    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch('http://35.201.115.1/graphql', {
                method: 'POST',
                body: JSON.stringify({
                    query: CYTOBAND_QUERY,
                    variables: { assembly: props.assembly, chromosome: props.chromosome },
                }),
                headers: { 'Content-Type': 'application/json' },
            });
            setCytobands((await response.json()).data?.cytoband || null);
        };
        fetchData();
    }, [props.assembly, props.chromosome]);
    return (
        <>
            {cytobands && (
                <Cytobands
                    data={cytobands}
                    width={props.width}
                    height={props.height}
                    domain={props.domain}
                    id={props.id}
                    highlight={props.highlight}
                />
            )}
        </>
    );
};

export default CytobandsR;

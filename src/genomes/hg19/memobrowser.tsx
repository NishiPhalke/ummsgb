import React from 'react';
import { Hg19BrowserProps } from './types';
import Hg19Browser from './browser';

const MemoHg19Browser: React.FC<Hg19BrowserProps> = (props) => {
    return React.useMemo(() => {
        return (
            <Hg19Browser
                domain={props.domain}
                customTracks={props.customTracks}
                svgRef={props.svgRef}
                onDomainChanged={props.onDomainChanged}
            />
        );
    }, [props.domain, props.customTracks, props.onDomainChanged, props.svgRef]);
};

export default MemoHg19Browser;

import React from 'react';
import { Hg38BrowserProps } from './types';
import Hg38Browser from './browser';

const MemoHg38Browser: React.FC<Hg38BrowserProps> = (props) => {
    return React.useMemo(() => {
        return (
            <Hg38Browser
                domain={props.domain}
                customTracks={props.customTracks}
                svgRef={props.svgRef}
                onDomainChanged={props.onDomainChanged}
                customFiles={props.customFiles}
            />
        );
    }, [props.domain, props.customTracks, props.onDomainChanged, props.svgRef, props.customFiles]);
};

export default MemoHg38Browser;

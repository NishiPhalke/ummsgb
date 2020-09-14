import React from 'react';
import { Mm10BrowserProps } from './types';
import Mm10Browser from './browser';

const MemoMm10Browser: React.FC<Mm10BrowserProps> = (props) => {
    return React.useMemo(() => {
        return (
            <Mm10Browser
                domain={props.domain}
                customTracks={props.customTracks}
                svgRef={props.svgRef}
                onDomainChanged={props.onDomainChanged}
            />
        );
    }, [props.domain, props.customTracks, props.onDomainChanged, props.svgRef]);
};

export default MemoMm10Browser;

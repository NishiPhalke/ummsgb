import React from 'react';
import { DefaultProps } from './types';
import DefaultBrowser from './default';


const MemoDefaultBrowser: React.FC<DefaultProps> = (props) => {
    return React.useMemo(()=>{
        return <DefaultBrowser {...props}/>
    },[ props.domain, props.customTracks, props.onDomainChanged, props.svgRef, props.assembly])

}

export default MemoDefaultBrowser;
import React, { useState } from 'react';
import { GenomeBrowserContainerProps, Domain } from './types';
import { validateDomain } from './utils';

const GenomeBrowserContainer: React.FC<GenomeBrowserContainerProps> = (props) => {
    const [domain, setDomain] = useState<Domain>(props.domain);

    const onDomainChanged = React.useCallback(
        (d: Domain) => {
            let validatedDomain = validateDomain(d, props.chromSizes[props.domain.chromosome!!]);
            setDomain({ ...domain, ...validateDomain });
            props.onDomainChanged && props.onDomainChanged(validatedDomain);
        },
        [domain, props]
    );
    let children: any = props.children && (props.children as any).length ? props.children : [props.children];

    return <>{children(onDomainChanged, domain)}</>;
};

export default GenomeBrowserContainer;

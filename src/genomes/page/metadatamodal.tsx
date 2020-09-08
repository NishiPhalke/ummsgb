import React, { useState } from 'react';
import { Modal, Button, Menu } from 'semantic-ui-react';
import { MetadataModalProps } from './types';
import { EncodeSearch, EncodeMetadata, ExperimentsByFeature } from 'gbmetadata';

const MetadataModal: React.FC<MetadataModalProps> = (props) => {
    const [activePage, setActivePage] = useState<string>('search');
    const addUrls = (urls: string[] | undefined) => {
        let tracks =
            urls &&
            urls.map((u) => {
                return {
                    url: u,
                    domain: props.domain,
                    color: '#ff0000',
                    title: u!!.split('/')[u!!.split('/').length - 1],
                };
            });
        props.onAccept(urls ? tracks : undefined);
    };
    const MenuItem: React.FC<{ page: string; title: string; onHover?: () => void }> = ({ page, title }) => (
        <Menu.Item active={activePage!.toLowerCase() === page} onClick={() => setActivePage(page)}>
            {title}
        </Menu.Item>
    );
    const inner = (() => {
        switch (activePage!.toLowerCase()) {
            case 'search':
                return <EncodeSearch assembly={props.assembly} addTrackUrls={addUrls} />;
            case 'metadata':
                return <EncodeMetadata assembly={props.assembly} addTrackUrls={addUrls} />;
            case 'groupbyontology':
                return (
                    <ExperimentsByFeature addTrackUrls={addUrls} assembly={props.assembly} featureName={'Ontology'} />
                );
            default:
                return <>{'Default'}</>;
        }
    })();
    return (
        <Modal trigger={<Button onClick={props.onOpen}> Metadata</Button>} open={props.open} size={'fullscreen'}>
            <Modal.Header>Encode Metadata</Modal.Header>
            <Modal.Content>
                <React.Fragment>
                    <Modal.Description>
                        <>
                            <Menu attached="top" tabular>
                                <MenuItem page="search" title="Search" />
                                <MenuItem page="metadata" title="Chip Seq Metadata" />
                                <MenuItem page="groupbyontology" title="Group by Ontology" />
                            </Menu>
                            <div style={{ marginTop: '1rem' }}>{inner}</div>
                        </>
                    </Modal.Description>
                    <Modal.Actions>
                        <div style={{ textAlign: 'right' }}>
                            <Button basic color="green" onClick={props.onClose}>
                                Close
                            </Button>
                        </div>
                    </Modal.Actions>
                </React.Fragment>
            </Modal.Content>
        </Modal>
    );
};

export default MetadataModal;

import React, { useState } from 'react';
import {
    AddTrackProps,
    DEFAULT_BIGWIG_DISPLAYMODE,
    DEFAULT_BIGBED_DISPLAYMODE,
    DEFAULT_BAM_DISPLAYMODE,
    TrackType,
} from './types';
import { Button, Modal, Message, Input, Radio, Dropdown } from 'semantic-ui-react';
import ColorPicker from './colorpicker';
import { TEST_QUERY } from './queries';
const getTrackDisplayModes = (url: string): { key: string; text: string; value: string }[] => {
    if (getTrackType(url) === 'BIGWIG') {
        return [
            { key: 'dense', text: 'dense', value: 'dense' },
            { key: 'full', text: 'full', value: 'full' },
        ];
    } else if (getTrackType(url) === 'BAM' || getTrackType(url) === 'BIGBED') {
        return [
            { key: 'dense', text: 'dense', value: 'dense' },
            { key: 'squish', text: 'squish', value: 'squish' },
        ];
    } else {
        return [
            { key: 'dense', text: 'dense', value: 'dense' },
            { key: 'squish', text: 'squish', value: 'squish' },
            { key: 'full', text: 'full', value: 'full' },
        ];
    }
};

const getDefaultDisplayMode = (url: string): string | undefined => {
    if (getTrackType(url) === 'BIGWIG') {
        return DEFAULT_BIGWIG_DISPLAYMODE;
    } else if (getTrackType(url) === 'BIGBED') {
        return DEFAULT_BIGBED_DISPLAYMODE;
    } else if (getTrackType(url) === 'BAM') {
        return DEFAULT_BAM_DISPLAYMODE;
    } else {
        return undefined;
    }
};
const getTrackType = (url: string): string | undefined => {
    if (url.toLowerCase().includes('.bigwig') || url.toLowerCase().includes('.bw')) {
        return TrackType.BIGWIG;
    } else if (url.toLowerCase().includes('.bigbed') || url.toLowerCase().includes('.bb')) {
        return TrackType.BIGBED;
    } else if (url.toLowerCase().includes('.bam')) {
        return TrackType.BAM;
    } else {
        return undefined;
    }
};
const AddTrack: React.FC<AddTrackProps> = (props) => {
    const [title, setTitle] = useState<string>('');
    const [displayMode, setDisplayMode] = useState<string>();
    const [addBamTrack, setAddBamTrack] = useState<boolean>(false);
    const [url, setUrl] = useState<string>('');
    const [baiUrl, setBaiUrl] = useState<string>();
    const [color, setColor] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [testing, setTesting] = useState<boolean>(false);
    const onAccept = () => {
        if (url.startsWith('gs://') || baiUrl) {
            props.onAccept &&
                props.onAccept([
                    {
                        url,
                        domain: props.domain,
                        baiUrl,
                        displayMode: displayMode || getDefaultDisplayMode(url),
                        color,
                        title,
                    },
                ]);
            return;
        }
        setTesting(true);
        fetch(props.endpoint, {
            method: 'POST',
            body: JSON.stringify({
                query: TEST_QUERY,
                variables: {
                    bigRequests: [
                        {
                            chr1: props.domain.chromosome,
                            start: props.domain.start,
                            end: props.domain.start + 10,
                            url: url,
                        },
                    ],
                },
            }),
            headers: { 'Content-Type': 'application/json' },
        })
            .then(() => {
                setError('');
                setTesting(false);
                props.onAccept &&
                    props.onAccept([
                        {
                            url,
                            domain: props.domain,
                            displayMode: displayMode || getDefaultDisplayMode(url),
                            color,
                            title,
                        },
                    ]);
            })
            .catch((e) => {
                setError(url);
                setTesting(false);
            });
    };
    return (
        <>
            <Modal
                trigger={<Button onClick={props.onOpen}> Add Custom Track</Button>}
                open={props.open}
                onClose={props.onClose}
                closeOnEscape={props.open}
            >
                <Modal.Header>Add Custom Track</Modal.Header>
                <Modal.Content>
                    {testing ? (
                        <Modal.Description>Testing track at {url}...</Modal.Description>
                    ) : (
                        <React.Fragment>
                            <Modal.Description>
                                {error && (
                                    <Message negative>
                                        An error occurred loading <a href={error}>{error}</a>; check that it is a valid
                                        URL and try again.
                                    </Message>
                                )}
                                <Radio
                                    checked={addBamTrack}
                                    label={'Add Bam Track'}
                                    onChange={(_, data) => {
                                        let val = data.checked as boolean;
                                        setAddBamTrack(val);
                                    }}
                                    toggle
                                />
                                <br />
                                <br />
                                <strong>Track Title: </strong>&nbsp;
                                <Input onChange={(e) => setTitle(e.target.value)} style={{ width: '90%' }} />
                                <br />
                                <br />
                                <strong>{addBamTrack ? 'Bam Track URL:' : 'Track URL:'}</strong>&nbsp;
                                <Input onChange={(e) => setUrl(e.target.value)} style={{ width: '90%' }} />
                                <br />
                                <br />
                                {addBamTrack && (
                                    <>
                                        <strong>{'Bam Index URL:'}</strong>&nbsp;
                                        <Input onChange={(e) => setBaiUrl(e.target.value)} style={{ width: '90%' }} />
                                        <br />
                                        <br />
                                    </>
                                )}
                                <strong>Display Mode:</strong>&nbsp;
                                <Dropdown
                                    placeholder="Select Display Mode"
                                    selection
                                    onChange={(_, data) => {
                                        setDisplayMode(data.value as string);
                                    }}
                                    options={getTrackDisplayModes(url)}
                                />
                                <br />
                                <br />
                                <ColorPicker color={color} onChangeComplete={(color) => setColor(color)} />
                                <br />
                            </Modal.Description>
                            <br />
                            <Modal.Actions>
                                <div style={{ textAlign: 'right' }}>
                                    <Button basic color="green" onClick={() => onAccept()}>
                                        OK
                                    </Button>
                                    <Button basic color="red" onClick={() => props.onClose()}>
                                        Cancel
                                    </Button>
                                </div>
                            </Modal.Actions>
                        </React.Fragment>
                    )}
                </Modal.Content>
            </Modal>
        </>
    );
};

export default AddTrack;

import React, { useState } from 'react';
import { AddTrackProps } from './types';
import { Button, Modal, Message, Input } from 'semantic-ui-react';
import ColorPicker from './colorpicker';
import { TEST_QUERY } from './queries';

const AddTrack: React.FC<AddTrackProps> = (props) => {
    const [title, setTitle] = useState<string>('');
    const [url, setUrl] = useState<string>('');
    const [color, setColor] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [testing, setTesting] = useState<boolean>(false);
    const onAccept = () => {
        if (url.startsWith('gs://')) {
            props.onAccept && props.onAccept({ url, domain: props.domain, color, title });
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
                props.onAccept && props.onAccept({ url, domain: props.domain, color, title });
            })
            .catch((e) => {
                console.log('catch', e);
                setError(url);
                setTesting(false);
            });
    };
    return (
        <>
            <Modal trigger={<Button onClick={props.onOpen}> Add Custom Track</Button>} open={props.open}>
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
                                <strong>Track Title: </strong>&nbsp;
                                <Input onChange={(e) => setTitle(e.target.value)} style={{ width: '90%' }} />
                                <br />
                                <br />
                                <strong>Track URL: </strong>&nbsp;
                                <Input onChange={(e) => setUrl(e.target.value)} style={{ width: '90%' }} />
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
                                    <Button basic color="red" onClick={() => props.onAccept(null)}>
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

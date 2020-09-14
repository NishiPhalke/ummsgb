import React, { useState } from 'react';
import { Message, Modal, Button, Input, Icon } from 'semantic-ui-react';
import { SessionModalProps } from './types';
import CopyToClipboard from 'react-copy-to-clipboard';

const SessionModal: React.FC<SessionModalProps> = (props) => {
    const [copied, setCopied] = useState<boolean>(false);

    return (
        <Modal open={props.open} onClose={props.onClose} closeOnEscape={props.open}>
            <Modal.Header>Session Saved!</Modal.Header>
            <Modal.Content>
                <React.Fragment>
                    <Modal.Description>
                        {props.warn !== 0 && (
                            <Message negative>
                                You are viewing uploaded local files. To save these as a part of your session, you must
                                host them online. Only custom files with URLs have been saved.
                            </Message>
                        )}
                        <strong>Session link: </strong>&nbsp;
                        <Input value={props.data} style={{ width: '75%' }} />
                        &nbsp;
                        <CopyToClipboard text={props.data} onCopy={() => setCopied(true)}>
                            {copied ? (
                                <Button>
                                    <Icon className="check" />
                                    Copied
                                </Button>
                            ) : (
                                <Button>
                                    <Icon className="copy outline" />
                                    Copy
                                </Button>
                            )}
                        </CopyToClipboard>
                        <br />
                        <br />
                    </Modal.Description>
                    <Modal.Actions>
                        <div style={{ textAlign: 'right' }}>
                            <Button basic color="green" onClick={props.onClose}>
                                OK
                            </Button>
                        </div>
                    </Modal.Actions>
                </React.Fragment>
            </Modal.Content>
        </Modal>
    );
};

export default SessionModal;

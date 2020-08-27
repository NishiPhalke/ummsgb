import React from 'react';
import { Segment, Container } from 'semantic-ui-react';

import { MainMenu, mainMenuItems } from '../../components/homepage';

const GenomePageMenu: React.FC = () => (
    <Segment inverted fixed="top" attached="top">
        <Container>
            <MainMenu items={mainMenuItems.items} active="Biologists" />
        </Container>
    </Segment>
);
export default GenomePageMenu;

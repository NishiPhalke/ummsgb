import React from 'react';
import { Header, Segment, Container } from 'semantic-ui-react';

import { MainMenu, mainMenuItems } from '../homepage';
import { UnderConstructionProps } from './types';

const UnderConstruction:React.FC<UnderConstructionProps> = ({ activeItem }) => (
    <React.Fragment>
      <Segment inverted fixed="top" attached="top">
        <Container>
          <MainMenu items={mainMenuItems.items} active={activeItem} />
        </Container>
      </Segment>
      <br/><br/>
      <Container>
        <Header as="h1">This page is under construction.</Header>
      </Container>
    </React.Fragment>
);
export default UnderConstruction;

import React from 'react';
import { Segment, Container, Header, Button } from 'semantic-ui-react';
import { Link } from "react-router-dom";
import { MainMastheadProps } from './types';

const MainMasthead:React.FC<MainMastheadProps> = props => (
    <Segment inverted
             textAlign='center'
             style={{ minHeight: 500, padding: '1em 0em' }}
             vertical>
      <Container>
        {props.children}
      </Container>
      <Container>
        <Header inverted style={{ fontSize: "4em", marginTop: "2.5em" }}>
          UMMS Genome Browser
        </Header>
        <Header inverted as="h2" style={{ fontWeight: "normal" }}>
          An embeddable, deconstructable, fully client-side genome browser.
        </Header>
        <Button as={Link} to="/genomes/" primary>
          Use the Browser
        </Button>
        <Button as={Link} to="/embed/" primary>
          Embed the Browser
        </Button>
      </Container>
    </Segment>
);
export default MainMasthead;

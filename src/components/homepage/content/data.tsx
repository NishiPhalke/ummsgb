import React from 'react';
import { Grid, Header, Button } from 'semantic-ui-react';

import share from '../../../share.png';

const Data: React.FC = ()  => (
    <Grid.Row>
      <Grid.Column width={11}>
        <Header as="h1">
          Load data from anywhere
        </Header>
        <p style={{ fontSize: "1.33em" }}>
          Tracks can be seamlessly loaded from anywhere: public consortia, your DropBox, or a
          private server. Or you can host your files with us in the Cloud for the fastest performance.
          Storage is private and HIPAA compliant.
        </p>
        <Button>Learn more</Button>
      </Grid.Column>
      <Grid.Column width={1} />
      <Grid.Column width={3}>
        <img src={share} alt="data" />
      </Grid.Column>
      <Grid.Column width={1} />
    </Grid.Row>
);
export default Data;

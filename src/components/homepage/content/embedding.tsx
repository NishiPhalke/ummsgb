import React from 'react';
import { Grid, Header, Button } from 'semantic-ui-react';

import { ReactComponent as Logo } from '../../../logo.svg';

const Embedding: React.FC = () => (
    <Grid.Row>
        <Grid.Column width={4}>
            <Logo />
        </Grid.Column>
        <Grid.Column width={12}>
            <Header as="h1">Flexible and highly customizable embedding</Header>
            <p style={{ fontSize: '1.33em' }}>
                The UMMS Genome Browser is fully based on ReactJS. Everything is a component, from tracks to composite
                track groups to the whole application. Embed them anywhere in your page, and customize with labels,
                custom axes, or any other React component you want.
            </p>
            <Button>Learn more</Button>
        </Grid.Column>
    </Grid.Row>
);
export default Embedding;

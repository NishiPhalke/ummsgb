import React from 'react';
import { Header, Grid, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import dna from '../../../dna.png';

const Genomes: React.FC = () => (
    <Grid.Row>
        <Grid.Column width={4}>
            <img src={dna} alt="DNA" />
        </Grid.Column>
        <Grid.Column width={12}>
            <Header as="h1">Support for any genome</Header>
            <p style={{ fontSize: '1.33em' }}>
                The genomes of more than a hundred species, including humans, mice, flies, worms, yeast, and various
                bacteria, are built in. If we don't have the organism or assembly you're interested in, just upload
                chromosomal annotations and get started visualizing right away.
            </p>
            <Button as={Link} to="/genomes/">
                Browse our genomes
            </Button>
            &nbsp;
            <Button as={Link} to="/genomes/add/">
                Add a genome
            </Button>
        </Grid.Column>
    </Grid.Row>
);
export default Genomes;

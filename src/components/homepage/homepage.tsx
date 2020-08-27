import React from 'react';
import { Segment, Grid, Container } from 'semantic-ui-react';

import { MainMasthead, MainMenu } from './masthead';
import { Footer } from './footer';
import { mainMenuItems } from './config';
import { Genomes, Data, Embedding, ContentDivider } from './content';

const HomePage = () => (
    <>
        <MainMasthead>
            <MainMenu items={mainMenuItems.items} active={mainMenuItems.defaultActive} />
        </MainMasthead>
        <Segment vertical>
            <Container>
                <Grid className="middle aligned">
                    <Grid.Row />
                    <Genomes />
                    <ContentDivider />
                    <Data />
                    <ContentDivider />
                    <Embedding />
                    <Grid.Row />
                </Grid>
            </Container>
        </Segment>
        <Footer />
    </>
);
export default HomePage;

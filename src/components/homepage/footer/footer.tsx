import React from 'react';
import { Segment, Container, Grid, Header, List } from 'semantic-ui-react';

const Footer: React.FC = () => (
    <Segment inverted vertical>
        <Container>
            <Grid divided inverted style={{ marginTop: '1em', marginBottom: '3em' }}>
                <Grid.Row>
                    <Grid.Column width={3}>
                        <Header inverted as="h4">
                            About
                        </Header>
                        <List link inverted>
                            <List.Item as="a">For Biologists</List.Item>
                            <List.Item as="a">For Developers</List.Item>
                            <List.Item as="a">Contact Us</List.Item>
                        </List>
                    </Grid.Column>
                    <Grid.Column width={3}>
                        <Header inverted as="h4">
                            Services
                        </Header>
                        <List link inverted>
                            <List.Item as="a">Data Hosting</List.Item>
                            <List.Item as="a">APIs</List.Item>
                        </List>
                    </Grid.Column>
                    <Grid.Column width={7}>
                        <Header inverted as="h4">
                            Code, Contributing, and Deploying an Instance
                        </Header>
                        <p style={{ color: '#ffffff88' }}>
                            The UMMS Genome Browser is mostly open-source. You can deploy an instance of this
                            application on your laptop or server. Contributions to the codebase are welcome. For more
                            information, see our <a href="https://www.github.com/hpratt/ummsgb">GitHub</a>.
                        </p>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Container>
    </Segment>
);
export default Footer;

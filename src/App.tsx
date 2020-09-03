import React from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import './App.css';

import { HomePage } from './components/homepage';
import { DevelopersPage } from './components/developerspage';
import { AboutPage } from './components/aboutpage';
import { GenomeBrowserPage } from './genomes/page';
import { GenomePage } from './components/genomepage';
import queryString from 'query-string';

const decodeSession = (q: any) => {
    if (!q || !q.session) return {};
    const decoded = new Buffer(q.session, 'base64').toString('ascii');
    const j = JSON.parse(decoded);
    if (q.chromosome) j.domain.chr1 = q.chromosome;
    if (q.start) j.domain.start = +q.start;
    if (q.end) j.domain.end = +q.end;
    return j;
};

const App: React.FC = () => {
    return (
        <Router>
            <Route path="/" exact component={HomePage} />
            <Route path="/about/" exact component={AboutPage} />
            <Route path="/genomes/" exact component={GenomePage} />
            <Route path="/genomes/add/" exact component={DevelopersPage} />
            <Route path="/biologists/" exact component={GenomePage} />
            <Route path="/developers/" exact component={DevelopersPage} />
            <Route
                path="/browser/:assembly"
                render={({ match, location }) => {
                    const parameters = queryString.parse(location.search);
                    if (parameters.session)
                        return (
                            <Redirect
                                to={{
                                    pathname: '/browser/' + match.params.assembly,
                                    state: { session: decodeSession(parameters) },
                                }}
                            />
                        );
                    return (
                        <GenomeBrowserPage
                            assembly={match.params.assembly}
                            session={(location as any).state && (location as any).state.session}
                        />
                    );
                }}
            />
        </Router>
    );
};
export default App;

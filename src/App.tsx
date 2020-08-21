import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import "./App.css";

import { HomePage } from './components/homepage';
import { DevelopersPage } from './components/developerspage';
import { AboutPage } from './components/aboutpage';
import { GenomeBrowserPage } from './components/genomes/page';

class App extends React.Component {
    
  render() {
      return (
          <Router>
            <Route path="/" exact component={HomePage} />
            <Route path="/about/" exact component={AboutPage} />
            <Route path="/developers/" exact component={DevelopersPage} />
            <Route path="/browser/:assembly"
                     render={ ({ match, location }) => {                         
                         return (
                             <GenomeBrowserPage assembly={match.params.assembly} />
                         );
                     }} />

          </Router>
      );
  }
  
}
export default App;
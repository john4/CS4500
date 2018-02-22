import { BrowserRouter as Router, Route } from 'react-router-dom';
import React, { Component } from 'react';

import App from './App';
import Search from './components/Search/Search';
import Login from './components/Login';

class Routes extends Component {
  render() {
    return (
      <Router>
        <div>
          <Route path="/" component={App} />
          <Route exact path="/" component={Login} />
          <Route exact path="/search" component={Search} />
        </div>
      </Router>
    )
  }
}

export default Routes;
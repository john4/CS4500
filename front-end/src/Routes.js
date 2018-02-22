import { BrowserRouter as Router, Route } from 'react-router-dom';
import React, { Component } from 'react';

import App from './App';
import Search from './components/Search/Search';
import Register from './components/User/Register';

class Routes extends Component {
  render() {
    return (
      <Router>
        <div>
          <Route path="/" component={App} />
          <Route exact path="/search" component={Search} />
          <Route exact path="/register" component={Register} />
        </div>
      </Router>
    )
  }
}

export default Routes;
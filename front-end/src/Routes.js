import { BrowserRouter as Router, Route } from 'react-router-dom';
import React, { Component } from 'react';

import App from './App';
import Search from './components/Search/Search';
import Register from './components/User/Register';
import Account from './components/User/Account';
import Details from './components/Movies/Details';
import Login from './components/Login';

class Routes extends Component {
  render() {
    return (
      <Router>
        <div>
          <Route path="/" component={App} />
          <Route exact path="/" component={Login} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/search" component={Search} />
          <Route exact path="/account" component={Account} />
		  <Route exact path="/movieDetail" component={Details} />
        </div>
      </Router>
    )
  }
}

export default Routes;
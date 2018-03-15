import { BrowserRouter as Router, Route } from 'react-router-dom';
import React, { Component } from 'react';

import App from './App';
import Search from './components/Search/Search';
import Register from './components/User/Register';
import Account from './components/User/Account';
import Details from './components/Movies/Details';
import Login from './components/Login';
import Logout from './components/Logout';

class Routes extends Component {
  render() {
    return (
      <Router>
        <div>
          <Route path="/" component={App} />
          <Route exact path="/" component={Login} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/logout" component={Logout} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/search" component={Search} />
          <Route exact path="/account" component={Account} />
          <Route exact path="/movie/detail/:tmdbid" component={Details} />
        </div>
      </Router>
    )
  }
}

export default Routes;
import { BrowserRouter as Router, Route } from 'react-router-dom';
import React, { Component } from 'react';

import App from './App';
import Search from './components/Search/Search';
import Register from './components/User/Register';
import Details from './components/Movies/Details';
import Login from './components/Login';
import Logout from './components/Logout';
import Profile from './components/User/Profile';

class Routes extends Component {
  render() {
    return (
      <Router>
        <div>
          <Route path="/" component={App} />
          <Route exact path="/" component={Login} />
          <Route exact path="/login/" component={Login} />
          <Route exact path="/logout/" component={Logout} />
          <Route exact path="/register/" component={Register} />
          <Route exact path="/search/" component={Search} />
          <Route exact path="/movie/:tmdbid/detail/" component={Details} />
		  <Route exact path="/user/profile/" component={Profile} />
        </div>
      </Router>
    )
  }
}

export default Routes;

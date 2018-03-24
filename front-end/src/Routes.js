import { BrowserRouter as Router, Route } from 'react-router-dom';
import React, { Component } from 'react';

import App from './App';
import MovieSearch from './components/MovieSearch/MovieSearch';
import Register from './components/User/Register';
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
          <Route exact path="/login/" component={Login} />
          <Route exact path="/logout/" component={Logout} />
          <Route exact path="/register/" component={Register} />
          <Route exact path="/search/" component={MovieSearch} />
          <Route exact path="/movie/:tmdbid/detail/" component={Details} />
        </div>
      </Router>
    )
  }
}

export default Routes;

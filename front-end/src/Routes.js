import { BrowserRouter as Router, Route } from 'react-router-dom';
import React, { Component } from 'react';

import App from './App';
import MovieSearch from './components/MovieSearch/MovieSearch';
import FollowerSearch from './components/FollowerSearch/FollowerSearch';
import Register from './components/User/Register';
import Details from './components/Movies/Details';
import Login from './components/Login';
import Logout from './components/Logout';
import NotificationList from './components/Notification/NotificationList';
import Genre from './components/Playlist/Genre';

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
          <Route exact path="/user-search/" component={FollowerSearch} />
          <Route exact path="/movie/:tmdbid/detail/" component={Details} />
          <Route exact path="/user/notification/" component={NotificationList} />
          <Route exact path="/playlist/genre/" component={Genre} />
        </div>
      </Router>
    )
  }
}

export default Routes;

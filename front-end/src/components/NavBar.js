'use es6';

import React, { Component } from 'react';
import '../App.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'react-bootstrap';
import AccountNav from './User/AccountNav';
import NotificationIcon from './Notification/NotificationIcon';

class NavBar extends Component {

  render() {
    const isLoggedIn = true;

    return (
      <header className="App-header">
        <div className="row">
          <div className="col">
            <h1 className="App-title">Spoiled Tomatillos</h1>
          </div>
          <div className="col navbar">
            <a href="/search">Search</a>
            <a href="/logout">Logout</a>
            <NotificationIcon />
          </div>
          <div className="col text-right">
            <AccountNav />
          </div>
        </div>

      </header>
    );
  }
}

export default NavBar;

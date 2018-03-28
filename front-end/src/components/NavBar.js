'use es6';

import React, { Component } from 'react';
import '../App.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'react-bootstrap';
import AccountNav from './User/AccountNav';

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
            <a href="/playlist/genre"> Playlist</a>
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

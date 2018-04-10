'use es6';

import React, { Component } from 'react';
import '../App.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'react-bootstrap';
import {ApiWrapper} from '../ApiWrapper';
import AccountNav from './User/AccountNav';
import NotificationIcon from './Notification/NotificationIcon';

class NavBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      session: null
    };
  }

  componentWillMount() {
    this.setState({
      session: ApiWrapper().getSession()
    });
	}

  render() {
    const {session} = this.state;

    return (
      <header className="App-header w-100">
        <div className="row w-100">
          <div className="col">
            <a href="/" className="App-title">
              <h1 className="App-title">Spoiled Tomatillos</h1>
            </a>
          </div>
          <div className="col navbar">
            {session.isLoggedIn && session.isAdmin === "true" && [
              <a href="/logs">View Logs</a>
            ]}
            <a href="/search">Movie Search</a>
            {session.isLoggedIn && [
              <a href="/user-search">User Search</a>,
              <NotificationIcon />
            ]}
          </div>
          <div className="col">
            <AccountNav username={session.name} />
          </div>
        </div>

      </header>
    );
  }
}

export default NavBar;

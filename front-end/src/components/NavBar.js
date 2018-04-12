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
      session: this.props.session
    };
  }

  render() {
    const {session} = this.state;

    return (
      <header className="App-header row no-gutters">
          <div className="col-4">
            <a href="/" className="App-title">
                <img src={"/logo.png"} />
            </a>
          </div>
          <div className="col-4 navbar " >
            {session.isLoggedIn && session.isAdmin === true && [
              <a href="/logs" className="navbar-link">View Logs</a>
            ]}
            <a href="/search" className="navbar-link">Movie Search</a>
            {session.isLoggedIn && [
              <a className="navbar-link" href="/user-search">Find Users</a>
            ]}
            <a href="/" className="navbar-link">Home</a>
          </div>
          <div className="col-2" />
          <div className="col-2">
            <div className="row no-gutters ">
              <div className="col-6" />
              <div className="col-5 navbar">
                  {session.isLoggedIn && [<NotificationIcon />]}
                  <AccountNav photoUrl={session.photoUrl} />
              </div>
              <div className="col-1" />
            </div>
          </div>
      </header>
    );
  }
}

export default NavBar;

import React, { Component } from 'react';
import { ApiWrapper } from '../../ApiWrapper';
import './User.css';

class Account extends Component {

  render() {
    var username = this.props.username;
    if (username) {
      return (
	  <a href="/user/profile">{username}</a>);
    } else {
      return ([
        <a className="AccountNav-loginItem" href="/login">Log in</a>,
        <a className="AccountNav-loginItem" href="/register">Register</a>
      ]);
    }
  }
}

export default Account;
import React, { Component } from 'react';
import { ApiWrapper } from '../../ApiWrapper';
import 'bootstrap/dist/css/bootstrap.css';
import 'react-bootstrap';
import './User.css';

class Account extends Component {
  constructor(props) {
    super(props);

    this.state = {
      menuOpen: false,
    };
  }

  render() {
    const username = this.props.username;
    const { menuOpen } = this.state;
    const openClass = menuOpen ? "show" : "";

    if (username) {
      return (
        <div className={`AccountNav-dropdown dropdown ${openClass}`}>
          <a className="btn btn-secondary dropdown-toggle" onClick={() => this.setState({menuOpen: !menuOpen})} href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded={menuOpen}>
            { username }
          </a>
          <div style={{right: 0, left: 'auto'}} className={`dropdown-menu dropdown-menu-right ${openClass}`} aria-labelledby="dropdownMenuLink">
            <a className="dropdown-item" href="/user/profile">Profile</a>
            <a className="dropdown-item" href="/logout">Log out</a>
          </div>
        </div>
      );
    } else {
      return ([
        <a className="AccountNav-loginItem" href="/login">Log in</a>,
        <a className="AccountNav-loginItem" href="/register">Register</a>
      ]);
    }
  }
}

export default Account;
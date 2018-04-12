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
  
  renderUserImage() {
      if(this.props.photoUrl){
        return (<img src={this.props.photoUrl} class="" />);
      } else {
        return (<span className="fa-stack">
                    <i class="fa fa-circle fa-stack-2x" />
                    <i class="fas fa-user fa-stack-1x fa-inverse" />
                </span>);
      }
  }
  
  render() {
    const photoUrl = this.props.photoUrl;
    const { menuOpen } = this.state;
    const openClass = menuOpen ? "show" : "";

    if (photoUrl) {
      return (
        <div className={`AccountNav-dropdown dropdown  ${openClass}`}>
          
          <a onClick={() => this.setState({menuOpen: !menuOpen})} href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded={menuOpen}>
            {this.renderUserImage()}
          </a>
          <ul className={`dropdown-menu dropdown-menu-right ${openClass}`} aria-labelledby="dropdownMenuLink">
            <a className="dropdown-item" href="/user/profile">Profile</a>
            <a className="dropdown-item" href="/logout">Log out</a>
          </ul>
        </div>
      );
    } else {
      return ([
        <a className="AccountNav-loginItem" href="/register">Sign-Up</a>,
        <a className="AccountNav-loginItem" href="/login">Log In</a>
      ]);
    }
  }
}

export default Account;
import React, { Component } from 'react';
import { ApiWrapper } from '../ApiWrapper';
import { INVALID_LOGIN } from '../Errors'

const LOGIN_PATH = "/user/login/";

class Login extends Component {
    constructor(props) {
      super(props);
      this.state = {
        error: null
      }
      this.handleLogin = this.handleLogin.bind(this);
    }

    handleLogin(e) {
      const email    = this.refs.email.value;
      const password = this.refs.password.value;
      ApiWrapper().api().login(email, password)
        .catch(err => {
          if (err.response.status == 400) {
            this.setState({error: INVALID_LOGIN})
          }
        });
      e.preventDefault();
      return false;
    }

    render() {
      return (
          <div>
            <form onSubmit={this.handleLogin}>
              <input type="text" placeholder="Email address" ref="email" />
              <input type="password" placeholder="Password" ref="password" />
              <input type="submit" value="Login" />
            </form>
            <div className="px-4">
              <i>{this.state.error}</i>
            </div>
          </div>
      );
    }
  }

  export default Login;
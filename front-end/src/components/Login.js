import React, { Component } from 'react';
import { ApiWrapper } from '../ApiWrapper';

const LOGIN_PATH = "/user/login/";

class Login extends Component {
    constructor(props) {
      super(props);
      this.handleLogin = this.handleLogin.bind(this);
    }

    handleLogin(e) {
      const email    = this.refs.email.value;
      const password = this.refs.password.value;
      ApiWrapper().api().login(email, password);
      e.preventDefault();
      return false;
    }

    render() {
      return (
          <div>
            <form>
              <input type="email" placeholder="Email address" ref="email" />
              <input type="password" placeholder="Password" ref="password" />
              <input type="submit" value="Login" onClick={this.handleLogin} />
            </form>
          </div>
      );
    }
  }

  export default Login;
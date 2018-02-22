import React, { Component } from 'react';
import axios from 'axios';

const LOGIN_ENDPOINT = "";

class Login extends Component {
    constructor(props) {
      super(props);
      this.handleLogin = this.handleLogin.bind(this);
    }

    handleLogin() {
      const email    = this.refs.email.value;
      const password = this.refs.password.value;
      axios.post(LOGIN_ENDPOINT, { email, password })
      .then(res => {
        // TODO: save session
      })
    }

    render() {
      return (
          <div>
              <input type="email" placeholder="Email address" ref="email" />
              <input type="password" placeholder="Password" ref="password" />
              <input type="submit" value="Login" onClick={this.handleLogin} />
          </div>
      );
    }
  }

  export default Login;
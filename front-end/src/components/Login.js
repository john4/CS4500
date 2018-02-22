import React, { Component } from 'react';
import axios from 'axios';

const LOGIN_ENDPOINT = "http://127.0.0.1:5000/user/login";

class Login extends Component {
    constructor(props) {
      super(props);
      this.handleLogin = this.handleLogin.bind(this);
    }

    handleLogin() {
      const email    = this.refs.email.value;
      const password = this.refs.password.value;
      axios.post(LOGIN_ENDPOINT, { form: { email, password } })
      .then(res => {
        debugger;
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
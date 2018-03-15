import React, { Component } from 'react';
import { ApiWrapper } from '../ApiWrapper';

const LOGIN_PATH = "/user/login/";
// const LOGIN_ENDPOINT = "http://127.0.0.1:5000/user/login/";

class Login extends Component {
    constructor(props) {
      super(props);
      this.handleLogin = this.handleLogin.bind(this);
    }

    handleLogin(e) {
      const email    = this.refs.email.value;
      const password = this.refs.password.value;
      ApiWrapper().api()
        .post(LOGIN_PATH, { email, password })
        .then(res => {
          ApiWrapper().api().setSession(res.data.session);
          console.log(res.data);
          // TODO: save session
        })
        .catch(err => {
          console.log(err);
        });
      e.preventDefault();
      return false;
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
import React, { Component } from 'react';
import { ApiWrapper } from '../ApiWrapper';

const LOGOUT_PATH = "/user/logout/";

class Logout extends Component {
    constructor(props) {
      super(props);
    }

    componentDidMount() {
      ApiWrapper().api().removeSession();
    }

    render() {
      return (
          <div>
              Goodbye
          </div>
      );
    }
  }

  export default Logout;
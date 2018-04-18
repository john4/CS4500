import React, { Component } from 'react';
import { ApiWrapper } from '../ApiWrapper';

class Logout extends Component {
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
import React, { Component } from 'react';
import { ApiWrapper } from '../../ApiWrapper';


class Account extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      email: '',
      password: '',
      age: 0,
      genre: '',
      error: ''
    }


  }

  componentWillMount() {
    ApiWrapper().api().getAccountDetails().then(this.receiveDetails);
  }

  receiveDetails(res) {
    console.log(res);
  }

  render() {
    return <div />;
  }
}

export default Account;
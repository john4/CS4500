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

    this.receiveDetails = this.receiveDetails.bind(this);
  }

  componentWillMount() {
    ApiWrapper().api().getAccountDetails().then(this.receiveDetails);
  }

  receiveDetails(res) {
    this.setState({
        name: res.data.name
    })
  }

  render() {
    // const username = this.state.name;
    var username = this.state.name;
    return (username);
  }
}

export default Account;
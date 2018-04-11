import React, { Component } from 'react';
import { ApiWrapper } from '../../ApiWrapper';

class LogResults extends Component {
  constructor(props) {
    super(props);

    this.state = {
      logs: null
    };
  }

  componentWillMount() {
    const { session } = this.props
    if (session.isAdmin) {
      ApiWrapper().api().getLogs().then(res => {
        this.setState({
          logs: res.data
        })
      });
    } 
  }

  render() {
    const {logs} = this.state
    return (
      <div>
        {JSON.stringify(logs)}
      </div>
    );
  }
}

export default LogResults;
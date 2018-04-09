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
    if (this.props.isAdmin) {
      ApiWrapper().api().getLogs().then(res => {
        this.setState({
          logs: res.data
        })
      });
    } 
  }


  render() {
    const {logs} = this.state
    const {isAdmin} = this.props
    return (
      <div>
        {isAdmin && JSON.stringify(logs)}
      </div>
    );
  }
}

export default LogResults;
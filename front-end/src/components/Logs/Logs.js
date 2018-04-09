import React, { Component } from 'react';
import { ApiWrapper } from '../../ApiWrapper';

class Logs extends Component {
  constructor(props) {
    super(props);

    this.state = {
      logs: null,
      isAdmin: false
    };
  }

  componentWillMount() {
    const isAdmin = ApiWrapper().api().getAccountDetails().then(res => {
      return res.data.isAdmin
    });

    if (isAdmin) {
      var logs = ApiWrapper().api().getLogs().then(res => {
        this.setState({
          isAdmin: isAdmin,
          logs: res.data
        })
      }); 
    }
	}

  render() {
    const { isAdmin, logs } = this.state
    if (isAdmin) {
      return (
        <div>
          <h3>System Logs</h3>
          {JSON.stringify(logs)}
        </div>
      );
    }
    return <div></div>
  }

}
export default Logs;
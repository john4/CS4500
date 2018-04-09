import React, { Component } from 'react';
import { ApiWrapper } from '../../ApiWrapper';
import LogResults from './LogResults'


class Logs extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isAdmin: false,
    };
    this.onDelete = this.onDelete.bind(this)
  }

  componentWillMount() {
    ApiWrapper().api().getAccountDetails().then(res => {
      this.setState({
        isAdmin: res.data.isAdmin
      })
    });
  }

  onDelete() {
    ApiWrapper().api().clearLogs().then(res => {
      window.location.reload()
    })
  }

  render() {
    const { isAdmin, logsDeleted, success } = this.state
    if (isAdmin) {
      return (
        <div className="container">
          <h3>System Logs</h3>
          <button className="btn btn-secondary" type="button" onClick={this.onDelete}>Clear Logs</button>
          <LogResults isAdmin={isAdmin} />
        </div>
      );
    }
    return null
  }

}
export default Logs;
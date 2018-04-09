import React, { Component } from 'react';
import { ApiWrapper } from '../../ApiWrapper';
import LogResults from './LogResults'


class Logs extends Component {
  constructor(props) {
    super(props);

    this.state = {
      session: null
    };
    this.onDelete = this.onDelete.bind(this)
  }

  componentWillMount() {
    this.setState({
      session: ApiWrapper().getSession()
    })
  }

  onDelete() {
    ApiWrapper().api().clearLogs().then(res => {
      window.location.reload()
    })
  }

  render() {
    const { session } = this.state
    if (session.isAdmin == true) {
      return (
        <div className="container">
          <h3>System Logs</h3>
          <button className="btn btn-secondary" type="button" onClick={this.onDelete}>Clear Logs</button>
          <LogResults isAdmin={session.isAdmin} />
        </div>
      );
    }
    return null
  }

}
export default Logs;
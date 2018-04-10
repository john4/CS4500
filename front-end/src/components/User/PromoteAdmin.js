import React, { Component } from 'react';
import { ApiWrapper } from '../../ApiWrapper';

class PromoteAdmin extends Component {
    constructor(props) {
        super(props);
        this.promoteToAdmin = this.promoteToAdmin.bind(this)
    }

    promoteToAdmin() {
        const { session, userId } = this.props
        ApiWrapper().api().promoteToAdmin(session.sessionId, userId).then(res => {
            window.location.reload()
        })
    }

    render() {
        const { sessionIsAdmin, userIsAdmin } = this.props
        
        if (sessionIsAdmin && userIsAdmin) {
            return <span>This user is a system administrator.</span>
        }
        if (sessionIsAdmin) {
            return <button className="btn btn-secondary" onClick={this.promoteToAdmin}>Give This User Admin Rights</button>
        }
        return <div></div>
    }
}

export default PromoteAdmin
import React, { Component } from 'react';
import { ApiWrapper } from '../../ApiWrapper';
import './Notification.css';

class NotificationIcon extends Component {
    constructor(props) {
      super(props);

      this.state = {
        notificationCount: 0
      }
    }

    componentDidMount() {
      ApiWrapper().api().getNotifications()
        .then(res => {
          var unread = res.data.filter(note => !note.read);
          this.setState({notificationCount: String(unread.length)});
        }).catch(err => {
          console.log(err);
        });
    }

    render() {
      if (this.state.notificationCount != undefined && this.state.notificationCount > 0) {
        return (
          
            <div>
              <a href="/user/notification/">
                <span class="fa-stack has-badge" data-count={this.state.notificationCount}>
                  <i class="fa fa-circle fa-stack-2x"></i>
                  <i class="fa fa-bell fa-stack-1x fa-inverse"></i>
                </span>
              </a>
            </div>
          
        );
      } else {
        return (
          
            <div>
              <a href="/user/notification/">
                  <span class="fa-stack">
                    <i class="fa fa-circle fa-stack-2x"></i>
                    <i class="fa fa-bell fa-stack-1x fa-inverse"></i>
                  </span>
              </a>
            </div>
          
        );
      }
    }
  }

  export default NotificationIcon;
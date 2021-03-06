import React, { Component } from 'react';
import { ApiWrapper } from '../../ApiWrapper';
import NotificationItem from './NotificationItem';
import { NO_NOTIFS } from '../../Errors'

class NotificationList extends Component {
    constructor(props) {
      super(props);

      this.state = {
        notifications: []
      }
    }

    componentDidMount() {
      ApiWrapper().api().getNotifications()
        .then(res => {
          var unread = res.data.filter(note => !note.read);
          this.setState({notifications: unread});
        }).catch(err => {
          console.log(err);
        });
    }

    render() {
      var notificationItems = [];
      this.state.notifications.forEach(function (result) {
        notificationItems.push(<NotificationItem
                  sender={result.sender_name}
                  tmdbId={result.tmdb_id}
                  id={result._id.$oid}
                  message={result.message}
                  read={result.read}
                  timestamp={result.timestamp.$date} />)
      });

      if (this.state.notifications.length > 0) {
        return (
          <div className="container">
            <div className="container-fluid pt-2">
              <h2 className="pb-2">My Notifications</h2>
              {notificationItems}
            </div>
          </div>
        )
      } else {
        return (
          <div className="container-fluid pt-2">
            <h2>My Notifications</h2>
            <div>
              <i>{NO_NOTIFS}</i>
            </div>
          </div>
        );
      }
    }
  }

  export default NotificationList;
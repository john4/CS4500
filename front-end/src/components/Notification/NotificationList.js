import React, { Component } from 'react';
import { ApiWrapper } from '../../ApiWrapper';
import NotificationItem from './NotificationItem';

class NotificationList extends Component {
    constructor(props) {
      super(props);

      this.state = {
        notifications: []
      }
    }

    componentDidMount() {
      ApiWrapper().api()
      .post(
        '/user/prod/get-all/',
        {
          session_id: localStorage.getItem("spoiledSessionId"),
          user_id: localStorage.getItem("spoiledUserId")
        }
      ).then(res => {
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

      console.log(notificationItems);

      if (this.state.notifications.length > 0) {
        return (
          <div className="container-fluid pt-2">
            <h2 className="pb-2">My Notifications</h2>

            {notificationItems}
          </div>
        )
      } else {
        return (
          <div className="container-fluid pt-2">
            <h2>My Notifications</h2>
            <div>
              <i>No new notifications.</i>
            </div>
          </div>
        );
      }
    }
  }

  export default NotificationList;
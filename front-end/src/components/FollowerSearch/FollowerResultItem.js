import React, { Component } from 'react';
import './FollowerSearch.css';
import '../User/User.css';

class FollowerResultItem extends Component {
    render() {
      const {email, genre, name, photoUrl, userId, onClickFollow} = this.props;

      return (
        <li className="FollowerResultItem">
          <div className="FollowerResultItem-add" onClick={() => onClickFollow(userId)}>
            <i className="fas fa-user-plus"></i>
          </div>
          <div className="FollowerResultItem-image">
            <img className="UserImage" src={photoUrl} />
          </div>
          <div className="FollowerResultItem-body">
            <b>{name}</b>
            <p>Likes: {genre}</p>
            <div>{this.props.overview}</div>
          </div>
        </li>
      );
    }
  }

  export default FollowerResultItem;
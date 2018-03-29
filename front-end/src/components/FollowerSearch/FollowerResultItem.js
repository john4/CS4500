import React, { Component } from 'react';
import { ApiWrapper } from '../../ApiWrapper';
import './FollowerSearch.css';
import '../User/User.css';

class FollowerResultItem extends Component {
    constructor(props) {
      super(props);

      this.state = {
        isFollowing: false
      }

      this.handleFollow = this.handleFollow.bind(this);
      this.handleUnfollow = this.handleUnfollow.bind(this);
      this.componentDidMount = this.componentDidMount.bind(this);
    }

    handleFollow(userId) {
      ApiWrapper().api().followUser(userId);
      this.setState({isFollowing: true});
    }

    handleUnfollow(userId) {
      ApiWrapper().api().unfollowUser(userId);
      this.setState({isFollowing: false});
    }

    componentDidMount() {
      if (this.props.followMe != undefined && this.props.followMe.length > 0) {
        var loggedInUserId = localStorage.getItem("spoiledUserId");
        var followerIds = this.props.followMe.map(follower => follower.$oid);
        this.setState({isFollowing: followerIds.includes(loggedInUserId)});
      }
    }

    render() {
      const {email, genre, name, photoUrl, userId, followMe } = this.props;

      if (this.state.isFollowing) {
        var followButton = (
          <div className="FollowerResultItem-add" onClick={() => this.handleUnfollow(userId)}>
            <i className="fas fa-check"></i>
          </div>
        );
      } else {
        var followButton = (
          <div className="FollowerResultItem-add" onClick={() => this.handleFollow(userId)}>
            <i className="fas fa-user-plus"></i>
          </div>
        )
      }
      return (
        <li className="FollowerResultItem">
          {followButton}
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
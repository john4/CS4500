import React, { Component } from 'react';
import Modal from '../Modal/Modal';
import ProdResultItem from './ProdResultItem';
import {ApiWrapper} from '../../ApiWrapper';
import { NO_FOLLOWERS } from '../../Errors'

class FollowerModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      followers: [],
      alreadySentFollowers: [],
    };

    this.handleSend = this.handleSend.bind(this);
  }

  componentWillMount() {
    ApiWrapper().api().getUsersWhoFollow().then(res => {
      this.setState({ followers: res.data });
    });
  }

  handleSend(userId) {
    const { movieId } = this.props;
    const { alreadySentFollowers } = this.state;

    ApiWrapper().api().prodUser(movieId, userId).then(res => {
      alreadySentFollowers.push(userId);
      this.setState({ alreadySentFollowers });
    });
  }

  renderFollowerResults() {
    const { followers, alreadySentFollowers } = this.state;

    if (followers.length < 1) {
      return <i>{NO_FOLLOWERS}</i>
    }
    
    return followers.map(follower => {
      const userId = follower._id.$oid;

      return (
        <ProdResultItem
          name={follower.name}
          genre={follower.genre}
          photoUrl={follower.photo_url || "https://sites.google.com/a/windermereprep.com/canvas/_/rsrc/1486400406169/home/unknown-user/user-icon.png"}
          userId={userId}
          isAlreadySent={alreadySentFollowers.includes(userId)}
          onClickProd={this.handleSend}
        />
      );
    });
  }

  render() {
    const { onClose } = this.props;

    return (
      <Modal onClose={onClose}>
        <ul>
          {this.renderFollowerResults()}
        </ul>
      </Modal>
    );
  }
}

  export default FollowerModal;
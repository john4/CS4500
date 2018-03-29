import React, { Component } from 'react';
import Modal from '../Modal/Modal';
import ProdResultItem from './ProdResultItem';
import {ApiWrapper} from '../../ApiWrapper';

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
    const { alreadySentFollowers } = this.state;
    debugger;

    alreadySentFollowers.push(userId);
    this.setState({ alreadySentFollowers });
  }

  renderFollowerResults() {
    const { followers, alreadySentFollowers } = this.state;

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
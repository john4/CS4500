import React, { Component } from 'react';
import Modal from '../Modal/Modal';
import FollowerResults from '../FollowerSearch/FollowerResults'

class FollowListModal extends Component {
  render() {
    const { error, followData, onClose } = this.props

    var follows = followData.map(user => {
      return {
        email: user.email,
        genre: user.genre,
        name: user.name,
        photoUrl: user.photo_url || "https://sites.google.com/a/windermereprep.com/canvas/_/rsrc/1486400406169/home/unknown-user/user-icon.png",
        userId: user._id.$oid,
        followMe: user.followMe
      }
    });

    return (
      <Modal onClose={onClose}>
        <ul>
          {follows.length < 1 && error}
          <FollowerResults searchResults={follows} />
        </ul>
      </Modal>
    )
  }
}
export default FollowListModal;
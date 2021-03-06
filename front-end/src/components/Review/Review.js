import React, { Component } from 'react';
import './Review.css';

class Review extends Component {
  renderDelete() {
    const { isUsersReview, onDelete, movieId, reviewId, session } = this.props;

    if (!isUsersReview && !session.isAdmin) {
      return null;
    }

    return (
      <div className="Review-delete" onClick={() => onDelete(movieId, reviewId)}>
        <i class="fas fa-times-circle"></i>
      </div>
    );
  }

  render() {
    const { userName, userId, rating, description } = this.props;

    return (
      <div className="Review">
        {this.renderDelete()}
        <div className="Review-user">
          <a href={`/user/profile/${userId}`}>{userName}</a>
        </div>
        <div className="Review-rating">
          <span>{rating}</span> / 5
        </div>
        <div className="Review-description">
          <i className="fas fa-quote-left"></i>
          <span>{description}</span>
        </div>
      </div>
    );
  }
}

  export default Review;
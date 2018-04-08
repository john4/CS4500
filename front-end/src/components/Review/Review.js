import React, { Component } from 'react';
import './Review.css';

class Review extends Component {
  renderDelete() {
    const { isUsersReview, onDelete, movieId, reviewId } = this.props;

    if (!isUsersReview) {
      return null;
    }

    return (
      <div className="Review-delete" onClick={() => onDelete(movieId, reviewId)}>
        <i class="fas fa-times-circle"></i>
      </div>
    );
  }

  render() {
    const { userName, rating, description } = this.props;
    // <a href={`/user/profile/${userId}`}>{userEmail}</a>
    return (
      <div className="Review">
        {this.renderDelete()}
        <div className="Review-user">

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
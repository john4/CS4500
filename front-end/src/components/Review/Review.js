import React, { Component } from 'react';
import './Review.css';

class Review extends Component {

  renderDelete() {
    const { isUsersReview, onDelete, reviewId } = this.props;

    if (!isUsersReview) {
      return null;
    }

    return (
      <div className="Review-delete" onClick={() => onDelete(reviewId)}>
        <i class="fas fa-times-circle"></i>
      </div>
    );
  }

  render() {
    const { user, rating, description } = this.props;

    return (
      <div className="Review">
        {this.renderDelete()}
        <div className="Review-user">
          {user}
        </div>
        <div className="Review-rating">
          <span>{rating}</span> / 5
        </div>
        <div className="Review-description">
          <i class="fas fa-quote-left"></i>
          <span>{description}</span>
        </div>
      </div>
    );
  }
}

  export default Review;
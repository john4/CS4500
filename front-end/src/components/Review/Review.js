import React, { Component } from 'react';
import './Review.css';

class Review extends Component {

  render() {
    const {user, rating, description} = this.props;

    return (
      <div className="Review">
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
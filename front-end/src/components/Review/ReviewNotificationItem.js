import React, { Component } from 'react';
import Rating from '../Rating/Rating';

class ReviewNotificationItem extends Component {

  render() {
    const { userName, movieTitle, rating, movieId } = this.props;

    const detailURL = '/movie/' + movieId + '/detail/';
    return (
      <div className="pt-2">
        <h5 className="border-top border-dark pt-2">
          {userName} reviewed
          <a href={detailURL} className="pl-1">{movieTitle}</a>
        </h5>
        <Rating isIMDB={false} score={rating} />
      </div>
    );
  }
}

  export default ReviewNotificationItem;
import React, { Component } from 'react';
import { ApiWrapper } from '../../ApiWrapper';
import './Review.css';

class ReviewItem extends Component {
  constructor(props) {
    super(props);
    this.submitReview = this.submitReview.bind(this);
  }

    submitReview() {
      ApiWrapper().api().createMovieReview(this.props.movieId, this.refs.score.value);
    }

    render() {
      return (
        <div className="Review">
          <label for="rating"className="Review-label">Review Score:</label>
          <div className="input-group">
            <input id="rating" type="number" className="form-control" ref="score" min="0" max="5"/>
            <span className="input-group-append">
              <button type="button" className="btn btn-secondary" onClick={this.submitReview}>Post</button>
            </span>
          </div>
        </div>
      );
    }
  }

  export default ReviewItem;
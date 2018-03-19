import React, { Component } from 'react';
import { ApiWrapper } from '../../ApiWrapper';
import './Review.css';

class WriteReview extends Component {
  constructor(props) {
    super(props);
    this.submitReview = this.submitReview.bind(this);
  }

  submitReview() {
    ApiWrapper().api().createMovieReview(this.props.movieId, this.refs.score.value, this.refs.description.value);
  }

  render() {
    return (
      <div className="WriteReview">
        <label for="rating"className="WriteReview-label">Review Score:</label>
        <div className="input-group">
          <input id="rating" type="number" className="form-control" ref="score" min="0" max="5" />
          <input id="description" type="text" className="form-control" ref="description" placeholder="What did you think?" />
          <span className="input-group-append">
            <button type="button" className="btn btn-secondary" onClick={this.submitReview}>Post</button>
          </span>
        </div>
      </div>
    );
  }
}

  export default WriteReview;
import React, { Component } from 'react';
import { ApiWrapper } from '../../ApiWrapper';
import EditableRating from '../Rating/EditableRating';
import './Review.css';

class WriteReview extends Component {
  constructor(props) {
    super(props);
    this.submitReview = this.submitReview.bind(this);
    this.handleScoreUpdate = this.handleScoreUpdate.bind(this);
    this.state = { score: 0 };
  }

  handleScoreUpdate(i) {
    this.setState({score: i});
  }

  submitReview() {
    ApiWrapper().api()
      .createMovieReview(this.props.movieId, this.props.movieTitle, this.state.score, this.refs.description.value)
      .then(res => {
        window.location.reload();
      });
  }

  render() {
    return (
      <div className="WriteReview">
        <label for="rating" className="WriteReview-label">Your review:</label>
        <div className="input-group">
          <EditableRating onScoreClick={this.handleScoreUpdate} score={this.state.score} />
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
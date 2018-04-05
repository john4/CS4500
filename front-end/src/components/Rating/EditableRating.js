import React, { Component } from 'react';
import './Rating.css';

class EditableRating extends Component {
  constructor(props) {
    super(props);
    this.handleScoreClick = this.handleScoreClick.bind(this);
  }

  handleScoreClick(i) {
    this.props.onScoreClick(i);
  }

  render() {
    const { score } = this.props;

    let activeStars = [];

    for (let i = 0; i < 5; i++) {
      const activeClass = i + 1 <= score ? "active" : "";
      activeStars.push(
        <div key={i} onClick={() => this.handleScoreClick(i + 1)} className={`EditableRating-star ${ activeClass }`}>
          <i className="fas fa-star"></i>
        </div>
      );
    }

    return (
      <div className="EditableRating">
        { activeStars }
      </div>
    );
  }
}

  export default EditableRating;
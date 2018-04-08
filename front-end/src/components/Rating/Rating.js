import React, { Component } from 'react';
import './Rating.css';

class Rating extends Component {

  render() {
    const { score, isIMDB } = this.props;

    let activeStars = [];

    for (let i = 0; i < 5; i++) {
      const activeClass = i + 1 <= score ? "active" : "";
      const imdbClass = isIMDB ? "imdb" : "st";
      activeStars.push(
        <div key={i} className={`Rating-star ${ imdbClass } ${ activeClass }`}>
          <i className="fas fa-star"></i>
        </div>
      );
    }

    return (
      <div className="Rating">
        { activeStars }
      </div>
    );
  }
}

  export default Rating;
import React, { Component } from 'react';
import './Rating.css';

class EditableRating extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hoverScore: 0
    };
    this.handleScoreClick = this.handleScoreClick.bind(this);
    this.handleScoreHover = this.handleScoreHover.bind(this);
    this.handleScoreHoverLeave = this.handleScoreHoverLeave.bind(this);
  }

  handleScoreClick(i) {
    this.props.onScoreClick(i);
  }

  handleScoreHover(i) {
    this.setState({hoverScore: i});
  }

  handleScoreHoverLeave() {
    this.setState({hoverScore: 0});
  }

  render() {
    const { score } = this.props;
    const { hoverScore } = this.state;

    let activeStars = [];

    for (let i = 0; i < 5; i++) {
      const activeClass = i + 1 <= score ? "active" : "";
      const hoverClass = i + 1 <= hoverScore ? "hoverActive" : "";
      activeStars.push(
        <div
          key={i}
          onClick={() => this.handleScoreClick(i + 1)}
          onMouseEnter={() => this.handleScoreHover(i + 1)}
          className={`EditableRating-star ${ hoverClass } ${ activeClass }`}
        >
          <i className="fas fa-star"></i>
        </div>
      );
    }

    return (
      <div onMouseLeave={this.handleScoreHoverLeave} className="EditableRating">
        { activeStars }
      </div>
    );
  }
}

  export default EditableRating;
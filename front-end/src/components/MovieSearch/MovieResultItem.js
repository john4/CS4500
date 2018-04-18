import React, { Component } from 'react';
import './ResultItem.css';

class MovieResultItem extends Component {
    render() {
      const detailURL = '/movie/' + this.props.id + '/detail/';
      return (
        <li className="ResultItem">
          <div><a href={detailURL}><img alt="" className="ResultItem-img" src={this.props.posterSrc} href="#"/></a></div>
          <div className="ResultItem-body">
            <h3>{this.props.title}</h3>
            <div><strong>Rating: {this.props.average} / 10</strong></div>
            <div>{this.props.overview}</div>
          </div>
        </li>
      );
    }
  }

  export default MovieResultItem;
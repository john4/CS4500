import React, { Component } from 'react';
import './ResultItem.css';

class FollowerResultItem extends Component {
    render() {
      return (
        <li className="ResultItem">
          <div><a href={detailURL}><img className="ResultItem-img" src={this.props.posterSrc} href="#"/></a></div>
          <div className="ResultItem-body">
            <h3>{this.props.title}</h3>
            <div><strong>Rating: {this.props.average} / 10</strong></div>
            <div>{this.props.overview}</div>
          </div>
          <div> Id: {this.props.id}</div>
        </li>
      );
    }
  }

  export default FollowerResultItem;
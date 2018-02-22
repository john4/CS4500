import React, { Component } from 'react';

class ResultItem extends Component {
    render() {
      return <li>
        <h1>{this.props.trackName}</h1>
        <img src={this.props.posterSrc} width="100px"/>
        <div>{this.props.overview}</div>
        </li>;
    }
  }
  
  export default ResultItem;
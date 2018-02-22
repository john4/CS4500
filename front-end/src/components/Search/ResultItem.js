import React, { Component } from 'react';

class ResultItem extends Component {
    render() {
      return <li>
        <h3>{this.props.title}</h3>
        <img src={this.props.posterSrc} width="100px"/>
        <div>{this.props.overview}</div>
        </li>;
    }
  }
  
  export default ResultItem;
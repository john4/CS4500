import React, { Component } from 'react';

class DetailResultItem extends Component {
    render() {
      return <li>
        <h3>{this.props.title}</h3>
        <div> Id: {this.props.id}</div>   
        <img src={this.props.posterSrc} width="100px"/>
        <div>{this.props.overview}</div>
        <div><strong>Rating: {this.props.average} / 10</strong></div>
        </li>;
    }
  }
  
  export default ResultItem;
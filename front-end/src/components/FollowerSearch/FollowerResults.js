import React, { Component } from 'react';
import FollowerResultItem from './FollowerResultItem';
// import './Results.css';

class FollowerResults extends Component {
  render() {
    const { searchResults } = this.props;

    return (
      <ul>
        {searchResults.map(result => {
          return <FollowerResultItem { ...result } onClickFollow={this.handleFollow} />;
        })}
      </ul>
    );
  }
}

export default FollowerResults;
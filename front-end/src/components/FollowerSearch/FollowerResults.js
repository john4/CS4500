import React, { Component } from 'react';
import FollowerResultItem from './FollowerResultItem';

class FollowerResults extends Component {
  render() {
    const { searchResults } = this.props;
    return (
      <ul>
        {searchResults.map(result => {
          return <FollowerResultItem { ...result } />;
        })}
      </ul>
    );
  }
}

export default FollowerResults;
import React, { Component } from 'react';
import FollowerResultItem from './FollowerResultItem';

class FollowerResults extends Component {
  render() {
    const { searchResults } = this.props;

    if (searchResults.length > 0) {
      return (
        <ul>
          {searchResults.map(result => {
            return <FollowerResultItem { ...result } />;
          })}
        </ul>
      );
    } else {
      return (
        <div className="px-4">
          <i>No users found with that name.</i>
        </div>
      )
    }

  }
}

export default FollowerResults;
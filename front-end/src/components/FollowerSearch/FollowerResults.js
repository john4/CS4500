import React, { Component } from 'react';
import FollowerResultItem from './FollowerResultItem';
import { ApiWrapper } from '../../ApiWrapper';

class FollowerResults extends Component {
  handleFollow(userId) {
    ApiWrapper().api().followUser(userId);
  }

  render() {
    const { searchResults } = this.props;
    if (searchResults.length > 0) {
      return (
        <ul>
          {searchResults.map(result => {
            return <FollowerResultItem { ...result } onClickFollow={this.handleFollow} />;
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
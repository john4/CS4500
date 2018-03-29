import React, { Component } from 'react';
import FollowerResultItem from './FollowerResultItem';
import { ApiWrapper } from '../../ApiWrapper';

class FollowerResults extends Component {
  handleFollow(userId) {
    ApiWrapper().api().followUser(userId);
  }

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
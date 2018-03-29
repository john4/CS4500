import React, { Component } from 'react';
import Results from '../MovieSearch/MovieResults';

class Playlist extends Component {
  render() {
    return (
      <div>
        <Results searchResults={this.props.playlist} />
      </div>
      );
  } 
}
export default Playlist;
import React, { Component } from 'react';
import GenrePlaylist from './GenrePlaylist';
import GENRES from '../../Genres'
import { ApiWrapper } from '../../ApiWrapper.js';

class Genre extends Component {

  constructor(props) {
    super(props);
    this.state = {
      genre: ''
    };
    this.receiveDetails = this.receiveDetails.bind(this)
  }

  receiveDetails(res) {
    this.setState({
      genre: res.data.genre
    })
  }

  componentWillMount() {
    ApiWrapper().api().getAccountDetails().then(this.receiveDetails);
  }

  render() {
    var gen = this.state.genre;
    if (this.props.name === '') {
      return "Must be logged in to view recommendations"
    } else if (gen) {
      return <div>
      <h1>Playlist based on your favorite genre, {gen}</h1>
      <GenrePlaylist genreID={GENRES[gen]} />
    </div>
    }
    else
      return "No playlist available for your favorite genre"
  }
}
export default Genre;
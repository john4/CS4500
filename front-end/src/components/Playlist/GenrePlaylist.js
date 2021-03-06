import React, { Component } from 'react';
import axios from 'axios';
import Playlist from './Playlist'

class GenrePlaylist extends Component {

  constructor(props) {
    super(props);
    this.state = {
      playlist: []
    };
  }

  getResults(response) {
    this.setState({
      playlist: response.results
    })
  }

  componentWillMount() {
    var url = "https://api.themoviedb.org/3/genre/" + this.props.genreID + "/movies?api_key=" + process.env.REACT_APP_TMDB_API_KEY + "&language=en-US&include_adult=false&sort_by=created_at.asc"
    axios.get(url)
      .then(res => {
        const response = res.data;
        this.getResults(response);
      })
  }

  render() {
    return (
      <div>
        <Playlist playlist={this.state.playlist} />
      </div>
      );
  } 
}
export default GenrePlaylist;
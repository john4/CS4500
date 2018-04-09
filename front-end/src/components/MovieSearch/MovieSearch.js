import React, { Component } from 'react';
import Search from '../Search/Search';
import MovieResults from './MovieResults'
import axios from 'axios';
import { NO_MOVIE_RESULTS } from '../../Errors'


class MovieSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      results: [],
      error: ""
    };
    this.receiveResults = this.receiveResults.bind(this);
    this.search = this.search.bind(this);
  }

  search(query) {
    const url = 'http://api.themoviedb.org/3/search/movie?include_adult=false&page=1&language=en-US&api_key='+ process.env.REACT_APP_TMDB_API_KEY + '&query=' + query;
    axios.get(url)
      .then(this.receiveResults)
  }

  receiveResults(res) {
    const results = res.data.results;
    this.setState({results});
    this.setState({error: ''})
    if (res.data.total_results === 0) {
      this.setState({error: NO_MOVIE_RESULTS})
    }
  }

  render() {
    const {results, error} = this.state;

    return (
      <Search onSearch={this.search} results={results} ResultsComponent={MovieResults} error={error} />
    );
  }
}


export default MovieSearch;

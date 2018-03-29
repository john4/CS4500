import React, { Component } from 'react';
import Search from '../Search/Search';
import MovieResults from './MovieResults'
import axios from 'axios';


class MovieSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      results: []
    };
    this.receiveResults = this.receiveResults.bind(this);
    this.search = this.search.bind(this);
  }

  search(query) {
    const url = 'http://api.themoviedb.org/3/search/movie?include_adult=false&page=1&language=en-US&api_key=020a1282ad51b08df67da919fca9f44e&query=' + query;
    axios.get(url).then(this.receiveResults)
  }

  receiveResults(res) {
    const results = res.data.results;
    this.setState({results});
  }

  render() {
    const {results} = this.state;

    return (
      <Search onSearch={this.search} results={results} ResultsComponent={MovieResults} />
    );
  }
}


export default MovieSearch;

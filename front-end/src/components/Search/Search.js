import React, { Component } from 'react';
import axios from 'axios';
import SearchBox from './SearchBox';
import Results from './Results';


class Search extends Component {

  constructor(props) {
    super(props);
    this.state = {
      searchResults: []
    };
    this.showResults = this.showResults.bind(this);
    this.search = this.search.bind(this);
  }

  showResults(response) {
    this.setState({
        searchResults: response.results
    })
  }

  search(URL) {
    axios.get(URL)
    .then(res => {
      const response = res.data;
      this.showResults(response);
    })
  }

  render() {
    return (
      <div>
          <SearchBox search={this.search} />
          <Results searchResults={this.state.searchResults} />
      </div>
    );
  }
}


export default Search;

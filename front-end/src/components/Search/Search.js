import React, { Component } from 'react';
import axios from 'axios';
import SearchBox from './SearchBox';


class Search extends Component {
  render() {
    const {onSearch, results, ResultsComponent} = this.props;

    return (
      <div>
        <SearchBox onSearch={onSearch} />
        <ResultsComponent searchResults={results} />
      </div>
    );
  }
}


export default Search;

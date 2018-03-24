import React, { Component } from 'react';
import axios from 'axios';
import SearchBox from './SearchBox';
import Results from './Results';


class Search extends Component {
  render() {
    const {onSearch, results} = this.props;

    return (
      <div>
        <SearchBox onSearch={onSearch} />
        <Results searchResults={results} />
      </div>
    );
  }
}


export default Search;

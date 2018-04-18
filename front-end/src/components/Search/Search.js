import React, { Component } from 'react';
import SearchBox from './SearchBox';


class Search extends Component {
  render() {
    const {onSearch, results, ResultsComponent, placeholder, error} = this.props;

    return (
      <div className="container">
        <SearchBox onSearch={onSearch} placeholder={placeholder} />
        <div className="px-4">
          <i>{error}</i>
        </div>
        <ResultsComponent searchResults={results} error={error}/>
      </div>
    );
  }
}


export default Search;

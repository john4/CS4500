import React, { Component } from 'react';
import ResultItem from './ResultItem';

class Results extends Component {

    render() {
      const resultItems = this.props.searchResults.map(function(result) {
        const posterSrc = "https://image.tmdb.org/t/p/w200" + result.poster_path;
        return <ResultItem 
                  key={result.poster_path} 
                  title={result.title} 
                  posterSrc={posterSrc} 
                  overview={result.overview}  />
      });
  
    return(
          <ul>
              {resultItems}
          </ul>           
      );
    }
  }

  export default Results;
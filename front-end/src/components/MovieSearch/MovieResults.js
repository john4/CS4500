import React, { Component } from 'react';
import MovieResultItem from './MovieResultItem';
import './Results.css';

class MovieResults extends Component {

    render() {
      const resultItems = this.props.searchResults.map(function(result) {
        const posterSrc = "https://image.tmdb.org/t/p/w200" + result.poster_path;
        return <MovieResultItem
                  key={result.poster_path}
                  title={result.title}
                  id={result.id}
                  posterSrc={posterSrc}
                  overview={result.overview}
                  average={result.vote_average}  />
      });

    return (
      <ul>
        {resultItems}
      </ul>
      );
    }
}

export default MovieResults;
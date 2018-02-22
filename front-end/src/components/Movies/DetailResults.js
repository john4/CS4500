import React, { Component } from 'react';

class DetailResults extends Component {
	
	render() {
		
		const resultItems = this.props.detailResults.map(function(result) {
			const posterSrc = "https://image.tmdb.org/t/p/w200" + result.poster_path;
			return <ResultItem 
					  key={result.poster_path} 
					  title={result.title} 
					  posterSrc={posterSrc} 
					  overview={result.overview}  />
		});
		
		return (
			<ul> 
				{resultItems}
			<ul/>
	}
}
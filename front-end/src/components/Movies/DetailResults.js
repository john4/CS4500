import React, { Component } from 'react';
import DetailResultItem from './DetailResultItem.js'

class DetailResults extends Component {
	
	render() {
		const result = this.props.detailResults
		
		const posterSrc = "https://image.tmdb.org/t/p/w200" + result.poster_path;
		
		return <ul> 
				<DetailResultItem 
					  key={result.poster_path} 
					  title={result.title}
					  id={result.id} 
					  posterSrc={posterSrc} 
					  overview={result.overview}
					  average={result.vote_average} 
					  production_countries={result.production_countries}
					  production_companies={result.production_companies}
					  release_date={result.release_date}
					  length={result.runtime}
					  tagline={result.tagline}
					  genres={result.genres}/>
				</ul>
	}
}

export default DetailResults
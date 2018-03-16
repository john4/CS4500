import React, { Component } from 'react';
import DetailResults from './DetailResults.js'
import Review from '../Review/Review.js';
import axios from 'axios';
import { ApiWrapper } from '../../ApiWrapper';


class Details extends Component {

	constructor(props) {
		super(props);
		this.state = {};
		this.URL      = 'http://ec2-54-87-191-69.compute-1.amazonaws.com:5000/movies/details/' + this.props.match.params.tmdbid
	}

	componentWillMount() {
		this.getDetails(this.URL);
		this.getAverageRating();
	}

	getDetails(URL) {
		axios.get(URL)
		.then( res => {
			const response = res.data;
			this.setState({ ...response });
		});
	}

	getAverageRating() {
		ApiWrapper().api().getAverageMovieRating(this.props.match.params.tmdbid).then(res => {
			this.setState({
				averageRating: res.data
			});
		});
	}

	render() {

		return (
			<div>
				<DetailResults {...this.state}/>
				<Review movieId={this.state.id}/>
			</div>
		);
	}
}

export default Details
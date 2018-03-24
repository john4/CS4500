import React, { Component } from 'react';
import DetailResults from './DetailResults.js'
import WriteReview from '../Review/WriteReview.js';
import Review from '../Review/Review.js';
import axios from 'axios';
import { ApiWrapper } from '../../ApiWrapper';


class Details extends Component {

	constructor(props) {
		super(props);
		this.state = {};
		this.URL      = 'http://ec2-54-87-191-69.compute-1.amazonaws.com:5000/movie/' + this.props.match.params.tmdbid + '/detail/';
	}

	componentWillMount() {
		this.getDetails(this.URL);
    this.getAverageRating();
		this.getReviews();
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
				averageRating: res.data.avg_rating
			});
		});
	}

	getReviews() {
		const { userEmail } = ApiWrapper().api().getSession();

		ApiWrapper().api().getReviews(this.props.match.params.tmdbid).then(res => {
			this.setState({
				reviews: res.data.map(review => {
					return {
						description: review.description,
						rating: review.rating,
						tmdbId: review.tmdb_id,
						reviewId: review._id.$oid,
						userEmail: review.user_email,
						isUsersReview: userEmail == review.user_email,
					};
				})
			});
		})
	}

	renderReviews() {
		const { reviews } = this.state;

		if (!reviews) {
			return null;
		}

		return reviews.map(review => {
			return <Review { ...review } movieId={this.props.match.params.tmdbid} onDelete={ ApiWrapper().api().deleteReview } />;
		});
	}

	render() {

		return (
			<div>
				<DetailResults {...this.state}/>
				<WriteReview movieId={this.state.id}/>
				{this.renderReviews()}
			</div>
		);
	}
}

export default Details
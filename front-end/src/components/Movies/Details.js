import React, { Component } from 'react';
import DetailResults from './DetailResults.js'
import WriteReview from '../Review/WriteReview.js';
import Review from '../Review/Review.js';
import FollowerModal from '../FollowerModal/FollowerModal';
import axios from 'axios';
import { ApiWrapper } from '../../ApiWrapper';


class Details extends Component {

	constructor(props) {
		super(props);
		this.state = {
			referPanelOpen: false,
			reviews: [],
    };

		this.URL      = 'http://ec2-54-87-191-69.compute-1.amazonaws.com:5000/movie/' + this.props.match.params.tmdbid + '/detail/';
		this.handleCloseReferPanel = this.handleCloseReferPanel.bind(this);
		this.handleOpenReferPanel = this.handleOpenReferPanel.bind(this);
	}

	componentWillMount() {
		this.getDetails(this.URL);
    this.getAverageRating();
		this.getReviews();
	}

	handleCloseReferPanel() {
		this.setState({ referPanelOpen: false });
	}

	handleOpenReferPanel() {
		this.setState({ referPanelOpen: true });
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
		const { userId, email } = ApiWrapper().getSession();

		ApiWrapper().api().getReviews(this.props.match.params.tmdbid).then(res => {
			this.setState({
				reviews: res.data.map(review => {
					return {
						description: review.description,
						rating: review.rating,
						tmdbId: review.tmdb_id,
						reviewId: review._id.$oid,
            userId: review.user_id,
            userName: review.user_name,
						isUsersReview: userId == review.user_id,
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
    const { referPanelOpen } = this.state;
		return (
			<div>
				{referPanelOpen &&
					<FollowerModal
						movieId={this.props.match.params.tmdbid}
						onClose={this.handleCloseReferPanel}
					/>
				}
				<DetailResults {...this.state}/>
				<button type="button" className="btn btn-secondary" onClick={this.handleOpenReferPanel}>Refer a follower</button>
				<WriteReview movieId={this.state.id} movieTitle={this.state.original_title} />
				{this.renderReviews()}
			</div>
		);
	}
}

export default Details
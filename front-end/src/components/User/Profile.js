import React, { Component } from 'react';
import axios from 'axios';
import ProfileDetails from './Profile-Details.js';
import ProfileDetailsEdit from './Profile-Details-Edit.js';
import GENRES from '../../Genres'
import { ApiWrapper } from '../../ApiWrapper';
import './Profile.css';
import PromoteAdmin from './PromoteAdmin';
import ReviewNotificationItem from '../Review/ReviewNotificationItem';
import { INVALID_LINK, OOPS } from '../../Errors.js';

const defaultAvatar = "https://sites.google.com/a/windermereprep.com/canvas/_/rsrc/1486400406169/home/unknown-user/user-icon.png"

class Profile extends Component {

	constructor(props) {
		super(props);

		this.state = {
			genre: '',
			isOwnAccount: this.props.match.params.userId ? false : true,
			editMode: false,
			session: {},
			recentReviews: [],
			name: '',
			email: '',
			age: 18,
			avatar: defaultAvatar,
			isAdmin: false,
            error: ''
		};

		this.handleEditClick = this.handleEditClick.bind(this);
		this.handleSubmitClick = this.handleSubmitClick.bind(this);
		this.handleCancelClick = this.handleCancelClick.bind(this);
		this.handleRecentReviews = this.handleRecentReviews.bind(this);
		this.deleteAccount = this.deleteAccount.bind(this);
		this.updateName = this.updateName.bind(this);
		this.updateEmail = this.updateEmail.bind(this);
		this.updateAvatar = this.updateAvatar.bind(this);
		this.updateGenre = this.updateGenre.bind(this);
	}

	componentWillMount() {
		const session = ApiWrapper().getSession();
		const api = ApiWrapper().api();

		if (this.props.match.params.userId &&
				this.props.match.params.userId !== session.userId) {
			api.getUserDetails(this.props.match.params.userId).then(res => {
				this.setState({
					isOwnAccount: false,
					...this.getUserInformation(res.data),
					session,
				});
				this.getUserReviews(this.props.match.params.userId);
			});
		} else {
			api.getAccountDetails().then(res => {
				this.setState({
					isOwnAccount: true,
					...this.getUserInformation(res.data),
					session,
				});
				this.getUserReviews(session.userId);
			});
		}
	}

	getUserInformation(response) {
		return {
			name: response.name,
			email: response.email,
			age: response.age,
			genre: response.genre,
			avatar: response.photo_url ? response.photo_url : defaultAvatar,
			isAdmin: response.isAdmin
		};
	}

	getUserReviews(userId) {
		ApiWrapper().api().getUserReviews(userId).then(res => {
			this.handleRecentReviews(res.data);
		});
	}

	handleRecentReviews(results) {
    this.setState({recentReviews: results.splice(0, 12)});
  }

	handleEditClick() {
		this.setState({editMode:true})
	}

	handleSubmitClick() {
		const { name, email, age, avatar, genre } = this.state
		var data = {
			name: name,
			email: email,
			age: age,
			photoUrl: avatar,
			genre: genre
		}
        
        axios.get(avatar).then(success => {
                ApiWrapper().api().updateUser(data).then(res => {
                    this.setState({editMode: false});
                    this.setState({error: ''})
                }).catch(error => {
                  this.setState({error: INVALID_LINK})
                });
			}).catch(error => {
                this.setState({error: INVALID_LINK})
			});
	}

	handleCancelClick(){
		const { userId } = this.props.match.params
		const { session } = this.state

		ApiWrapper().api().getUserDetails(userId || session.userId).then(res => {
			this.setState({
				...this.getUserInformation(res.data),
				editMode: false,
                error: ''
			})
		})
	}

	updateGenre(value){
		this.setState({ genre: value.target.value })
	}

	updateName(value){
		this.setState({ name: value })
	}

	updateEmail(value){
		this.setState({ email: value })
	}

	updateAvatar(value){
		var update = false;
        
        if(value.includes("http") || (value.length > 5)){
            axios.get(value)
                .then(success => {
                    this.setState({avatar: value});
                }).catch(error => {
                    this.setState({error: INVALID_LINK})
                });
        }
	}

	deleteAccount(){
		const { session } = this.state
		const { userId } = this.props.match.params
		if(window.confirm("Are you sure you want to delete your account?")) {
			var data = {
				user_id: userId || session.userId,
				session_id: session.sessionId
			}
			ApiWrapper().api().deleteAccount(data).then(res => {
				window.location = "/"
			})
			.catch(error => {
				this.setState({error: OOPS + "unable to delete account"})
			})
		}
	}

	renderOptions() {
        var opts = []
        for (var genre in GENRES) {
            opts.push(<option value={genre} >{genre}</option>)
        }
        return opts
    }

	renderDetails() {
		const { genre, avatar, isOwnAccount, session, editMode } = this.state;

		if (editMode) {
			return (
			<div id="DetailsEdit">
				<ProfileDetailsEdit details={this.state.avatar} handleChange={this.updateAvatar} what={"Avatar"}/>
				<ProfileDetailsEdit details={this.state.name} handleChange={this.updateName} what={"Name"}/>
				<span className="row">Email: {this.state.email}</span>
				<div className="row">
					<span>Genre: </span>
					<select name="genre" value={genre} onChange={this.updateGenre} required>
						<option value="" disabled>Choose your favorite Genre</option>
						{this.renderOptions()}
					</select>
				</div>
				<div className="row">
					<button className="btn btn-secondary" onClick={this.handleSubmitClick}>Save Changes</button>
					<button className="btn btn-secondary" onClick={this.handleCancelClick}>Cancel</button>
				</div>
			</div>
			);
		}
		return (
			<div>
				<ProfileDetails details={this.state} />
				{(isOwnAccount || session.isAdmin) && (
					<div className="row">
						<button className="btn btn-secondary" onClick={this.handleEditClick}>Edit Profile</button>
						<button className="btn btn-secondary" onClick={this.deleteAccount}>Delete Account</button>
					</div>
				)}
			</div>
		)
	}

	renderReviews() {
		return this.state.recentReviews.map((result) =>
      <ReviewNotificationItem
        userName={result.user_name}
        movieTitle={result.movie_title}
        movieId={result.tmdb_id}
        rating={result.rating}
      />
    );
	}

	render() {
		const { name, isOwnAccount, session, avatar, isAdmin } = this.state
		const { userId } = this.props.match.params
		return (
			<div className="container">
				<div className="row" style={{paddingTop: "1rem"}}>
					<div className="col-4">
                        <div>
                            <i>{this.state.error}</i>
                        </div>
						<img className="avatar" src={avatar}  />
						{this.renderDetails()}
						<PromoteAdmin userId={userId || session.userId} session={session} userIsAdmin={isAdmin}/>
					</div>
					<div className="col-8">
						<h3>Recent reviews by {name}</h3>
						{this.renderReviews()}
					</div>
				</div>
			</div>
		)
	}
}

export default Profile;
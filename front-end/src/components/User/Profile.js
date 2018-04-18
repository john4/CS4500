import React, { Component } from 'react';
import axios from 'axios';
import ProfileDetails from './Profile-Details.js';
import ProfileDetailsEdit from './Profile-Details-Edit.js';
import GENRES from '../../Genres'
import { ApiWrapper } from '../../ApiWrapper';
import './Profile.css';
import PromoteAdmin from './PromoteAdmin';
import ReviewNotificationItem from '../Review/ReviewNotificationItem';
import { NO_FOLLOWERS, NO_FOLLOWING, NO_FOLLOWERS_OTHER, NO_FOLLOWING_OTHER, NO_RECENT_REVIEWS, INVALID_LINK, OOPS } from '../../Errors.js';
import FollowListModal from '../FollowerModal/FollowListModal.js';

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
      error: '',
			followerPanelOpen: false,
			followingPanelOpen: false,
			followers: [],
			following: [],
		};

		this.handleEditClick = this.handleEditClick.bind(this);
		this.handleSubmitClick = this.handleSubmitClick.bind(this);
		this.handleCancelClick = this.handleCancelClick.bind(this);
		this.handleRecentReviews = this.handleRecentReviews.bind(this);
		this.viewFollowers = this.viewFollowers.bind(this);
		this.viewFollowing = this.viewFollowing.bind(this);
		this.onClose = this.onClose.bind(this);
		this.deleteAccount = this.deleteAccount.bind(this);
		this.updateName = this.updateName.bind(this);
		this.updateEmail = this.updateEmail.bind(this);
		this.updateAvatar = this.updateAvatar.bind(this);
		this.updateGenre = this.updateGenre.bind(this);
	}

	componentWillMount() {
		const session = ApiWrapper().getSession();
		const api = ApiWrapper().api();
		const { userId } = this.props.match.params

		const profileUserId = userId || session.userId

		this.getFollowing(profileUserId)
		this.getFollowers(profileUserId)

		api.getUserDetails(profileUserId).then(res => {
				this.setState({
					isOwnAccount: (profileUserId === session.userId),
					...this.getUserInformation(res.data),
					session,
				});
				this.getUserReviews(profileUserId);
		});
	}

	getFollowing(userId) {
		ApiWrapper().api().getUsersWhoAreFollowed(userId).then(res => {
			this.setState({
				following: res.data
			})
		})
	}
	getFollowers(userId) {
		ApiWrapper().api().getUsersWhoFollow(userId).then(res => {
			this.setState({
				followers: res.data
			})
		})
	}

	getUserInformation(response) {
		return {
			name: response.name,
			email: response.email,
			age: response.age,
			genre: response.genre,
			avatar: response.photo_url ? response.photo_url : defaultAvatar,
			isAdmin: response.isAdmin,
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
                this.setState({error: ''});
                localStorage.setItem("st:photo_url", data.photoUrl);
                window.location.reload();
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
    if(value.includes("http") && (value.length > 5)){
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

	onClose() {
		this.setState({
			followersPanelOpen: false,
			followingPanelOpen: false
		})
	}

	viewFollowers() {
		this.setState({
			followersPanelOpen: true
		})
	}

	viewFollowing() {
		this.setState({
			followingPanelOpen: true
		})
	}

	renderOptions() {
        var opts = []
        for (var genre in GENRES) {
            opts.push(<option value={genre} >{genre}</option>)
        }
        return opts
    }

	renderDetails() {
		const { genre, isOwnAccount, session, editMode, isAdmin } = this.state;
		const { userId } = this.props.match.params

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
				<ProfileDetails details={this.state} viewFollowers={this.viewFollowers} viewFollowing={this.viewFollowing}/>
				{(isOwnAccount || session.isAdmin) && (
					<div className="row">
						<button className="btn btn-secondary" onClick={this.handleEditClick}>Edit Profile</button>
						<button className="btn btn-secondary" onClick={this.deleteAccount}>Delete Account</button>
						{session.isAdmin &&
							<PromoteAdmin userId={userId || session.userId} session={session} userIsAdmin={isAdmin}/>}
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
		const { name, isOwnAccount, avatar, followingPanelOpen, followersPanelOpen,
			recentReviews, followers, following } = this.state

		return (
			<div className="container">
				{followersPanelOpen &&
					<FollowListModal
						followData={followers}
						error={isOwnAccount ? NO_FOLLOWERS : NO_FOLLOWERS_OTHER}
						onClose={this.onClose} />}
				{followingPanelOpen &&
					<FollowListModal
						followData={following}
						error={isOwnAccount ? NO_FOLLOWING : NO_FOLLOWING_OTHER}
						onClose={this.onClose} />}
				<div className="row" style={{paddingTop: "1rem"}}>
					<div className="col-4">
                        <div>
                            <i>{this.state.error}</i>
                        </div>
						<img alt="" className="avatar" src={avatar}  />
						{this.renderDetails()}
					</div>
					<div className="col-8">
						<h3>Recent reviews by {name}</h3>
						<i>{recentReviews.length < 1 && NO_RECENT_REVIEWS}</i>
						{this.renderReviews()}
					</div>
				</div>
			</div>
		)
	}
}

export default Profile;
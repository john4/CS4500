import React, { Component } from 'react';
import axios from 'axios';
import ProfileDetails from './Profile-Details.js';
import ProfileDetailsEdit from './Profile-Details-Edit.js';
import GENRES from '../../Genres'
import { ApiWrapper } from '../../ApiWrapper';
import './Profile.css';

const defaultAvatar = "https://sites.google.com/a/windermereprep.com/canvas/_/rsrc/1486400406169/home/unknown-user/user-icon.png"

class Profile extends Component {

	constructor(props) {
		super(props);

		this.state = {
			genre: '',
			isOwnAccount: this.props.match.params.userId ? false : true,
			editMode: false
		};

		this.handleEditClick = this.handleEditClick.bind(this);
		this.handleSubmitClick = this.handleSubmitClick.bind(this);
		this.handleCancelClick = this.handleCancelClick.bind(this);
		this.renderOptions = this.renderOptions.bind(this);
		this.deleteAccount = this.deleteAccount.bind(this);
		this.updateName = this.updateName.bind(this);
		this.updateEmail = this.updateEmail.bind(this);
		this.updateAge = this.updateAge.bind(this);
		this.updateAvatar = this.updateAvatar.bind(this);
		this.updateGenre = this.updateGenre.bind(this);
		this.api = ApiWrapper().api()
		this.getUserInformation = this.getUserInformation.bind(this)
		this.previousDetails = {}
	}

	componentWillMount() {
		const { userId } = ApiWrapper().getSession();
		const api = ApiWrapper().api();

		if (this.props.match.params.userId &&
				this.props.match.params.userId !== userId) {
			api.getUserDetails(this.props.match.params.userId).then(res => {
				this.setState({
					isOwnAccount: false,
					...this.getUserInformation(res.data),
				});
			});
		} else {
			api.getAccountDetails().then(res => {
				this.setState({
					isOwnAccount: true,
					...this.getUserInformation(res.data),
				});
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
		};
	}

	handleEditClick() {
		this.setState({editMode:true})
	}

	handleSubmitClick() {
		this.setState({
					editMode: false})

		var data = {
			name: this.state.name,
			email: this.state.email,
			age: this.state.age,
			photoUrl: this.state.avatar,
			genre: this.state.genre
		}

		ApiWrapper().api().updateUser(data)
	}

	handleCancelClick(){
		this.setState({
            name: this.previousDetails.name,
			email: this.previousDetails.email,
			age: this.previousDetails.age,
			genre: this.previousDetails.genre,
			avatar: this.previousDetails.photo_url,
			editMode: false
		})
	}

	updateGenre(value){
		this.setState({ genre: value.target.value })
	}

	updateName(value){
		this.setState({ name: value })
	}

	updateEmail(value){
		this.setState({ email: value})
	}

	updateAge(value){
		this.setState({age: value})
	}

	updateAvatar(value){
		var update = false;
		axios.get(value)
			.then(success => {
				this.setState({avatar: value})
			}).catch(error => {
				console.log("Error updating avatar")
			})
	}

	deleteAccount(){
		var data = {email: this.state.email}
		ApiWrapper().api().post("/user/delete/", data).then(res => {
			window.location = "/register"
		})
		.catch(error => {
			console.log(error.data)
		})
	}

	renderOptions() {
        var opts = []
        for (var genre in GENRES) {
            opts.push(<option value={genre} >{genre}</option>)
        }
        return opts
    }


	render() {
		const { genre, avatar, isOwnAccount } = this.state;

		const details = this.state.editMode ? (
			<div id="DetailsEdit">
				<ProfileDetailsEdit details={this.state.name} handleChange={this.updateName} what={"Name"}/>
				<span className="row">Email: {this.state.email}</span>
				<ProfileDetailsEdit details={this.state.avatar} handleChange={this.updateAvatar} what={"Avatar"}/>
				<div className="row">
					<span>Genre: </span>
					<select name="genre" value={genre} onChange={this.updateGenre} required>
						<option value="" disabled>Choose your favorite Genre</option>
						{this.renderOptions()}
					</select>
				</div>
				<button className="btn-sm" onClick={this.handleCancelClick}>
					<i class="fas fa-ban"></i>
				</button>
			</div>
		): (
			 <ProfileDetails details={this.state} />
			);

		return (
			<div className="container">
				<div className="row">
					<img className="avatar" src={this.state.avatar}  />
				</div>
				{details}
				{isOwnAccount && (
					<div className="row">
						<button className="btn-sm" onClick={this.handleEditClick}>
							<i className="fas fa-edit"></i>
						</button>
						<button className="btn-sm" onClick={this.handleSubmitClick}>
							<i className="fas fa-check-square"></i>
						</button>
						<button className="btn-sm" onClick={() => { if(window.confirm("Are you sure you want to delete your account?")){this.deleteAccount}}}>
							<i className="fas fa-trash"></i>
						</button>
					</div>
				)}
			</div>
		)
	}
}

export default Profile;
import React, { Component } from 'react';
import axios from 'axios';
import ProfileDetails from './Profile-Details.js';
import ProfileDetailsEdit from './Profile-Details-Edit.js';
import { ApiWrapper } from '../../ApiWrapper';
import './Profile.css';



class Profile extends Component {
	
	constructor(props) {
		super(props);
		
		this.state = {
			name: "Test Tester",
			email: "test@testing.com",
			age: "2000",
			genre: [],
			avatar: "http://www.investordictionary.com/media/avatars/images/default/large-user-avatar.png",
			editMode: false
		};
		
		this.handleEditClick = this.handleEditClick.bind(this);
		this.handleSubmitClick = this.handleSubmitClick.bind(this);
		this.updateName = this.updateName.bind(this);
		this.updateEmail = this.updateEmail.bind(this);
		this.updateAge = this.updateAge.bind(this);
		this.updateAvatar = this.updateAvatar.bind(this);
		this.api = ApiWrapper().api()
	}
	
	getUserInformation(){
		this.api.getAccountDetails().then(response => {
			if(response){
				this.setState({
					name: response.name,
					email: response.email,
					
				})
			}
		})
	}
	
	handleEditClick() {
		console.log(this.state.editMode)
		this.setState({editMode:true})
	}
	
	handleSubmitClick(name, email, age) {
		this.setState({editMode: false})
		//Shoot stuff to api I haven't written yet
	}
	
	handleCancelClick(){
		this.editMode({editMode: false})
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
				if(error.response){
					console.log("Error updating avatar: URL not available")
				}
			})
	}
	
	deleteAccount(){
		axios.post(URL)
			.then(res => {
			  const response = res.data;
			  this.showResults(response);
			})
	}

	render() {
		
		const details = this.state.editMode ? (
			
			<div id="DetailsEdit">
			<ProfileDetailsEdit details={this.state.name} handleChange={this.updateName} />
	<span>{this.state.email}</span>
	<ProfileDetailsEdit details={this.state.age} handleChange={this.updateAge} />
	<ProfileDetailsEdit details={this.state.avatar} handleChange={this.updateAvatar} />
		</div> ): (
			 <ProfileDetails details={this.state} /> );
			 
		const avatar = this.state.avatar
		
		return ( 
			<div className="container">
				<div className="row">
					<img className="avatar" src={this.state.avatar}  />
				</div>
					{details}
				<div className="row">
					<button className="btn-sm" onClick={this.handleEditClick}> 
						<i className="fas fa-edit"></i> 
					</button>
					<button className="btn-sm" onClick={this.handleSubmitClick}>
						<i className="fas fa-check-square"></i>
					</button>
					<button className="btn-sm" onClick={this.deleteAccount}>
						<i className="fas fa-trash"></i>
					</button>
				</div>
			</div>
		)
		
	}

}

export default Profile;
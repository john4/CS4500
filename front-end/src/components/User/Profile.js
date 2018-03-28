import React, { Component } from 'react';
import axios from 'axios';
import ProfileDetails from './Profile-Details.js';
import ProfileDetailsEdit from './Profile-Details-Edit.js';

class Profile extends Component {
	
	constructor(props) {
		super(props);
		
		this.state = {
			userObj: {
				name: "Test Tester",
				email: "test@testing.com",
				age: "2000",
				genre: [],
				avatar: "http://www.followingthenerd.com/site/wp-content/uploads/avatar.jpg_274898881.jpg"
			},
			editMode: false
		};
		
		this.handleEditClick = this.handleEditClick.bind(this);
		this.handleSubmitClick = this.handleSubmitClick.bind(this);
	}
	
	handleEditClick() {
		this.state.editMode = true;
	}
	
	handleSubmitClick() {
		this.state.editMode = false;
		//Shoot stuff to api I haven't written yet
	}

	render() {
		
		const details = this.state.editMode ? ( 
			<ProfileDetailsEdit details={this.state.userObj} /> ) : (
			 <ProfileDetails details={this.state.userObj} /> );
		
		return ( 
			<div>
				<img src={this.state.userObj.avatar}  />
				{details}
				<button class="btn-sm" onClick={this.handleEditClick}> 
					<i class="far fa-edit"></i> 
				</button>
				<button class="btn-sm" onClick={this.handleSubmitClick} />
			</div>
		)
		
	}

}

export default Profile;
import React, { Component } from 'react';
import axios from 'axios';

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
			}
		}
		
	}

	render() {
		return ( 
			<div>
				<img src={this.state.userObj.avatar} />
				<div>
					<span> {this.state.userObj.name} </span>
					<span> {this.state.userObj.email} </span>
					<span> {this.state.userObj.age} </span>
					<span> {this.state.userObj.genre} </span>
				</div>
			</div>
		)
		
	}

}

export default Profile;
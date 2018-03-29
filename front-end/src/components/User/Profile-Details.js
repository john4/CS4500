import React, { Component } from 'react';
import axios from 'axios';

class ProfileDetails extends Component {
	
	constructor(props) {
		super(props)
	}
	
	render(){
		return (
			<div>
				<div className="row">
					<span>Name: </span>
					<span>{this.props.details.name} </span>
				</div>
				<div className="row">
					<span>Email: </span>
					<span>{this.props.details.email} </span>
				</div>
				<div className="row">
					<span>Age: </span>
					<span> {this.props.details.age} </span>
				</div>
				<div className="row">
					<span>Genre: </span>
					<span> {this.props.details.genre} </span>
				</div>
				
			</div>
		);
	};
	
};

export default ProfileDetails;
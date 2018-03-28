import React, { Component } from 'react';
import axios from 'axios';

class ProfileDetails extends Component {
	
	constructor(props) {
		super(props)
	}
	
	render(){
		return (
			<div>
				<span> {this.props.details.name} </span>
				<span> {this.props.details.email} </span>
				<span> {this.props.details.age} </span>
				<span> {this.props.details.genre} </span>
			</div>
		);
	};
	
};

export default ProfileDetails;
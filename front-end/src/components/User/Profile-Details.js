import React, { Component } from 'react';
import axios from 'axios';

class ProfileDetails extends Component {

	constructor(props) {
		super(props)
	}

	render(){
		const { name, email, genre } = this.props.details
		return (
			<div>
				<div className="row">
					<h3>{name} </h3>
				</div>
				<div className="row">
					<span>{email} </span>
				</div>
				<div className="row">
					<span> {`Likes: ${genre}`} </span>
				</div>

			</div>
		);
	};

};

export default ProfileDetails;
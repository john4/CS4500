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
					<span>{this.props.details.name} </span>
				</div>
				<div className="row">
					<span>{this.props.details.email} </span>
				</div>
				<div className="row">
					<span> {`Likes ${this.props.details.genre}`} </span>
				</div>

			</div>
		);
	};

};

export default ProfileDetails;
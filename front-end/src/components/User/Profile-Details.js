import React, { Component } from 'react';
import './Profile-Details.css';
import axios from 'axios';

class ProfileDetails extends Component {

	constructor(props) {
		super(props)
	}

	render(){
		const { name, email, genre, followers, following } = this.props.details
		const { viewFollowers, viewFollowing } = this.props
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
				<div className="row">
					<div className="Link" onClick={viewFollowers}> {`${followers.length} Followers`} </div>
				</div>
				<div className="row">
					<div className="Link" onClick={viewFollowing}> {`${following.length} Following`} </div>
				</div>
			</div>
		);
	};

};

export default ProfileDetails;
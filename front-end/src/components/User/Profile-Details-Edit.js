import React, { Component } from 'react';


class ProfileDetailsEdit extends Component {
	
	constructor(props){
		super(props)
	
	}
	
	handleChange(event) {
		this.setState({value: event.target.value})
	}
	
	render(){
		return (
		
		<div>
			<input type="name" value={this.props.details.name} onChange={this.handleChange} />
			<input type="email" value={this.props.details.email} onChange={this.handleChange} />
			<input type="age" value={this.props.details.age} onChange={this.handleChange} />
		</div>)
	}
}

export default ProfileDetailsEdit;
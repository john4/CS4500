import React, { Component } from 'react';


class ProfileDetailsEdit extends Component {
	
	constructor(props){
		super(props)
		this.handleChange = this.handleChange.bind(this)
	}
	
	handleChange(event) {
		this.props.handleChange(event.target.value)
	}
	
	render(){
		const aValue = this.props.details
		
		return (
			<div className="row">
				<input type="text" placeholder={aValue} onChange={this.handleChange} />
			</div>
		)
	}
}

export default ProfileDetailsEdit;
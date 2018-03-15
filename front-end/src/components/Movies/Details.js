import React, { Component } from 'react';
import DetailResults from './DetailResults.js'
import axios from 'axios';



class Details extends Component {
	
	constructor(props) {
		super(props);
		this.state = {
			result: {}
		}
		this.URL      = 'http://ec2-54-87-191-69.compute-1.amazonaws.com:5000/movies/details/8'

		this.getDetails = this.getDetails.bind(this);
		this.showResults = this.showResults.bind(this);
		
		this.getDetails(this.URL);
	}
	
	showResults(response) {
		this.setState({
			result: response
		})
	}

	
	getDetails(URL) {
		axios.get(URL)
		.then( res => {
			const response = res.data;
			this.showResults(response);
		})
	}
	
	render() {
		
		return (
				<DetailResults detailResults={this.state.result}/>
			</div>
		);
	}
}

export default Details
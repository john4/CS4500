import React, { Component } from 'react';
import Results from '../Search/Results';
import axios from 'axios';



class Details extends Component {
	
	constructor(props) {
		super(props);
		this.state = {
			results: []
		}
		
		this.getDetails = this.getDetails.bind(this);
		this.showResults = this.showResults.bind(this);
		
		this.getInitialMovies();
	}
	
	getInitialMovies() {
		var URL = 'http://ec2-54-87-191-69.compute-1.amazonaws.com:5000/movies/10'
		this.getDetails(URL);
	}
	
	showResults(response) {
		this.setState({
			results: response
		})
	}
	
	
	getDetails(URL) {
		axios.get(URL)
		.then( res => {
			const response = res.data;
			console.log(response);
			this.showResults(response);
		})
	}
	
	render() {
		
		return (
			<div>
				<p>
					This is a list of loaded data
				</p>
				<ul>
					{JSON.stringify(this.state.results)}
				</ul>
			</div>
		);
	}
}

export default Details
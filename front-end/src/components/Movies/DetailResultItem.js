import React, { Component } from 'react';

class DetailResultItem extends Component {
	
    render() {
		return <div>
			<h2>{this.props.title}</h2>
 			<img src={this.props.posterSrc}/>
			<div>
				<h5>
					{this.props.tagline}
				</h5>
			</div>	
			<div>{this.props.overview}</div>
			<div><strong>Rating: {this.props.average} / 10</strong></div>
			<div>Release Date: {this.props.release_date} </div>
			<span>Movie Length: {this.props.length} </span>
        </div>
    }
  }
  
  export default DetailResultItem;
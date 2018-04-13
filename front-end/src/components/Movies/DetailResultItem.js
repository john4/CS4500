import React, { Component } from 'react';
import Rating from '../Rating/Rating';

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
				<div>Critic Rating: <Rating isIMDB={true} score={this.props.average / 2} /></div>
				<div>Spoiled Tomatillos Rating: <Rating isIMDB={false} score={this.props.averageRating} /></div>
				<div>Release Date: {this.props.release_date} </div>
				<span>Movie Length: {this.props.length} min </span>
      </div>
    }
  }

  export default DetailResultItem;
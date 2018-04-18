import React, { Component } from 'react';
import Rating from '../Rating/Rating';
import './DetailsResultItem.css';

class DetailResultItem extends Component {

    render() {
			return (
        <div className="DetailsResultItem">
          <div className="DetailsResultItem-image">
       			<img alt="" src={this.props.posterSrc}/>
          </div>
          <div className="DetailsResultItem-details">
            <h2>{this.props.title}</h2>
    				<h5>{this.props.tagline}</h5>
      			<div>{this.props.overview}</div>
      			<div style={{paddingTop: "1rem", display: "inline-block"}}>Critic Rating:</div>
            <div style={{paddingLeft: "3px", display: "inline-block"}}><Rating isIMDB={true} score={this.props.average / 2} /></div>
            <div />
      			<div style={{display: "inline-block"}}>Spoiled Tomatillos Rating:</div>
            <div style={{paddingLeft: "3px", display: "inline-block"}}><Rating isIMDB={false} score={this.props.averageRating} /></div>
      			<div>Release Date: {this.props.release_date} </div>
      			<span>Movie Length: {this.props.length} min </span>
          </div>
        </div>
      );
    }
  }

  export default DetailResultItem;
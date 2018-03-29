import React, { Component } from 'react';
import { ApiWrapper } from '../../ApiWrapper';

class NotificationItem extends Component {
    constructor(props) {
      super(props);

      this.state = {
        movieName: '',
        moviePosterSrc: ''
      }
    }

    componentDidMount() {
      var deets = ApiWrapper().api().getMovieDetails(this.props.tmdbId)
        .then(res => {
          this.setState({
            movieName: res.data.original_title,
            moviePosterSrc: 'https://image.tmdb.org/t/p/w200' + res.data.poster_path
          });
        });
    }

    onDelete() {
      ApiWrapper().api().markNotificationRead(this.props.id)
        .then(res => {
          window.location.reload();
        });
    }

    render() {
      var date = new Date(this.props.timestamp);
      var monthNames = [
        "January", "February", "March",
        "April", "May", "June", "July",
        "August", "September", "October",
        "November", "December"
      ];

      var day = date.getDate();
      var monthIndex = date.getMonth();
      var year = date.getFullYear();

      var dateString = day + ' ' + monthNames[monthIndex] + ' ' + year;
      var movieDetailString = `/movie/${this.props.tmdbId}/detail/`;
      return (
        <div className="NotificationItem row border-top border-dark mx-1">
          <div className="col-1 pt-2">
            <a href={movieDetailString}>
              <img src={this.state.moviePosterSrc} className="rounded"
                style={{height:'50%',width: 'auto'}} />
            </a>
          </div>
          <div className="col-10 pt-2 pl-5">
            <p><span className="font-weight-bold">{this.props.sender} </span>
              recommended
              <a href={movieDetailString} className="px-1">
                <span className="font-weight-bold">{this.state.movieName}</span>
              </a>
              &mdash; {dateString}
            </p>
            <p>
              <i className="fas fa-quote-left pr-3"></i>
              {this.props.message}
            </p>
          </div>
          <div className="col-1 pt-2">
            <div className="Notification-delete" onClick={() => this.onDelete()}>
              <i className="fas fa-times-circle"></i>
            </div>
          </div>
        </div>
      );
    }
  }

  export default NotificationItem;
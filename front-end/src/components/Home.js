import React, { Component } from 'react';
import { ApiWrapper } from '../ApiWrapper';
import axios from 'axios';
import GENRES from '../Genres';
import './Home.css';

const TMDB_URL = 'http://api.themoviedb.org/3/discover/movie?include_adult=false&page=1&language=en-US&api_key=020a1282ad51b08df67da919fca9f44e&';

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      session: null,
      iFollow: [],
      genreRecResults: []
    };

    this.handleGenreRec = this.handleGenreRec.bind(this);
    this.handleGetIFollow = this.handleGetIFollow.bind(this);
  }

  componentWillMount() {
    var session = ApiWrapper().getSession();
    this.setState({session: session});

    const genreId = GENRES[session.genre];
    axios.get(TMDB_URL + 'with_genres=' + genreId + '&sort_by=vote_average.desc&vote_count.gte=100')
      .then(res => {
        const results = res.data.results;
        this.handleGenreRec(results);
      });

    ApiWrapper().api().getUsersWhoAreFollowed()
      .then(res => {
        const results = res.data;
        this.handleGetIFollow(results);
      });
  }

  handleGenreRec(results) {
    this.setState({genreRecResults: results.splice(0, 10)});
  }

  handleGetIFollow(results) {
    this.setState({iFollow: results});
  }

  render() {
    const {session} = this.state;
    console.log(this.state);

    const genreRecItems = this.state.genreRecResults.map(function(result) {
      var posterPath = 'https://image.tmdb.org/t/p/w200' + result.poster_path;
      var detailURL = '/movie/' + result.id + '/detail/';
      return (
        <a href={detailURL}>
          <img src={posterPath} key={result.id} className="Home-poster pr-2" />
        </a>
      );
    });

    var currentlyShowing = (
      <div>
        <h4>Top rated movies in theatres</h4>
        <div>
          {currentMovieItems}
        </div>
      </div>
    )

    var genreRecs = (
      <div>
        <h4>Top rated movies in {session.genre}</h4>
        <div>
          {genreRecItems}
        </div>
      </div>
    );

    return (
      <div className="container-fluid">
        {session.isLoggedIn && genreRecs}
      </div>
    );
  }
}

export default Home;
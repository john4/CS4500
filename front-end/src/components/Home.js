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
      genreRecResults: [],
      currentMovieResults: []
    };

    this.handleGenreRec = this.handleGenreRec.bind(this);
    this.handleCurrentMovies = this.handleCurrentMovies.bind(this);
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

    var ltDate = new Date();
    ltDate.setDate(ltDate.getDate() + 1);
    const ltDateString = ltDate.getFullYear() + '-' + (ltDate.getMonth() + 1) + '-' + ltDate.getDate();

    var gtDate = new Date();
    gtDate.setDate(gtDate.getDate() - 21);
    const gtDateString = gtDate.getFullYear() + '-' + (gtDate.getMonth() + 1) + '-' + gtDate.getDate();

    axios.get(TMDB_URL + 'primary_release_date.gte=' + gtDateString +
      '&primary_release_date.lte=' + ltDateString + '&sort_by=vote_average.desc&vote_count.gte=15')
      .then(res => {
        const results = res.data.results;
        this.handleCurrentMovies(results);
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

  handleCurrentMovies(results) {
    this.setState({currentMovieResults: results.splice(0, 10)});
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
        <a href={detailURL} key={result.id}>
          <img src={posterPath} className="Home-poster pr-2" />
        </a>
      );
    });

    const currentMovieItems = this.state.currentMovieResults.map(function(result) {
      var posterPath = 'https://image.tmdb.org/t/p/w200' + result.poster_path;
      var detailURL = '/movie/' + result.id + '/detail';
      return (
        <a href={detailURL} key={result.id}>
          <img src={posterPath} className="Home-poster pr-2" />
        </a>
      );
    })

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
        {session.isLoggedIn && currentlyShowing}
        {session.isLoggedIn && genreRecs}
      </div>
    );
  }
}

export default Home;
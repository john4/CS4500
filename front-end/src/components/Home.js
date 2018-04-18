import React, { Component } from 'react';
import { ApiWrapper } from '../ApiWrapper';
import axios from 'axios';
import GENRES from '../Genres';
import ReviewNotificationItem from './Review/ReviewNotificationItem';
import './Home.css';
import { NO_RECOMMENDATIONS } from '../Errors';

const TMDB_URL = 'http://api.themoviedb.org/3/discover/movie?include_adult=false&page=1&language=en-US&api_key=' + process.env.REACT_APP_TMDB_API_KEY + '&';

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      session: null,
      recentReviewResults: [],
      genreRecResults: [],
      currentMovieResults: [],
      recommenderResults: []
    };

    this.handleGenreRec = this.handleGenreRec.bind(this);
    this.handleCurrentMovies = this.handleCurrentMovies.bind(this);
    this.handleRecommenderMovies = this.handleRecommenderMovies.bind(this);
    this.handleRecentReviews = this.handleRecentReviews.bind(this);
  }

  componentWillMount() {
    var session = ApiWrapper().getSession();
    this.setState({session: session});

    const genreId = GENRES[session.genre];
    axios.get(TMDB_URL + 'with_genres=' + genreId + '&sort_by=popularity.desc')
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
      '&primary_release_date.lte=' + ltDateString + '&sort_by=popularity.desc')
      .then(res => {
        const results = res.data.results;
        this.handleCurrentMovies(results);
      });

    ApiWrapper().api().getRecommendations(session.userId)
      .then(res => {
        const results = res.data;
        this.handleRecommenderMovies(results);
      });

    ApiWrapper().api().getFollowedRecentReviews().then(res => {
      this.handleRecentReviews(res.data);
    });
  }

  handleGenreRec(results) {
    this.setState({genreRecResults: results.splice(0, 12)});
  }

  handleCurrentMovies(results) {
    this.setState({currentMovieResults: results.splice(0, 12)});
  }

  handleRecommenderMovies(results) {
    this.setState({recommenderResults: results.splice(0, 12)});
  }

  handleRecentReviews(results) {
    this.setState({recentReviewResults: results.splice(0, 12)});
  }

  render() {
    const {session} = this.state;

    const genreRecItems = this.state.genreRecResults.map(function(result) {
      var posterPath = 'https://image.tmdb.org/t/p/w200' + result.poster_path;
      var detailURL = '/movie/' + result.id + '/detail/';
      return (
        <a href={detailURL} key={result.id}>
          <img alt="" src={posterPath} className="Home-poster pr-2 pt-2" />
        </a>
      );
    });

    const currentMovieItems = this.state.currentMovieResults.map(function(result) {
      var posterPath = 'https://image.tmdb.org/t/p/w200' + result.poster_path;
      var detailURL = '/movie/' + result.id + '/detail/';
      return (
        <a href={detailURL} key={result.id}>
          <img alt="" src={posterPath} className="Home-poster pr-2 pt-2" />
        </a>
      );
    });

    const recommenderMovieItems = this.state.recommenderResults.map(function(result) {
      var posterPath = 'https://image.tmdb.org/t/p/w200' + result.poster_path;
      var detailURL = '/movie/' + result.id + '/detail/';
      return (
        <a href={detailURL} key={result.id}>
          <img alt="" src={posterPath} className="Home-poster pr-2 pt-2" />
        </a>
      )
    });

    const recentRevItems = this.state.recentReviewResults.map((result) =>
      <ReviewNotificationItem
        userName={result.user_name}
        movieTitle={result.movie_title}
        movieId={result.tmdb_id}
        rating={result.rating}
      />
    );

    var currentlyShowing = (
      <div>
        <h3>Most popular movies in theatres</h3>
        <div>
          {currentMovieItems}
        </div>
      </div>
    );

    var genreRecs = (
      <div>
        <h3>Most popular {session.genre} movies</h3>
        <div>
          {genreRecItems}
        </div>
      </div>
    );

    var recentRevs = (
      <div>
        <h3>Recent reviews by people you follow</h3>
        <div>
          {recentRevItems}
        </div>
      </div>
    );

    var noRecommenderPrompt = (
      <div>
        <p><i>{NO_RECOMMENDATIONS}</i></p>
      </div>
    );

    var recommender = (
      <div>
        <h3>Personalized movie recommendations for you</h3>
        <div>
          {recommenderMovieItems.length > 0 && recommenderMovieItems}
          {recommenderMovieItems.length === 0 && noRecommenderPrompt}
        </div>
      </div>
    );

    var registerPrompt = (
      <div>
        <h3>
          <a href='/login'>Log In</a> or <a href='/register'>Register</a> to see personalized
          recommendations and reviews by people you follow.
        </h3>
      </div>
    );

    return (
      <div className="container">
        <div className="container-fluid">
          <div className="row pt-3 pb-5">
            <div className="col-8">
              <div className="row px-2 pt-3">
                {session.isLoggedIn && recommender}
              </div>

              <div className="row px-2">
                {currentlyShowing}
              </div>

              <div className="row px-2 pt-3">
                {session.isLoggedIn && genreRecs}
              </div>

            </div>

            <div className="col-4">
                {session.isLoggedIn && recentRevs}
                {!session.isLoggedIn && registerPrompt}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
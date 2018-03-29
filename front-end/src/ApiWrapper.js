'use es6';
import axios from 'axios';

export const ApiWrapper = (() => {
  let instance;
  function init() {
    const API_ENDPOINT = "http://ec2-54-87-191-69.compute-1.amazonaws.com:5000";
    // const API_ENDPOINT = "http://127.0.0.1:5000";

    return {
      get: function (path) {
        return axios.get(API_ENDPOINT + path);
      },
      post: function (path, data) {
        return axios.post(API_ENDPOINT + path, data);
      },
      setSession: function (sessionId, userEmail) {
        localStorage.setItem("spoiledSessionId", sessionId);
        localStorage.setItem("spoiledUserEmail", userEmail);
      },
      removeSession: function () {
        const LOGOUT_PATH = "/user/logout/";
        axios.post(API_ENDPOINT + LOGOUT_PATH, { sessionId: localStorage.getItem("spoiledSessionId") });
        localStorage.setItem("spoiledSessionId", null);
        localStorage.setItem("spoiledUserEmail", null);
      },
      getSession: function() {
        return {
          sessionId: localStorage.getItem("spoiledSessionId"),
          userEmail: localStorage.getItem("spoiledUserEmail"),
        };
      },
      getAccountDetails: function () {
        return axios.get(API_ENDPOINT + `/user/detail/?sessionId=${localStorage.getItem("spoiledSessionId")}`);
      },
      getAverageMovieRating: function (movieId) {
        return axios.get(API_ENDPOINT + `/movie/${movieId}/rating/`);
      },
      createMovieReview: function (movieId, score, description) {
        return axios.post(
          API_ENDPOINT + '/movie/' + movieId + '/review/',
          {
            session_id: localStorage.getItem("spoiledSessionId"),
            user_email: localStorage.getItem("spoiledUserEmail"),
            rating: score,
            description,
          }
        );
      },
      getReviews: function (movieId) {
        return axios.get(`${API_ENDPOINT}/movie/${movieId}/get-reviews/`);
      },
      deleteReview: function (movieId, reviewId) {
        return axios.post(`${API_ENDPOINT}/movie/${movieId}/delete-review/`,
          {
            review_id: reviewId,
            session_id: localStorage.getItem("spoiledSessionId"),
          }
        );
      },
      searchUser: function (query) {
        return axios.get(`${API_ENDPOINT}/user/search/?name=${query}`);
      },
      followUser: function (userId) {
        return axios.post(
          `${API_ENDPOINT}/user/follow/`,
          { oid:
            {
              $oid: userId
            },
            session_id: localStorage.getItem("spoiledSessionId")
          }
        );
      },
      getMovieDetails: function (movieId) {
        return axios.get(API_ENDPOINT + `/movie/${movieId}/detail/`);
      },
    };

  };

  return {
    api: function () {
      if (!instance) {
        instance = init();
      }
      return instance;
    },
  };
});

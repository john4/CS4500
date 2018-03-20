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
      getAccountDetails: function () {
        return axios.get(API_ENDPOINT + `/user/details/?sessionId=${localStorage.getItem("spoiledSessionId")}`);
      },
      getAverageMovieRating: function (movieId) {
        return axios.get(API_ENDPOINT + `/movie/${movieId}/rating/`);
      },
      createMovieReview: function (movieId, score) {
        return axios.post(
          API_ENDPOINT + '/movie/' + movieId + '/review/',
          {
            user_email: localStorage.getItem("spoiledUserEmail"),
            rating: score,
          }
        );
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
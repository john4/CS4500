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
        if (typeof window.localStorage != "undefined") {
            window.localStorage.setItem("spoiledSessionId", sessionId);
            window.localStorage.setItem("spoiledUserEmail", userEmail);
        }
      },
      removeSession: function () {
        if (typeof window.localStorage != "undefined") {
            const LOGOUT_PATH = "/user/logout/";
            axios.post(API_ENDPOINT + LOGOUT_PATH, { sessionId: window.localStorage.getItem("spoiledSessionId") });
            window.localStorage.setItem("spoiledSessionId", null);
            window.localStorage.setItem("spoiledUserEmail", null);
        }
      },
      getAccountDetails: function () {
        if (typeof window.localStorage != "undefined") {
            return axios.get(API_ENDPOINT + `/user/detail/?sessionId=${window.localStorage.getItem("spoiledSessionId")}`);
        }
      },
      getAverageMovieRating: function (movieId) {
        return axios.get(API_ENDPOINT + `/movie/${movieId}/rating/`);
      },
      createMovieReview: function (movieId, score) {
        if (typeof window.localStorage != "undefined") {
            return axios.post(
              API_ENDPOINT + '/movie/' + movieId + '/review/',
              {
                user_email: window.localStorage.getItem("spoiledUserEmail"),
                rating: score,
              }
            );
        }
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

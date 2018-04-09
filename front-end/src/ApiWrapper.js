'use es6';
import axios from 'axios';

const setSession = function (sessionData) {
  const { session_id, user_data } = sessionData;

  localStorage.setItem("st:isLoggedIn", true);
  localStorage.setItem("st:sessionId", session_id);
  localStorage.setItem("st:userId", user_data._id.$oid);
  localStorage.setItem("st:email", user_data.email);
  localStorage.setItem("st:name", user_data.name);
  localStorage.setItem("st:genre", user_data.genre);
  localStorage.setItem("st:photo_url", user_data.photo_url);
  localStorage.setItem("st:age", user_data.age);
  localStorage.setItem("st:isAdmin", user_data.isAdmin);
}

const removeSession = function () {
  localStorage.removeItem("st:isLoggedIn");
  localStorage.removeItem("st:sessionId");
  localStorage.removeItem("st:userId");
  localStorage.removeItem("st:email");
  localStorage.removeItem("st:name");
  localStorage.removeItem("st:genre");
  localStorage.removeItem("st:photo_url");
  localStorage.removeItem("st:age");
  localStorage.removeItem("st:isAdmin");
}

const getSession = function () {
  return {
    isLoggedIn: localStorage.getItem("st:isLoggedIn"),
    sessionId: localStorage.getItem("st:sessionId"),
    userId: localStorage.getItem("st:userId"),
    email: localStorage.getItem("st:email"),
    name: localStorage.getItem("st:name"),
    genre: localStorage.getItem("st:genre"),
    photoUrl: localStorage.getItem("st:photo_url"),
    age: localStorage.getItem("st:age"),
    isAdmin: localStorage.getItem("st:isAdmin")
  };
}

export const ApiWrapper = (() => {
  let instance;
  function init() {
    const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;
    // const API_ENDPOINT = "http://127.0.0.1:5000";

    return {
      get: function (path) {
        return axios.get(API_ENDPOINT + path);
      },
      post: function (path, data) {
        return axios.post(API_ENDPOINT + path, data);
      },
      login: function (email, password) {
        const LOGIN_PATH = "/user/login/";

        return axios.post(API_ENDPOINT + LOGIN_PATH, { email, password })
          .then(res => {
            setSession(res.data);
            window.location = "/playlist/genre";
          });
      },
      removeSession: function () {
        const LOGOUT_PATH = "/user/logout/";
        const { sessionId } = getSession();

        axios.post(API_ENDPOINT + LOGOUT_PATH, { sessionId }).then(res => {
          removeSession();
          window.location = "/";
        });
      },
      getAccountDetails: function () {
        const { sessionId } = getSession();

        return axios.get(API_ENDPOINT + `/user/detail/?sessionId=${sessionId}`);
      },
      getUserDetails: function (userId) {
        return axios.get(API_ENDPOINT + `/user/${userId}/detail`);
      },
      getAverageMovieRating: function (movieId) {
        return axios.get(API_ENDPOINT + `/movie/${movieId}/rating/`);
      },
      createMovieReview: function (movieId, movieTitle, score, description) {
        const { sessionId, userId, name } = getSession();

        return axios.post(
          API_ENDPOINT + '/movie/' + movieId + '/review/',
          {
            session_id: sessionId,
            movie_title: movieTitle,
            user_id: userId,
            user_name: name,
            rating: score,
            description,
          }
        );
      },
      getReviews: function (movieId) {
        return axios.get(`${API_ENDPOINT}/movie/${movieId}/get-reviews/`);
      },
      deleteReview: function (movieId, reviewId) {
        const { sessionId } = getSession();

        return axios.post(`${API_ENDPOINT}/movie/${movieId}/delete-review/`,
          {
            review_id: reviewId,
            session_id: sessionId,
          }
        );
      },
      searchUser: function (query) {
        return axios.get(`${API_ENDPOINT}/user/search/?name=${query}`);
      },
      followUser: function (userId) {
        const { sessionId } = getSession();

        return axios.post(
          `${API_ENDPOINT}/user/follow/`,
          { oid:
            {
              $oid: userId
            },
            session_id: sessionId
          }
        );
      },
      unfollowUser: function (userId) {
        const { sessionId } = getSession();

        return axios.post(
          `${API_ENDPOINT}/user/unfollow/`,
          { oid:
            {
              $oid: userId
            },
            session_id: sessionId
          }
        );
      },
      getMovieDetails: function (movieId) {
        return axios.get(API_ENDPOINT + `/movie/${movieId}/detail/`);
      },
      getUsersWhoFollow: function (lookupUserId) {
        const { sessionId, userId } = getSession();

        if (!lookupUserId) {
          lookupUserId = userId;
        }

        return axios.post(`${API_ENDPOINT}/user/follow-me/`,
          {
            session_id: sessionId,
            user_id: lookupUserId,
          }
        );
      },
      getUsersWhoAreFollowed: function (lookupUserId) {
        const { sessionId, userId } = getSession();

        if (!lookupUserId) {
          lookupUserId = userId;
        }

        return axios.post(`${API_ENDPOINT}/user/i-follow/`,
          {
            session_id: sessionId,
            user_id: lookupUserId,
          }
        );
      },
      getFollowedRecentReviews: function () {
        const { sessionId, userId } = getSession();

        return axios.post(`${API_ENDPOINT}/user/i-follow/reviews/`,
          {
            session_id: sessionId,
            user_id: userId
          });
      },
      getNotifications: function () {
        const { sessionId, userId } = getSession();

        return axios.post(`${API_ENDPOINT}/user/prod/get-all/`,
          {
            session_id: sessionId,
            user_id: userId,
          }
        );
      },
      markNotificationRead: function (prodId) {
        const { sessionId } = getSession();

        return axios.post(`${API_ENDPOINT}/user/prod/mark-read/`,
          {
            prod_id: prodId,
            session_id: sessionId,
          }
        );
      },
      prodUser: function (movieId, targetUserId) {
        const { sessionId, userId } = getSession();

        return axios.post(`${API_ENDPOINT}/user/prod/`,
          {
            session_id: sessionId,
            sender: userId,
            tmdb_id: movieId,
            receivers: [targetUserId],
            message: "",
          }
        );
      },
      getLogs: function () {
        const { sessionId } = getSession();
        return axios.post(`${API_ENDPOINT}/logs/`,
        {
          session_id: sessionId
        })
      },
      clearLogs: function () {
        const { sessionId } = getSession();
        return axios.post(`${API_ENDPOINT}/logs/clear/`,
        {
          session_id: sessionId
        })
      },
	  updateUser: function(data) {
		return axios.post(`${API_ENDPOINT}/user/update/`,
		  {
			name: data.name,
			age: data.age,
			photoUrl: data.photoUrl,
			genre: data.genre,
			email: data.email
		  }
		);
	  },
    }
  };

  return {
    api: function () {
      if (!instance) {
        instance = init();
      }
      return instance;
    },
    getSession: function() {
      return getSession();
    },
  };
});

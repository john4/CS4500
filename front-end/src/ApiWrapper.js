'use es6';
import axios from 'axios';

export const ApiWrapper = (() => {
  let instance;
  function init() {
    // const API_ENDPOINT = "http://ec2-54-87-191-69.compute-1.amazonaws.com:5000";
    const API_ENDPOINT = "http://127.0.0.1:5000";
    let sessionId = localStorage.getItem("spoiledSessionId");

    return {
      get: function (path) {
        return axios.get(API_ENDPOINT + path);
      },
      post: function (path, data) {
        return axios.post(API_ENDPOINT + path, data);
      },
      setSession: function (session) {
        localStorage.setItem("spoiledSessionId", session);
        sessionId = session;
      },
      getAccountDetails: function () {
        return axios.get(API_ENDPOINT + `/user/details/?sessionId=${sessionId}`);
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

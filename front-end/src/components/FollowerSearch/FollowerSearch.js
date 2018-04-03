import React, { Component } from 'react';
import Search from '../Search/Search';
import FollowerResults from './FollowerResults'
import axios from 'axios';
import { ApiWrapper } from '../../ApiWrapper'


class FollowerSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      results: []
    };
    this.search = this.search.bind(this);
    this.receiveResults = this.receiveResults.bind(this);
  }

  search(query) {
    ApiWrapper().api().searchUser(query)
      .then(this.receiveResults)
      .catch(err => {
        console.log(err);
        this.setState({results: []});
      });;
  }

  receiveResults(res) {
    const results = res.data.map(user => {
      return {
        age: user.age,
        email: user.email,
        genre: user.genre,
        name: user.name,
        photoUrl: user.photo_url || "https://sites.google.com/a/windermereprep.com/canvas/_/rsrc/1486400406169/home/unknown-user/user-icon.png",
        userId: user._id.$oid,
        followMe: user.followMe
      };
    });
    this.setState({results});
  }

  render() {
    const {results} = this.state;
    const placeholder = "Search user by username...";
    return (
      <Search onSearch={this.search} results={results} ResultsComponent={FollowerResults} placeholder={placeholder} />
    );
  }
}


export default FollowerSearch;
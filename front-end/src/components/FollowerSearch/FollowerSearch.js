import React, { Component } from 'react';
import Search from '../Search/Search';
import FollowerResults from './FollowerResults'
import { ApiWrapper } from '../../ApiWrapper'
import { NO_USER_RESULTS } from '../../Errors'


class FollowerSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      results: [],
      error: ""
    };
    this.search = this.search.bind(this);
    this.receiveResults = this.receiveResults.bind(this);
  }

  search(query) {
    ApiWrapper().api().searchUser(query)
      .then(this.receiveResults)
      .catch(err => {
        this.setState({results: []});
        if (err.response.data.error) {
          this.setState({error: NO_USER_RESULTS})
        }
      });
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
    this.setState({ results, error: '' });
  }

  render() {
    const {results, error} = this.state;
    const placeholder = "Search user by username...";
    return (
      <Search onSearch={this.search} results={results} ResultsComponent={FollowerResults}
        placeholder={placeholder} error={error}/>
    );
  }
}


export default FollowerSearch;

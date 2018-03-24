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
  }

  search(query) {
    // ApiWrapper().api().searchUser(query).then(this.receiveResults);
    this.setState({ results: [
      {

      },
      {

      }
    ]});
  }

  receiveResults(res) {
    debugger;
    const results = res.data.results;
    this.setState({results});
  }

  render() {
    const {results} = this.state;

    return (
      <Search onSearch={this.search} results={results} ResultsComponent={FollowerResults} />
    );
  }
}


export default FollowerSearch;

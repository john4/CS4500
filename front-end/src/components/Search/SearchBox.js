import React, { Component } from 'react';


class SearchBox extends Component {
    constructor(props) {
      super(props);
      this.createAjax = this.createAjax.bind(this);
    }
  
    createAjax() {
      var query    = this.refs.query.value;
      var URL      = 'http://api.themoviedb.org/3/search/movie?include_adult=false&page=1&language=en-US&api_key=020a1282ad51b08df67da919fca9f44e&query=' + query;
      this.props.search(URL)
    }
  
    render() {
      return (
          <div>
              <input type="text" ref="query" />
              <input type="submit" onClick={this.createAjax} />
          </div>
      );
    }
  }

  export default SearchBox;
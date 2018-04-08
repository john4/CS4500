import React, { Component } from 'react';
import './SearchBox.css';


class SearchBox extends Component {
    constructor(props) {
      super(props);
      this.state = {
        value: null
      };
      this.onChange = this.onChange.bind(this);
      this.onSubmit = this.onSubmit.bind(this);
    }

    onChange(evt) {
      this.setState({value: evt.target.value});
    }

    onSubmit(evt) {
      const onSearch = this.props.onSearch;
      evt.preventDefault();
      onSearch(this.state.value);
    }
  
    render() {
      const placeholder = this.props.placeholder;

      return (
        <div className="SearchBox input-group">
          <form onSubmit={this.onSubmit}>
            <span className="input-group-append">
              <input className="form-control" type="text" ref="query" placeholder={placeholder || "Batman..."} onChange={this.onChange} />
              <button className="btn btn-secondary" type="submit" value="Search">Search</button>
            </span>
          </form>
        </div>
      );
    }
  }

  export default SearchBox;
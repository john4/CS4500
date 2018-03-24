import React, { Component } from 'react';
import './SearchBox.css';


class SearchBox extends Component {
    constructor(props) {
      super(props);
      this.state = {
        value: null
      };
      this.onChange = this.onChange.bind(this);
    }

    onChange(evt) {
      this.setState({value: evt.target.value});
    }

    render() {
      const { onSearch } = this.props;
      return (
        <div className="SearchBox input-group">
            <input className="form-control" type="text" ref="query" placeholder="Batman..." onChange={this.onChange} />
            <span className="input-group-append">
              <button className="btn btn-secondary" type="button" onClick={() => onSearch(this.state.value)} value="Search">Search</button>
            </span>
        </div>
      );
    }
  }

  export default SearchBox;
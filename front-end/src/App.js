import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'react-bootstrap';
import NavBar from './components/NavBar';
import { ApiWrapper } from './ApiWrapper';


class App extends Component {
    
  constructor(props) {
    super(props);

    this.state = {
      session: null
    };
  }

  componentWillMount() {
    this.setState({
      session: ApiWrapper().getSession()
    });
  }

  render() {
    return (
      <div className="App container-fluid p-0">
        {<NavBar session={this.state.session}/>}
      </div>
    );
  }
}

export default App;

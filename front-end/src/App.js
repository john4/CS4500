import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'react-bootstrap';
import NavBar from './components/NavBar';

class App extends Component {
  render() {
    return (
      <div className="App container-fluid p-0">
        {<NavBar />}
      </div>
    );
  }
}

export default App;

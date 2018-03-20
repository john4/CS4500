import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'react-bootstrap';
import Account from './components/User/Account';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <div className="row">
            <div className="col">
              <h1 className="App-title">Spoiled Tomatillos</h1>
            </div>

            <div className="col text-right">
              Logged in as <Account></Account>
            </div>
          </div>

        </header>
      </div>
    );
  }
}

export default App;

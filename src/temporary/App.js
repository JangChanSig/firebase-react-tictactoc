import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import * as firebase from 'firebase';

class App extends Component {
  constructor() {
    super();
    this.state = {
      speed: 10
    };
  }

 componentDidMount(){
   const rootRef = firebase.database().ref().child('reactTest');
   const speedRef = rootRef.child('speed');
   speedRef.on('value', snap =>{
     this.setState({
        speed: snap.val()
     })
   });
 }

  render() {
    return (
      <div className="App">
      {/*
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        */}
        <h1>{this.state.speed}</h1>
      </div>
    );
  }
}

export default App;

import React, { Component } from 'react';
import * as firebase from 'firebase';

class DBConnection extends React.Component {
  constructor(){
      super();
      this.state = {
        speed : 10
      }
  }
  componentDidMount(){
    const rootRef = firebase.database().ref().child('reactTest');
    const sppedRef = rootRef.child('speed');
    sppedRef.on('value', snap => {
      this.setState({
        speed : snap.val()
      });
    });
  }
  render() {
    return(
      <div className='DBConnectionText'>
        <h1>{this.state.speed}</h1>
      </div>
    )

  }
}
export default DBConnection;

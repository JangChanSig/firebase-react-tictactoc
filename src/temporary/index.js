import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import * as firebase from 'firebase';

var config = {
  apiKey: "AIzaSyAGTSX8DwHpXq25fYcVSNlcoQj1o-RcpoA",
  authDomain: "hackathontestserver.firebaseapp.com",
  databaseURL: "https://hackathontestserver.firebaseio.com",
  storageBucket: "hackathontestserver.appspot.com",
  messagingSenderId: "949008282032",
};
firebase.initializeApp(config);

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();

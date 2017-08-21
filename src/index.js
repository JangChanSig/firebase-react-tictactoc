import React from 'react';
import ReactDOM from 'react-dom';
import Game from './Game';
import DBConnection from './DBConnection.js'
import * as firebase from 'firebase';

var config = {
  apiKey: "AIzaSyAGTSX8DwHpXq25fYcVSNlcoQj1o-RcpoA",
  authDomain: "hackathontestserver.firebaseapp.com",
  databaseURL: "https://hackathontestserver.firebaseio.com",
  storageBucket: "hackathontestserver.appspot.com",
  messagingSenderId: "949008282032",
};
firebase.initializeApp(config);

{/*
  next to 23line
let val = Array(3).fill(null);
for(let j=0; j<wincase[j].length;j++)
{
  val[j] = wincase[i][j];
}
if(squares[val[0]]===squares[val[1]] && squares[val[1]]===squares[val[2]])
{
  return squares[val[0]];
}
same code with downsirde code
*/}



// ========================================
const element = (
    <div>
      <Game/>
      <DBConnection/>
    </div>
  );
  ReactDOM.render(
    element,
    document.getElementById('root')
  );

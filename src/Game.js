import React, { Component } from 'react';
import ToggleButton from 'react-toggle-button'
import * as firebase from 'firebase';
import './Game.css';

function calculateWinner(squares) {
  const lines = [
    [[0,0], [0,1], [0,2]],
    [[1,0], [1,1], [1,2]],
    [[2,0], [2,1], [2,2]],
    [[0,0], [1,0], [2,0]],
    [[0,1], [1,1], [2,1]],
    [[0,2], [1,2], [2,2]],
    [[0,0], [1,1], [2,2]],
    [[2,0], [1,1], [0,2]]
  ];
  for(let i=0; i<lines.length; i++)
  {
    const [[fx,fy],[sx,sy],[tx,ty]] = lines[i];
    if (squares[fx][fy] && squares[fx][fy] === squares[sx][sy] && squares[sx][sy] === squares[tx][ty] && squares[fx][fy] !=='N') {
      const wincase = [[fx,fy],[sx,sy],[tx,ty]];
      return wincase;
    }
  }
  return null;
}

{/*must upper capital at first word*/}
function Square(props) {
  console.log('drawing!');
  return(
    <div className="square" onClick={() => props.onClick()}>
    {/* if you need to passing props, use flowing code, and add props : onClick={() => props.onClick()}*/}
      {props.value}
    </div>
  )
}

function HighlightSquare(props) {
  console.log('wellcome');
  return(
    <div className="highlightSquare" onClick={() => props.onClick()}>
    {/* if you need to passing props, use flowing code, and add props : onClick={() => props.onClick()}*/}
      {props.value}
    </div>
  )
}

var roomRef = null;

class Board extends React.Component {
  constructor() {
    super();
    this.state = {
      rows: 3,
      columns: 3,
    };
  }

  _renderSquare(i,j,key) {
    return(
      <Square
       key={key}
       value={this.props.squares[i][j] === 'X' || this.props.squares[i][j] === 'O' ? this.props.squares[i][j] : null}
       onClick={() => this.props.onClick(i,j)}
       />
   );
  }
  _renderHighlight(i,j,key) {
    return(
      <HighlightSquare
      key={key}
      value={this.props.squares[i][j] === 'X' || this.props.squares[i][j] === 'O' ? this.props.squares[i][j] : null}
      onClick={() => this.props.onClick(i,j)}
      />
   );
  }

  render() {
    {/* array.push(html) save html doc to array*/}
    var rows = [];
    var cells = [];
    var cellNumber = 0;
    for (let i = 0; i < this.state.rows; i++) {
      for (let j = 0; j < this.state.columns; j++) {
        if(this.props.gameOver)
        {
          const wincase = this.props.gameOverCase;
          let Ishighlight = false;
          for(let k = 0; k < this.props.winCaseRows; k++)
          {
            if(i == wincase[k][0] && j == wincase[k][1])
            {
              console.log(i+'s'+j);
              cells.push(this._renderHighlight(i,j,cellNumber));
              Ishighlight = true;
            }
          }
          if(!Ishighlight)
          {
            console.log(i+'n'+j);
            cells.push(this._renderSquare(i,j,cellNumber));
          }
        }
        else {
          cells.push(this._renderSquare(i,j,cellNumber));
        }
        cellNumber++;
      }
      rows.push(<div key={i} className="board-row">{ cells }</div>)
      cells = [];
    }
    return (
      <div>
        {rows}
      </div>
    )
  }
}

class Game extends React.Component {
  constructor() {
    super();
    this.state = {
      squares: [['N','N','N'],['N','N','N'],['N','N','N']],
      roomNo:1,
      stepNumber: 0,
      xIsNext: true,
      winCaseRows: 3,
      gameOver: false,
      gameOverCase : [[null,null],[null,null],[null,null]]
    };
    roomRef = firebase.database().ref().child('tictactoc:room'+this.state.roomNo);
    roomRef.set({
      "row:0" : {
        "col:0" : 'N',
        "col:2" : 'N',
        "col:1" : 'N',
      },
      "row:1" : {
        "col:0" : 'N',
        "col:1" : 'N',
        "col:2" : 'N'
      },
      "row:2" : {
        "col:0" : 'N',
        "col:1" : 'N',
        "col:2" : 'N'
      }
    });
  }

  handleClick(i,j){
    const squares = this.state.squares.map( function(row){ return row.slice(); });
    console.log('insert Value['+i+']['+j+'] = '+squares[i][j]);
    if (squares[i][j] === 'X' || squares[i][j] === 'O' || this.state.gameOver) {
      console.log('end');
      return;
    }

    const element = 'col:'+j;

    squares[i][j] = this.state.xIsNext ? "X" : "O";

    roomRef.child('row:'+i).update({
      [element] : squares[i][j]
    });

    {/*wincase */}
    const wincase = calculateWinner(squares);
    if(wincase)
    {
      this.setState({
        gameOverCase: wincase,
        gameOver:true
      });
      for(let _i=0;_i<this.state.winCaseRows;_i++)
      {
        squares[wincase[_i][0]][wincase[_i][1]] = this.state.xIsNext ? "X" : "O";
      }
    }

    {/*rendering start*/}
    this.setState({
      squares: squares,
      xIsNext: !this.state.xIsNext
    });
  }

  init() {
    roomRef.update({
      "row:0" : {
        "col:0" : 'N',
        "col:2" : 'N',
        "col:1" : 'N',
      },
      "row:1" : {
        "col:0" : 'N',
        "col:1" : 'N',
        "col:2" : 'N'
      },
      "row:2" : {
        "col:0" : 'N',
        "col:1" : 'N',
        "col:2" : 'N'
      }
    });
    this.setState({
      squares: [['N','N','N'],['N','N','N'],['N','N','N']],
      gameOver : false
    });
  }

  componentDidMount(){
    roomRef.on('value', snap => {
      const obj = snap.val();
      let i =0;
      var result = Object.keys(obj).map(function(key) {
        let rows =null;
        rows = Object.keys(obj['row:'+i]).map(function(key) {
        return [obj['row:'+i][key]];
        });
        i++
        return rows;
      });
      console.log(result);
      this.setState({
        squares : result
      });
    });
  }

  render() {
    const squares = this.state.squares;
    const wincase = calculateWinner(squares);
    let winner =null;
    if(wincase)
    {
      winner = squares[wincase[0][0]][wincase[0][1]];
    }

    {/*step is history[move], move is index*/}

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares = {this.state.squares}
            gameOver = {this.state.gameOver}
            gameOverCase = {this.state.gameOverCase}
            winCaseRows = {this.state.winCaseRows}
            onClick = {(i,j) => this.handleClick(i,j)}
          />
        </div>
        <div className="game-info">
          <div className = "toggle-button">
          </div>
          <div>{status}</div>
          <ol className="IsBolder">
            <a href="#" onClick={() => this.init()}> restart</a>
          </ol>
        </div>
      </div>
    );
  }
}

export default Game;

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
    if (squares[fx][fy] && squares[fx][fy] == squares[sx][sy] && squares[sx][sy] === squares[tx][ty]) {
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
       value={this.props.squares[i][j]}
       onClick={() => this.props.onClick(i,j)}
       />
   );
  }
  _renderHighlight(i,j,key) {
    return(
      <HighlightSquare
      key={key}
      value={this.props.squares[i][j]}
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
      history: [{
        squares: [[null,null,null],[null,null,null],[null,null,null]]
      }],
      roomNo:1,
      stepNumber: 0,
      xIsNext: true,
      IsDesc: true,
      winCaseRows: 3,
      gameOver: false,
      gameOverCase : [[null,null],[null,null],[null,null]]
    };
  }

  handleClick(i,j){
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const roomRef = firebase.database().ref().child('tictactoc:room'+this.state.roomNo);
    {/* slice can't make clone of two dimentions. so use map   */}
    const squares = current.squares.map( function(row){ return row.slice(); });
    if (squares[i][j] || this.state.gameOver) {
      console.log('end');
      return;
    }
    console.log('insert Value['+i+']['+j+']');
    roomRef.child('row:'+i).set({
      col: X ,
    });
    squares[i][j] = this.state.xIsNext ? "X" : "O";

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
        squares[wincase[_i][0]][wincase[_i][1]] = this.state.xIsNext ? "A" : "B";
      }
    }

    {/*rendering start*/}
    this.setState({
      history: history.concat([
        {
          squares: squares
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }
  /*
  handleCheckbox(_IsDesc){
    console.log('b : '+this.state.IsDesc);
    console.log('b : '+_IsDesc);
    this.setState({
      IsDesc : !_IsDesc,
    })
  }
  */
  jumpTo(step) {
    this.setState({
      gameOver: this.state.stepNumber == step ? true: false,
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {

    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const wincase = calculateWinner(current.squares);
    let winner =null;
    if(wincase)
    {
      winner = current.squares[wincase[0][0]][wincase[0][1]];
    }
    {/*
    for(let i = 0; this.state.stepNumber-i >=0; i++)
    {
      console.log(this.state.stepNumber-i +','+ history[this.state.stepNumber-i].squares);
    }

    alert('length'+history.length+'\nstepNumber'
    +this.state.stepNumber+ '\nhistory[length]'
    +history[history.length-1].squares);
    */}

    {/*step is history[move], move is index*/}

    const moves = history.map((step, move) => {
      let IsBolder = 'notblodline';
      if(!this.state.IsDesc){
        move = history.length - move ;
        if(history.length - move <= 0)
        {
           move = 0 ;
        }
      }
      if(move == this.state.stepNumber)
      {
        IsBolder = 'boldline';
      }
      {/*order must defind after change move*/}
      const order = move ? 'Move #' + move : 'Game start';
      return (
        <li key={move} className={IsBolder}>
          <a href="#" onClick={() => this.jumpTo(move)}>{order}</a>
        </li>
      );
    });

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
            squares = {current.squares}
            gameOver = {this.state.gameOver}
            gameOverCase = {this.state.gameOverCase}
            winCaseRows = {this.state.winCaseRows}
            onClick = {(i,j) => this.handleClick(i,j)}
          />
        </div>
        <div className="game-info">
          <div className = "toggle-button">

            <ToggleButton
            inactiveLabel={'asc'}
            activeLabel={'desc'}
              value = { this.state.IsDesc }
              onToggle = {(value) => {
                this.setState({
                  IsDesc: !value,
                })
              }}
            />
            {/*
            <input
              className="check-box"
              type="checkbox"
              defaultChecked
              value = {this.state.IsDesc}
              onClick = {() => this.handleCheckbox(_IsDesc)}
            />
            <label>desc?</label>
            */}
          </div>
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

export default Game;

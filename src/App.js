import {useState} from 'react';

function Square({value, isHighlight, onSquareClick}){
    return <button
        className={`square ${isHighlight ? 'highlight' : ''}`}
        onClick={onSquareClick}
    >
        {value}
    </button>
}

function Board({xIsNext, squares, onPlay, isDraw, winner, winningSquares}) {

    function handleClick(i) {
        const nextSquares = squares.slice();

        if (winner || isDraw) {
            return;
        }

        if (squares[i]) {
            return;
        }

        if (xIsNext) {
            nextSquares[i] = 'X';
        } else {
            nextSquares[i] = 'O';
        }
        onPlay(nextSquares);
    }

    let status;
    if (winner) {
        status = '勝者: ' + winner;
    } else if(isDraw){
        status = '引き分け';
    } else {
        status = '次のプレイヤーは: ' + (xIsNext ? 'X' : 'O');
    }
    
    return <>
        <div className="status">{status}</div>
        <div className="board-row">
            <Square value={squares[0]} isHighlight={winningSquares.includes(0)} onSquareClick={() => handleClick(0)} />
            <Square value={squares[1]} isHighlight={winningSquares.includes(1)} onSquareClick={() => handleClick(1)} />
            <Square value={squares[2]} isHighlight={winningSquares.includes(2)} onSquareClick={() => handleClick(2)} />
        </div>
        <div className="board-row">
            <Square value={squares[3]} isHighlight={winningSquares.includes(3)} onSquareClick={() => handleClick(3)} />
            <Square value={squares[4]} isHighlight={winningSquares.includes(4)} onSquareClick={() => handleClick(4)} />
            <Square value={squares[5]} isHighlight={winningSquares.includes(5)} onSquareClick={() => handleClick(5)} />
        </div>
        <div className="board-row">
            <Square value={squares[6]} isHighlight={winningSquares.includes(6)} onSquareClick={() => handleClick(6)} />
            <Square value={squares[7]} isHighlight={winningSquares.includes(7)} onSquareClick={() => handleClick(7)} />
            <Square value={squares[8]} isHighlight={winningSquares.includes(8)} onSquareClick={() => handleClick(8)} />
        </div>
    </>
}


export default function Game() {
    const [history, setHistory] = useState([Array(9).fill(null)])
    const currentSquares = history[history.length - 1]
    const xIsNext = (history.length % 2) !== 0
    const {winner, winningSquares} = calculateWinner(currentSquares);
    const isDraw = currentSquares.every((square) => square !== null)

    function handlePlay(nextSquares){
        setHistory([...history, nextSquares])
    }

    function jumpTo(move){
        setHistory(history.slice(0, move + 1))
    }

    const moves = history.map((squares, move, history) =>
        {
            if(move === history.length -1){
                return (
                    <li key={move}>current</li>
                )
            }

            let description;
            if(move === 0){
                description = 'Go to game start'
            }else{
                description = 'Go to move #' + move
            }

            return (
                <li key={move}>
                    <button onClick={ () =>jumpTo(move)}>{description}</button>
                </li>
            )
        }
    )

    return (
        <div className="game">
            <div className="game-board">
                <Board
                    xIsNext={xIsNext}
                    squares={currentSquares}
                    onPlay={handlePlay}
                    winner={winner}
                    isDraw={isDraw}
                    winningSquares={winningSquares}
                />
            </div>
            <div className="game-info">
                <ol>{moves}</ol>
            </div>
        </div>
    );
}


function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    for(let i=0; i< lines.length; i++ ){
        const [a,b,c] = lines[i]
        if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]){
            return {winner:squares[a], winningSquares:lines[i]}
        }
    }
    return {winner:null, winningSquares:[]}
}
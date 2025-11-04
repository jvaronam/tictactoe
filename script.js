const Gameboard = (function () {//fabrica de objetos 
  const board = ["", "", "", "", "", "", "", "", ""];

  function getBoard() {//ver
    return board;
  }

  function setMark(index, symbol) {//modificar
    if (board[index] === "") {
      board[index] = symbol;
    }
  }

  function reset() {//reiniciar
    for (let i = 0; i < board.length; i++) {
      board[i] = "";
    }
  }

  return { getBoard, setMark, reset };//cada vez que lo llamas, devuelve uno nuevo con propios datos
})();


function createPlayer(name, symbol) {
  return { name, symbol };
}


const GameController = (function(){
    //almacenar jugadores
    const players = [createPlayer("Player1", "X"), createPlayer("Player2", "O")];
    let currentPlayerindex = 0;
    let gameOver = false;

    //gestionar turnos
    function nextTurn(){
        currentPlayerindex = 1 - currentPlayerindex;
    }

    function getCurrentPlayer() {
        return players[currentPlayerindex];
    }

    //verificar si gano o empate
    function checkWinner(){
        const b = Gameboard.getBoard();
        const win = [
            [0,1,2], [3,4,5], [6,7,8], // filas
            [0,3,6], [1,4,7], [2,5,8], // columnas
            [0,4,8], [2,4,6]           // diagonales
        ];

        for(let combo of win){
            const [a,bI,c] = combo;
            if(b[a] && b[a] === b[bI] && b[a] === b[c]){//verifica 1casilla no este vacia, que las 3 sean iguales
                gameOver = true;
                return b[a];//devuelve ganador
            }
        }

        if(b.every(cell => cell !== "")){
            gameOver = true;
            return "tie";
        }

        return null;
    }

    //reiniciar juego
    function resetGame(){
        Gameboard.reset();
        currentPlayerindex = 0;
        gameOver = false;
    }
    
    function isGameOver() {
        return gameOver;
    }

    return { nextTurn, getCurrentPlayer, checkWinner, resetGame, isGameOver };
})();

const DisplayController = (function(){
    const container = document.getElementById("container");
    const resetBtn = document.getElementById("reset");
    const messageDiv = document.getElementById("message");

    function render() {
        const b = Gameboard.getBoard();
        for(let i = 0; i < b.length; i++){
            const cell = document.getElementById(i.toString());
            cell.textContent = b[i];
        }
    }

    function setupEvents() {
        for(let i = 0; i < 9; i++){
            const cell = document.getElementById(i.toString());
            cell.addEventListener("click", () => {
                if(GameController.isGameOver()) return;

                const currentPlayer = GameController.getCurrentPlayer();
                Gameboard.setMark(i, currentPlayer.symbol);
                render();

                const winner = GameController.checkWinner();
                if(winner){
                    if(winner === "tie"){
                        messageDiv.textContent = "¡TIE!";
                    } else {
                        messageDiv.textContent = `${currentPlayer.name} WINS!`;
                    }
                    return;
                }

                GameController.nextTurn();
            });
        }

        resetBtn.addEventListener("click", () => {
            GameController.resetGame();
            messageDiv.textContent = "";
            render();
        });
    }

    return { render, setupEvents };
})();

DisplayController.setupEvents();
DisplayController.render();
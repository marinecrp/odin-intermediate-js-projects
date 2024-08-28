// user factory
function createPlayer(name, id){
    return {name, id};
}

// game board singleton
const gameboard = (function(){
    let board = [[0,0,0],[0,0,0],[0,0,0]];

    function playTurn(userId, row, column){
        board[row][column] = userId;
    }

    function displayBoard(){
        console.log(board[0] + "\n" + board[1] + "\n" + board[2]);
    }

    function isBoardFull(){
        let isFull = true;
        for(var i = 0; i <= 2; i++){
            for(var j = 0; j <= 2; j++){
                if(board[i][j] === 0){
                    isFull = false;
                    break; 
                }
            }
        }
        return isFull;
    }

    function isCellOccupied(row, column){
        return board[row][column] != 0;
    }

    function isWinningRow(index){
        if (board[index][0] === board[index][1] && board[index][1]=== board[index][2]){
            return board[index][0];
        } else {
            return 0;
        }
    }

    function isWinningColumn(index){
        if (board[0][index] === board[1][index] && board[1][index] === board[2][index]){
            return board[0][index];
        } else {
            return 0;
        }
    }

    function isWinningDiagonals(){
        if ((board[0][0] === board[1][1] && board[1][1] === board[2][2]) || (board[2][0] === board[1][1] && board[1][1] === board[0][2])) {
            return board[1][1];
        }
        else {
            return 0;
        }
    }

    function reset(){
        board = [[0,0,0],[0,0,0],[0,0,0]];
    }

    return {playTurn, displayBoard, isBoardFull, isCellOccupied, isWinningRow, isWinningColumn, isWinningDiagonals, reset};
})();

// game flow singleton
const game = (function(){
    let firstPlayer = undefined;
    let secondPlayer = undefined;
    let currentPlayer = undefined;

    function init(player1, player2) {
        firstPlayer = player1;
        secondPlayer = player2;
        currentPlayer = firstPlayer;
    }

    function switchPlayer(){
        if(currentPlayer === firstPlayer){
            currentPlayer = secondPlayer;
        } else {
            currentPlayer = firstPlayer;
        }
    }

    function someoneWins(){
        let winner = gameboard.isWinningDiagonals();
        let i = 0;
        while(winner === 0 && i <= 2){
            winner = gameboard.isWinningColumn(i) || gameboard.isWinningRow(i);
            i++;
        }
        return winner;
    }

    function playTurn(row, column){
        gameboard.playTurn(currentPlayer.id, row, column);
        gameboard.displayBoard();
        switchPlayer();
        if (someoneWins() != 0 || gameboard.isBoardFull()){
            display.showResultDialog(someoneWins());
        }
    }

    function getCurrentPlayer(){
        return currentPlayer;
    }

    function getPlayerName(id){
        if (id === 1){
            return firstPlayer.name;
        } else {
            return secondPlayer.name;
        }
    }

    function reset(){
        if (currentPlayer != firstPlayer){
            currentPlayer = firstPlayer;
            display.switchCard();
        }
    }

    return {init, playTurn, getCurrentPlayer, reset, getPlayerName};
})();

const display = (function() {
    const firstPlayerShape = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>close-outline</title><path d="M3,16.74L7.76,12L3,7.26L7.26,3L12,7.76L16.74,3L21,7.26L16.24,12L21,16.74L16.74,21L12,16.24L7.26,21L3,16.74M12,13.41L16.74,18.16L18.16,16.74L13.41,12L18.16,7.26L16.74,5.84L12,10.59L7.26,5.84L5.84,7.26L10.59,12L5.84,16.74L7.26,18.16L12,13.41Z" /></svg>';
    const secondPlayerShape = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>circle-double</title><path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8Z" /></svg>';
    const firstPlayerCard = document.querySelector("#player1-card");
    const secondPlayerCard = document.querySelector("#player2-card");
    const resultModal = document.querySelector(".result-modal");

    function init(){
        const firstPlayerShapeContainer = document.querySelector("#player-1-shape");
        firstPlayerShapeContainer.innerHTML = firstPlayerShape;
        const secondPlayerShapeContainer = document.querySelector("#player-2-shape");
        secondPlayerShapeContainer.innerHTML = secondPlayerShape;

        document.querySelectorAll(".cell").forEach(cell => {
            cell.addEventListener("click", (event) => {
                if(event.target === cell) {
                    let [row, column] = event.target.id.split("-");
                    if(!gameboard.isCellOccupied(row, column)){
                        cell.innerHTML = game.getCurrentPlayer().id === 1 ? firstPlayerShape : secondPlayerShape;
                        cell.setAttribute("occupied", true);
                        game.playTurn(row, column);
                        switchCard();
                    }
                }
            })
        })

        document.querySelector(".restart-btn").addEventListener("click", () => {
            gameboard.reset();
            game.reset();
            reset();
        })

        document.querySelector(".new-game-btn").addEventListener("click", () => {
            gameboard.reset();
            game.reset();
            reset();
            resultModal.close();
        })

        document.querySelector(".start-game-btn").addEventListener("click", (event) => {
            event.preventDefault();

            const firstPlayerName = document.querySelector("#player1-input").value;
            const secondPlayerName = document.querySelector("#player2-input").value;
            game.init(createPlayer(firstPlayerName, 1), createPlayer(secondPlayerName, 2));

            initName();

            document.querySelector(".init-modal").close();
        })
    }

    function initName(){
        document.querySelector("#player1-name").textContent = game.getPlayerName(1);
        document.querySelector("#player2-name").textContent = game.getPlayerName(2);
    }

    function switchCard(){
        if(game.getCurrentPlayer().id === 1){
            firstPlayerCard.setAttribute("current", true);
            secondPlayerCard.setAttribute("current", false);
        } else {
            firstPlayerCard.setAttribute("current", false);
            secondPlayerCard.setAttribute("current", true);
        }
        
    }

    function reset(){
        document.querySelectorAll(".cell").forEach(cell => {
            cell.setAttribute("occupied", false);
            cell.innerHTML = "";
        })
    }

    function showResultDialog(playerId){
        let resultText = playerId === 0 ? "It's a tie!" : game.getPlayerName(playerId) + " has won!";
        document.querySelector(".text-result").textContent = resultText;
        resultModal.showModal();
        document.querySelector(".new-game-btn").blur();
    }

    return {init, switchCard, showResultDialog};
})();

display.init();
document.querySelector(".init-modal").showModal();
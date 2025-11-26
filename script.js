const Gameboard = (() => {
    let board = ["", "", "", "", "", "", "", "", ""];

    const setMark = (index, mark) => {
        if (board[index] === "") {
            board[index] = mark;
            return true;
        }
        return false;
    };

    const getBoard = () => board;

    const reset = () => {
        board = ["", "", "", "", "", "", "", "", ""];
    };

    return { setMark, getBoard, reset };
})();


const Player = (name, mark) => ({ name, mark });


const Game = (() => {
    let player1, player2, currentPlayer;
    let gameOver = false;

    const winningCombos = [
        [0,1,2], [3,4,5], [6,7,8],
        [0,3,6], [1,4,7], [2,5,8],
        [0,4,8], [2,4,6]
    ];

    const start = (name1, name2) => {
        player1 = Player(name1, "X");
        player2 = Player(name2, "O");
        currentPlayer = player1;
        Gameboard.reset();
        gameOver = false;
        Display.render();
        Display.setMessage(`${currentPlayer.name}'s turn (${currentPlayer.mark})`);
    };

    const playTurn = (index) => {
        if (gameOver) return;

        if (Gameboard.setMark(index, currentPlayer.mark)) {
            Display.render();

            if (checkWin(currentPlayer.mark)) {
                Display.setMessage(`${currentPlayer.name} wins!`);
                gameOver = true;
                return;
            }

            if (checkTie()) {
                Display.setMessage("It's a tie!");
                gameOver = true;
                return;
            }

            switchPlayer();
            Display.setMessage(`${currentPlayer.name}'s turn (${currentPlayer.mark})`);
        }
    };

    const checkWin = (mark) =>
        winningCombos.some(combo =>
            combo.every(i => Gameboard.getBoard()[i] === mark)
        );

    const checkTie = () =>
        Gameboard.getBoard().every(cell => cell !== "");

    const switchPlayer = () =>
        currentPlayer = currentPlayer === player1 ? player2 : player1;

    return { start, playTurn };
})();


const Display = (() => {
    const boardDiv = document.getElementById("board");
    const messageDiv = document.getElementById("message");

    const render = () => {
        boardDiv.innerHTML = "";

        Gameboard.getBoard().forEach((value, index) => {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.textContent = value;

            cell.addEventListener("click", () => Game.playTurn(index));
            boardDiv.appendChild(cell);
        });
    };

    const setMessage = msg => messageDiv.textContent = msg;

    return { render, setMessage };
})();


document.getElementById("startBtn").addEventListener("click", () => {
    const p1 = document.getElementById("player1").value || "Player 1";
    const p2 = document.getElementById("player2").value || "Player 2";
    Game.start(p1, p2);
});

document.getElementById("restartBtn").addEventListener("click", () => {
    window.location.reload();
});

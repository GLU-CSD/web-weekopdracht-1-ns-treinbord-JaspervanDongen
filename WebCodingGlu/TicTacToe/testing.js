// Variables for the game
let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', '']; // Array to store the board state
let gameOver = false;
let scorebordX = 0;
let scorebordO = 0;

const openModalButton = document.getElementById("openModal");
const closeModalButton = document.getElementById("closeModal");
const resetModalButton = document.getElementById("resetModal");
const modal = document.getElementById("modal");
const gameStatus = document.getElementById("gameStatus");
const scoreBord = document.getElementById("scoreBord");
const cells = document.querySelectorAll(".cell");

// Open the modal to start the game
openModalButton.addEventListener("click", () => {
    modal.style.display = 'flex';
    gameStatus.textContent = `Player ${currentPlayer}'s turn`;
    resetGame();
});

// Close the modal
closeModalButton.addEventListener("click", () => {
    modal.style.display = 'none';
});

// Reset the game when the reset button is clicked
resetModalButton.addEventListener("click", () => {
    resetGame();
});

// Handle cell click
cells.forEach(cell => {
    cell.addEventListener("click", () => {
        const cellIndex = cell.getAttribute('data-cell');

        // Prevent cell from being clicked if already filled or game over
        if (gameBoard[cellIndex] || gameOver) return;

        // Mark the cell with the current player's symbol
        gameBoard[cellIndex] = currentPlayer;
        cell.textContent = currentPlayer;

        // Check if the game is over
        if (checkWinner(currentPlayer)) {
            gameStatus.textContent = `Player ${currentPlayer} wins!`;
            if (currentPlayer === 'X') {
                scorebordX++; // Increment X's score
            } else {
                scorebordO++; // Increment O's score
            }
            gameOver = true;
            updateScoreboard(); // Update the scoreboard after the win
            // Example after a win or draw
            if (gameOver) {
                setTimeout(() => {
                    resetGame(); // Call the resetGame function after 5 seconds
                }, 1500); // 5000 milliseconds = 5 seconds
            }

        } else if (gameBoard.every(cell => cell !== '')) {
            gameStatus.textContent = "It's a draw!";
            gameOver = true;
        } else {
            // Switch to the other player
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            gameStatus.textContent = `Player ${currentPlayer}'s turn`;
        }
    });
});

// Check for a winner
function checkWinner(player) {
    const winningCombination = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    return winningCombination.some(combination => {
        return combination.every(index => gameBoard[index] === player);
    });
}

// Update the scoreboard
function updateScoreboard() {
    scoreBord.textContent = `Player X: ${scorebordX} - Player O: ${scorebordO}`;
}

// Reset the game board
function resetGame() {
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    cells.forEach(cell => {
        cell.textContent = '';
    });
    gameOver = false;
    currentPlayer = 'X';
}

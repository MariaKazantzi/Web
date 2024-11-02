const dogImages = ['images/11.jpg', 'images/12.jpg', 'images/13.jpg', 'images/14.jpg', 'images/15.jpg','images/16.jpg', 'images/17.jpg', 'images/18.jpg', 'images/19.jpg', 'images/20.jpg'];

const randomImage = dogImages[Math.floor(Math.random() * dogImages.length)];

// JavaScript array to hold shuffled positions
let puzzlePieces = [...Array(16).keys()]; // For a 4x4 grid
puzzlePieces = puzzlePieces.sort(() => Math.random() - 0.5);

let selectedPiece = null; // To keep track of the first selected piece

let isGameStarted = false; // Track if the game has started

const startGameButton = document.getElementById("startGameButton");

startGameButton.addEventListener("click", () => {
    // Hide the "Start Game" button
    startGameButton.style.display = "none";

    // Show the "Pause" button
    document.getElementById("pauseGameButton").classList.remove("hidden");
    document.getElementById('backToStartButton').style.display = 'block';

    isGameStarted = true; // Enable piece clicks

    // Start the game (e.g., display puzzle pieces)
    initializePuzzle();
});


puzzlePieces.forEach((piece) => {
    const pieceDiv = document.createElement("div");
    pieceDiv.classList.add("puzzle-piece");

    // Set up the background image and position
    pieceDiv.style.backgroundImage =  `url('${randomImage}')`;
    pieceDiv.style.backgroundPosition = `${-(piece % 4) * 100}px ${-Math.floor(piece / 4) * 100}px`;

    pieceDiv.dataset.index = piece; // Store the original index

    // Add click event listener to each piece
    pieceDiv.addEventListener("click", () => handlePieceClick(pieceDiv));

    // Append the piece to the puzzle container
    document.getElementById("puzzle-container").appendChild(pieceDiv);
});

// Handle click events on pieces
function handlePieceClick(piece) {
    if (!isGameStarted) return; // Prevent clicking if game hasn't started

    // Start the timer on the first click
    if (!isTimerStarted) {
        startTimer();
        isTimerStarted = true;
    }

    if (selectedPiece === null) {
        selectedPiece = piece;
        piece.classList.add("selected");
    } else {
        swapPieces(selectedPiece, piece);
        selectedPiece.classList.remove("selected");
        selectedPiece = null;

        checkForCompletion();
    }
}


// Function to swap two pieces
function swapPieces(piece1, piece2) {
    // Swap the background positions
    const tempPosition = piece1.style.backgroundPosition;
    piece1.style.backgroundPosition = piece2.style.backgroundPosition;
    piece2.style.backgroundPosition = tempPosition;

    // Swap the dataset index values
    const tempIndex = piece1.dataset.index;
    piece1.dataset.index = piece2.dataset.index;
    piece2.dataset.index = tempIndex;
}

// Check if all pieces are in the correct order
function checkForCompletion() {
    const pieces = document.querySelectorAll(".puzzle-piece");
    let isComplete = true;

    pieces.forEach((piece, index) => {
        if (parseInt(piece.dataset.index) !== index) {
            isComplete = false;
        }
    });

    if (isComplete) {
        alert("Congratulations! You solved the puzzle!");
    }
}

let timer; // Timer variable
let timeElapsed = 0; // Time in seconds
let timerInterval; // Variable to hold the setInterval reference
let isPaused = false; // Variable to check if the game is paused
let isTimerStarted = false; // Flag to check if the timer has started

function startTimer() {
    if (!timerInterval) { // Start the timer only if it's not already running
        timerInterval = setInterval(() => {
            timeElapsed++;
            updateTimerDisplay();
        }, 1000);
    }
}

function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeElapsed / 60);
    const seconds = timeElapsed % 60;
    const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    document.getElementById('timer').textContent = `Time: ${formattedTime}`;
}


// Toggle Pause and Resume function
function togglePause() {
    const pauseButton = document.getElementById('pauseGameButton');
    
    if (isPaused) {
        // Resume the game
        isPaused = false;
        pauseButton.textContent = "Pause";
        startTimer(); // Resume the timer
    } else {
        // Pause the game
        isPaused = true;
        pauseButton.textContent = "Resume";
        stopTimer(); // Stop the timer
    }
}

function checkForCompletion() {
    const pieces = document.querySelectorAll(".puzzle-piece");
    let isComplete = true;

    pieces.forEach((piece, index) => {
        if (parseInt(piece.dataset.index) !== index) {
            isComplete = false;
        }
    });

    if (isComplete) {
        stopTimer();  // Stop the timer when the puzzle is solved
        alert("Congratulations! You solved the puzzle!");
    }
}

let pauseTimeouts = []; // Array to store active timeouts for unflipping cards

// Add the event listener to toggle pause
document.getElementById('pauseGameButton').addEventListener("click", togglePause);

// Event listener for the Back to Start button
document.getElementById('backToStartButton').addEventListener('click', function() {
    // Redirect to initial.html
    window.location.href = 'initial_page.html';
});

// When the game starts, show the Back to Start button
document.getElementById('startGameButton').addEventListener('click', function() {
    document.getElementById('backToStartButton').style.display = 'block';
});

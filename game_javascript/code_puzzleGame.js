const gameId = "dogPuzzleGame"; // Set a unique identifier for each game type
const highScoresKey = `highScores_${gameId}`; // Unique key for this specific game’s high scores

const dogImages = ['images/11.jpg', 'images/12.jpg', 'images/13.jpg', 'images/14.jpg', 'images/15.jpg','images/16.jpg', 'images/17.jpg', 'images/18.jpg', 'images/19.jpg', 'images/20.jpg'];

const randomImage = dogImages[Math.floor(Math.random() * dogImages.length)];

// JavaScript array to hold shuffled positions
let puzzlePieces = [...Array(16).keys()]; // For a 4x4 grid
puzzlePieces = puzzlePieces.sort(() => Math.random() - 0.5);

let selectedPiece = null; // To keep track of the first selected piece

let isGameStarted = false; // Track if the game has started

// Get the overlay element
const overlay = document.getElementById('overlay');

const startGameButton = document.getElementById("startGameButton");

// Set the reference image source to the puzzle image
document.getElementById('referenceImage').src = randomImage;

startGameButton.addEventListener("click", () => {
    // Hide the "Start Game" button
    startGameButton.style.display = "none";

    // Show the "Pause" button
    document.getElementById("pauseGameButton").classList.remove("hidden");
    document.getElementById('backToStartButton').style.display = 'block';

    // Set up the game to start and the timer to begin on the first move
    isGameStarted = true; // Enable piece clicks
    isTimerStarted = false; // Timer will start on first piece click
});

// clear scores
// clearHighScores();


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
    if (!isGameStarted || isPaused) return; // Prevent clicking if game hasn't started or is paused

    // Start the timer on the first click
    if (!isTimerStarted) {
        startTimer();
        isTimerStarted = true;
    }

    if (selectedPiece === null) {
        // First click: Select the first piece and add a border
        selectedPiece = piece;
        piece.classList.add("selected");
        piece.style.border = "2px solid blue"; // Add blue border to the first selected piece
    } else {
        // Second click: Select the second piece and add a border
        piece.classList.add("selected");
        piece.style.border = "2px solid blue"; // Add blue border to the second selected piece

        // Swap the two selected pieces
        swapPieces(selectedPiece, piece);

        // Remove borders from both pieces after swapping
        selectedPiece.style.border = "none";
        piece.style.border = "none";

        // Remove 'selected' class from both pieces
        selectedPiece.classList.remove("selected");
        piece.classList.remove("selected");

        // Reset selection
        selectedPiece = null;

        // Check if the puzzle is now solved
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
        overlay.classList.add('hidden');  // Hide the overlay
        startTimer(); // Resume the timer
    } else {
        // Pause the game
        isPaused = true;
        pauseButton.textContent = "Resume";
        overlay.classList.remove('hidden');  // Show the overlay
        stopTimer(); // Stop the timer
    }
}

let isScoreSaved = false;

function checkForCompletion() {
    let highScores = JSON.parse(localStorage.getItem(highScoresKey)) || [];

    const pieces = document.querySelectorAll(".puzzle-piece");
    let isComplete = true;

    // Check if each piece is in the correct position
    pieces.forEach((piece, index) => {
        if (parseInt(piece.dataset.index) !== index) {
            isComplete = false;
        }
    });

    if (isComplete) {
        stopTimer(); // Stop the timer when the puzzle is solved
        alert("Congratulations! You solved the puzzle!");

        // Hide the pause button when the game ends
        document.getElementById('pauseGameButton').classList.add('hidden');

        // Retrieve high scores from localStorage
        let highScores = JSON.parse(localStorage.getItem(highScoresKey)) || [];
        let shouldAskForName = true;

        // Check if the current time qualifies as a high score
        if (highScores.length === 3 && highScores[2].time <= timeElapsed) {
            shouldAskForName = false; // Don't ask for a name if the time isn't a top score
        } else if (highScores.length < 3 || timeElapsed < highScores[2].time) {
            shouldAskForName = true; // Ask for the name if the time qualifies as a top score
        }

        // Display the congrats message with high scores table inside
        const message = document.createElement('div');
        message.classList.add('absolute', 'bg-white', 'p-6', 'rounded-lg', 'shadow-md', 'text-center', 'z-10');
        message.id = "draggableMessage"; 
        message.style.position = "fixed";
        message.style.top = "50%";
        message.style.left = "50%";
        message.style.transform = "translate(-50%, -50%)"; 
        message.innerHTML = `
            <div class="drag-handle" style="cursor: move; background-color: lightgray; padding: 5px; border-radius: 5px; font-weight: bold;">
                Drag Me
            </div>
            <div style="text-align: center; padding: 20px;">
                <h2 class="text-2xl font-bold mb-2">Congratulations!</h2>
                <p>You completed the puzzle in ${timeElapsed} seconds!</p>
                ${shouldAskForName ? ` 
                <label for="nameInput" class="block text-gray-700 text-sm font-bold mb-2">Enter your name:</label>
                <input id="nameInput" type="text" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="Your Name">
                <button id="saveScoreButton" class="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Save Score
                </button>
                ` : ''}
                <button id="restartButton" class="mt-4 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
                    Restart Game
                </button>
            </div>
            <div id="highScoresContainer" class="mt-4">
                <h2 class="text-2xl font-bold mb-2">High Scores</h2>
                <!-- High scores table will be inserted here -->
            </div>
        `;

        document.body.appendChild(message);

        // Show high scores inside the message
        displayHighScores(document.getElementById("highScoresContainer"));

        // Handle saving the score if the player enters a name
        if (shouldAskForName) {
            document.getElementById('saveScoreButton').addEventListener('click', () => {
                if (!isScoreSaved) { // Check if score has already been saved
                    const name = document.getElementById('nameInput').value;
                    if (name) {
                        updateHighScores(name, timeElapsed); // Save the high score
                        displayHighScores(document.getElementById("highScoresContainer")); // Update displayed scores
                        isScoreSaved = true; // Set flag to true to prevent additional saves
                    } else {
                        alert("Please enter a name to save your score.");
                    }
                } else {
                    alert("Score already saved!"); // Optional alert to inform player
                }
            });
        }

        // Make the message draggable
        makeDraggable(message);

        // Attach the event listener to the Restart button
        document.getElementById('restartButton').addEventListener('click', restartGame);
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

function updateHighScores(name, timeElapsed) {
    let highScores = JSON.parse(localStorage.getItem(highScoresKey)) || [];
    
    // Add the new score to the list
    highScores.push({ name: name, time: timeElapsed });

    // Sort high scores by time (ascending) and keep only the top 3 scores
    highScores.sort((a, b) => a.time - b.time);
    highScores = highScores.slice(0, 3);

    // Save updated high scores to localStorage
    localStorage.setItem(highScoresKey, JSON.stringify(highScores));

    // Display the high scores in the high scores container
    displayHighScores(document.getElementById("highScoresContainer"));
}

function displayHighScores(container) {
    const highScores = JSON.parse(localStorage.getItem(highScoresKey)) || [];

    const highScoresTable = document.createElement('table');
    highScoresTable.classList.add('highScoresTable', 'border', 'border-collapse', 'mx-auto', 'mt-4');
    highScoresTable.innerHTML = `
        <thead>
            <tr>
                <th class="border px-4 py-2">Rank</th>
                <th class="border px-4 py-2">Name</th>
                <th class="border px-4 py-2">Time (seconds)</th>
            </tr>
        </thead>
        <tbody></tbody>
    `;

    const tbody = highScoresTable.querySelector('tbody');
    tbody.innerHTML = ''; // Clear any existing rows

    highScores.forEach((score, index) => {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td class="border px-4 py-2">${index + 1}</td>
            <td class="border px-4 py-2">${score.name}</td>
            <td class="border px-4 py-2">${score.time}</td>
        `;
    });

    container.innerHTML = ''; // Clear existing content before appending
    container.appendChild(highScoresTable);
    container.classList.remove('hidden');
}

function toggleScoreTable() {
    // Check if the high scores message already exists
    const highScoresMessage = document.getElementById('draggableMessage');

    // Create the high scores table if it doesn't exist
    if (highScoresMessage) {
        // Create a container for high scores if not already present
        let scoresContainer = document.getElementById('highScoresContainer');

        // Create a new container if it doesn't exist
        if (!scoresContainer) {
            scoresContainer = document.createElement('div');
            scoresContainer.id = 'highScoresContainer';
            scoresContainer.innerHTML = `
                <h2 class="text-2xl font-bold mb-2">High Scores</h2>
                <table id="highScoresTable" class="border-collapse w-full mt-4">
                    <thead>
                        <tr>
                            <th class="border px-4 py-2">#</th>
                            <th class="border px-4 py-2">Name</th>
                            <th class="border px-4 py-2">Time</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
                <button id="closeHighScoresButton" class="mt-4 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
                    Close
                </button>
            `;
            highScoresMessage.appendChild(scoresContainer);
            displayHighScores(); // Display high scores in the newly created table
            
            // Add event listener to close the high scores message
            document.getElementById('closeHighScoresButton').addEventListener('click', () => {
                scoresContainer.classList.add('hidden'); // Hide the scores container
            });
        } else {
            // Toggle visibility of the existing scores container
            scoresContainer.classList.toggle('hidden');
        }
    }
}

function makeDraggable(element) {
    const dragHandle = element.querySelector('.drag-handle');
    let offsetX = 0, offsetY = 0, initialX = 0, initialY = 0;

    // Mouse down event to start dragging
    dragHandle.onmousedown = dragStart;

    function dragStart(e) {
        e.preventDefault();
        // Get the initial mouse position
        initialX = e.clientX;
        initialY = e.clientY;

        // Attach the event listeners for mousemove and mouseup
        document.onmousemove = drag;
        document.onmouseup = dragEnd;
    }

    function drag(e) {
        e.preventDefault();

        // Calculate the new cursor position
        offsetX = initialX - e.clientX;
        offsetY = initialY - e.clientY;
        initialX = e.clientX;
        initialY = e.clientY;

        // Set the new position of the draggable element
        element.style.top = (element.offsetTop - offsetY) + "px";
        element.style.left = (element.offsetLeft - offsetX) + "px";
    }

    function dragEnd() {
        // Remove the event listeners when dragging ends
        document.onmousemove = null;
        document.onmouseup = null;
    }
}

function clearHighScores() {
    localStorage.removeItem(highScoresKey); // Clear specific game's high scores
    const tbody = document.getElementById('highScoresTablePuzzle').querySelector('tbody');
    tbody.innerHTML = ''; // Clear the table body
}

let currentPuzzleImage = '';

function restartGame() {
    // Clear the puzzle container to remove all pieces
    const puzzleContainer = document.getElementById("puzzle-container");
    puzzleContainer.innerHTML = '';  // Remove all current puzzle pieces

    // Reset the puzzle pieces array and shuffle it again
    puzzlePieces = [...Array(16).keys()];  // Reset to the original set of 16 puzzle pieces
    puzzlePieces = puzzlePieces.sort(() => Math.random() - 0.5);  // Shuffle the array

    // Reset other game states (e.g., timer, game status)
    timeElapsed = 0;  // Reset time to 0
    isTimerStarted = false;  // Reset timer flag
    isGameStarted = false;  // Reset game start flag

    // Reset the timer display to 0
    updateTimerDisplay(); // Update the display without starting the timer
    stopTimer(); // Make sure the timer is stopped

    // Select a new random image each time the puzzle is initialized
    currentPuzzleImage = dogImages[Math.floor(Math.random() * dogImages.length)];

    // Set the reference image to the new puzzle image
    document.getElementById('referenceImage').src = currentPuzzleImage;

    isScoreSaved = false;

    // Initialize the puzzle again by creating new puzzle pieces
    initializePuzzle();

    // Show the start button and allow the game to be started again
    startGameButton.style.display = 'block';
    document.getElementById('pauseGameButton').classList.add('hidden');

    // Remove the congratulatory message
    const congratulatoryMessage = document.getElementById('draggableMessage');
    if (congratulatoryMessage) {
        congratulatoryMessage.remove(); // Remove the message from the DOM
    }
}


function initializePuzzle() {
    // Use the previously set `currentPuzzleImage` to generate the puzzle pieces
    const puzzleContainer = document.getElementById("puzzle-container");

    // Loop through the puzzle pieces and create each piece
    puzzlePieces.forEach((piece) => {
        const pieceDiv = document.createElement("div");
        pieceDiv.classList.add("puzzle-piece");

        // Set up the background image and position
        pieceDiv.style.backgroundImage = `url('${currentPuzzleImage}')`;
        pieceDiv.style.backgroundPosition = `${-(piece % 4) * 100}px ${-Math.floor(piece / 4) * 100}px`;

        pieceDiv.dataset.index = piece; // Store the original index

        // Add click event listener to each piece
        pieceDiv.addEventListener("click", () => handlePieceClick(pieceDiv));

        // Append the piece to the puzzle container
        puzzleContainer.appendChild(pieceDiv);
    });
}

function clearHighScores() {
    // Remove the high scores from localStorage
    localStorage.removeItem(highScoresKey);
    
    // Clear the high scores display
    const highScoresContainer = document.getElementById("highScoresContainer");
    if (highScoresContainer) {
        highScoresContainer.innerHTML = ''; // Empty the content of the container
    }
}


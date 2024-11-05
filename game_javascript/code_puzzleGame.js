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

function checkForCompletion() {
    const pieces = document.querySelectorAll(".puzzle-piece");
    let isComplete = true;

    pieces.forEach((piece, index) => {
        if (parseInt(piece.dataset.index) !== index) {
            isComplete = false;
        }
    });

    if (isComplete) {
        stopTimer(); // Stop the timer when the puzzle is solved
        alert("Congratulations! You solved the puzzle!");

        // Check if the time qualifies as a high score
        const highScores = JSON.parse(localStorage.getItem('highScores')) || [];

        if (highScores.length < 3 || highScores.some(score => timeElapsed < score.time)) {
            const playerName = prompt("New High Score! Enter your name:");

            if (playerName) {
                updateHighScores(playerName, timeElapsed);
            }
        }

        // Display updated high scores in the existing table
        displayHighScores();
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

function showHighScoresMessage() {
    const existingMessage = document.getElementById('draggableHighScoresMessage');
    if (existingMessage) {
        existingMessage.remove(); // Remove any existing message to avoid duplicates
    }

    // Create the high scores message container
    const message = document.createElement('div');
    message.id = "draggableHighScoresMessage";
    message.classList.add('absolute', 'bg-white', 'p-6', 'rounded-lg', 'shadow-md', 'text-center', 'z-10');
    message.style.position = "fixed";
    message.style.top = "50%";
    message.style.left = "50%";
    message.style.transform = "translate(-50%, -50%)";

    message.innerHTML = `
        <div class="drag-handle" style="cursor: move; background-color: lightgray; padding: 5px; border-radius: 5px; font-weight: bold;">
            Drag Me
        </div>
        <h2 class="text-2xl font-bold mb-4">High Scores</h2>
        <div id="highScoresContainer"></div>
        <button id="closeHighScoresButton" class="mt-4 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
            Close
        </button>
    `;

    document.body.appendChild(message);

    // Display the high scores inside the highScoresContainer
    displayHighScores(document.getElementById('highScoresContainer'));

    // Add event listener to close the high scores message
    document.getElementById('closeHighScoresButton').addEventListener('click', () => {
        message.remove(); // Close the high scores container
    });

    // Make the message draggable
    makeDraggable(message);
}

// Function to check and update high scores
function updateHighScores(name, timeElapsed) {
    // Get existing high scores from localStorage, or set an empty array if none exist
    let highScores = JSON.parse(localStorage.getItem('highScores')) || [];

    // Push the new score (name + time) to the list
    highScores.push({ name: name, time: timeElapsed });

    // Sort scores in ascending order (because lower time is better)
    highScores.sort((a, b) => a.time - b.time);

    // Keep only the top 3 scores
    highScores = highScores.slice(0, 3);

    // Save the updated list back to localStorage
    localStorage.setItem('highScores', JSON.stringify(highScores));

    // Update the high scores table on the page
    displayHighScores();
}

function displayHighScores(container) {
    const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
    container.innerHTML = ''; // Clear existing content

    if (highScores.length === 0) {
        container.innerHTML = '<p>No high scores yet.</p>';
        return;
    }

    // Create table
    const highScoresTable = document.createElement('table');
    highScoresTable.classList.add('border', 'border-collapse', 'w-full');

    highScoresTable.innerHTML = `
        <thead>
            <tr>
                <th class="border px-4 py-2">Rank</th>
                <th class="border px-4 py-2">Name</th>
                <th class="border px-4 py-2">Time (seconds)</th>
            </tr>
        </thead>
        <tbody>
            ${highScores.map((score, index) => `
                <tr>
                    <td class="border px-4 py-2">${index + 1}</td>
                    <td class="border px-4 py-2">${score.name}</td>
                    <td class="border px-4 py-2">${score.time}</td>
                </tr>
            `).join('')}
        </tbody>
    `;

    container.appendChild(highScoresTable);
}

document.getElementById('highScoresButton').addEventListener('click', showHighScoresMessage);

function makeDraggable(element) {
    const dragHandle = element.querySelector('.drag-handle');
    let offsetX = 0, offsetY = 0, initialX = 0, initialY = 0;

    dragHandle.onmousedown = (e) => {
        e.preventDefault();
        initialX = e.clientX;
        initialY = e.clientY;

        document.onmousemove = drag;
        document.onmouseup = stopDrag;
    };

    function drag(e) {
        offsetX = initialX - e.clientX;
        offsetY = initialY - e.clientY;
        initialX = e.clientX;
        initialY = e.clientY;

        element.style.top = `${element.offsetTop - offsetY}px`;
        element.style.left = `${element.offsetLeft - offsetX}px`;
    }

    function stopDrag() {
        document.onmousemove = null;
        document.onmouseup = null;
    }
}


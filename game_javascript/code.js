const dogImages = [
'images/1.jpg', 'images/2.jpg', 'images/3.jpg', 'images/4.jpg', 'images/5.jpg'];

const cardCount = dogImages.length;

let cardsArray = [...dogImages, ...dogImages]; // Duplicate images to create pairs

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function createGameBoard() {
    const gameBoard = document.getElementById('gameBoard');
    gameBoard.innerHTML = ''; // Clear previous content

    // Reset timer variables
    timeElapsed = 0;
    clearInterval(timerInterval); // Clear any existing timer intervals
    timerInterval = null; // Reset timer reference
    document.getElementById('timer').textContent = `Time: ${timeElapsed} seconds`; // Reset displayed timer

    let shuffledCards = shuffle(cardsArray); // Shuffle the cards

    shuffledCards.forEach((image) => {
        const card = document.createElement('div');
        card.classList.add('card', 'bg-gray-300', 'rounded', 'cursor-pointer');
        card.setAttribute('data-image', image); // Store image data in card

        const front = document.createElement('div');
        front.classList.add('front', 'hidden'); // Hidden image side
        const img = document.createElement('img');
        img.src = image;
        img.classList.add('w-full', 'h-auto', 'rounded');
        front.appendChild(img);

        const back = document.createElement('div');
        back.classList.add('back', 'w-150px', 'h-250px', 'bg-blue-500', 'flex', 'items-center', 'justify-center', 'rounded', 'text-white');
        back.textContent = 'Click Me!';

        card.appendChild(front);
        card.appendChild(back);
        card.addEventListener('click', flipCard);
        gameBoard.appendChild(card);
    });
}

let firstCard, secondCard;
let hasFlippedCard = false;
let lockBoard = false;

let timer; // Timer variable
let timeElapsed = 0; // Time in seconds
let timerInterval; // Variable to hold the setInterval reference
let isPaused = false; // Variable to check if the game is paused

let matchedPairs = 0; // Initialize matched pairs counter
const totalPairs = cardsArray.length / 2; // Total pairs to match

// Get the overlay element
const overlay = document.getElementById('overlay');

function startTimer() {
    // Only start the timer if it isn't already running
    if (!timerInterval) {
        timerInterval = setInterval(() => {
            timeElapsed++;
            const minutes = Math.floor(timeElapsed / 60);
            const seconds = timeElapsed % 60;

            // Format minutes and seconds to display as 00:00
            const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

            // Update the displayed time
            document.getElementById('timer').textContent = `Time: ${formattedTime}`;
        }, 1000);
    }
}

function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null; // Clear the reference to the timer interval
}

let pauseTimeouts = []; // Array to store active timeouts for unflipping cards

function togglePause() {
    const pauseButton = document.getElementById('pauseGameButton');
    
    if (isPaused) {
        // Resume the game
        isPaused = false;
        pauseButton.textContent = "Pause";
        startTimer();  // Start the timer again
        overlay.classList.add('hidden');  // Hide the overlay
        lockBoard = false;  // Unlock the board so cards can be flipped

        // Resume any unflipping timeouts
        pauseTimeouts.forEach((timeout) => {
            timeout.resume();
        });
    } else {
        // Pause the game
        isPaused = true;
        pauseButton.textContent = "Resume";
        stopTimer();  // Stop the timer
        overlay.classList.remove('hidden');  // Show the overlay
        lockBoard = true;  // Lock the board to prevent card flipping

        // Hide unmatched cards if they exist
        if (firstCard && secondCard && !firstCard.classList.contains('matched') && !secondCard.classList.contains('matched')) {
            unflipCards();
        }

        // Pause any unflipping cards
        pauseTimeouts.forEach((timeout) => {
            timeout.pause();
        });
    }
}

function createPausableTimeout(callback, delay) {
    let timerId, start, remaining = delay;

    function pause() {
        clearTimeout(timerId);
        remaining -= Date.now() - start;
    }

    function resume() {
        start = Date.now();
        clearTimeout(timerId);
        timerId = setTimeout(callback, remaining);
    }

    resume();  // Start the timer when the function is called
    return { pause, resume };  // Return pause and resume functions
}

function flipCard() {
    if (lockBoard || this === firstCard || isPaused) return; // Avoid double clicking or more than 2 flips

    this.querySelector('.front img').classList.add('flipped-image');
    this.querySelector('.front').classList.remove('hidden');
    this.querySelector('.back').classList.add('hidden');

    if (!hasFlippedCard) {
        startTimer();
        hasFlippedCard = true;
        firstCard = this;
    } else {
        secondCard = this;
        checkForMatch();
    }
}

function checkForMatch() {
    if (firstCard.getAttribute('data-image') === secondCard.getAttribute('data-image')) {
        disableCards();
    } else {
        unflipCards();
    }
}

function disableCards() {
    firstCard.classList.add('matched'); // Add matched class
    secondCard.classList.add('matched'); // Add matched class

    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);

    // Increment matched pairs counter
    matchedPairs++;

    // Check for game over
    if (matchedPairs === totalPairs) {
        endGame(); // Call the end game function if all pairs are matched
    }

    resetBoard();
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
    const highScoresTable = document.createElement('table'); // Create a new table element
    highScoresTable.classList.add('highScoresTable', 'border', 'border-collapse', 'mx-auto', 'mt-4'); // Add classes for styling

    // Create table headers
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
    tbody.innerHTML = ''; // Clear existing table rows

    const highScores = JSON.parse(localStorage.getItem('highScores')) || [];

    highScores.forEach((score, index) => {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td class="border px-4 py-2">${index + 1}</td>
            <td class="border px-4 py-2">${score.name}</td>
            <td class="border px-4 py-2">${score.time}</td>
        `;
    });

    container.innerHTML = ''; // Clear existing content
    container.appendChild(highScoresTable); // Append the new table to the container
    container.classList.remove('hidden'); // Show the high scores container
}

let hasSavedScore = false; // Add this flag to track if the score has been saved

function endGame() {
    stopTimer(); // Stop the timer

    // Hide the pause button when the game ends
    document.getElementById('pauseGameButton').classList.add('hidden');

    // Retrieve high scores from localStorage
    let highScores = JSON.parse(localStorage.getItem('highScores')) || [];

    // Flag to control if we need to ask for the name
    let shouldAskForName = true;

    // Check if there are already 3 scores and if the current time is worse
    if (highScores.length === 3 && highScores[2].time <= timeElapsed) {
        shouldAskForName = false; // Don't ask for the name if the time is worse than the top 3
    }

    const existingMessage = document.querySelector('.absolute');
    if (existingMessage) {
        existingMessage.remove(); // Remove any existing message
    }

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
        <p>You have matched all the pairs in ${timeElapsed} seconds!</p>
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
    `;

    document.body.appendChild(message);

    // Create the high scores container and append it to the message
    const highScoresContainer = document.createElement('div');
    highScoresContainer.id = 'highScoresContainer';
    highScoresContainer.classList.add('hidden'); // Initially hidden
    message.appendChild(highScoresContainer);

    // Immediately show the high scores after displaying the message
    displayHighScores(highScoresContainer); // Pass the container to display scores

    // Add event listener to save score
    if (shouldAskForName) {
        document.getElementById('saveScoreButton').addEventListener('click', () => {
            const name = document.getElementById('nameInput').value;

            // Only allow saving the score if a name is entered
            if (!hasSavedScore && name) {
                updateHighScores(name, timeElapsed); // Save the high score
                hasSavedScore = true; // Set flag to true to prevent further saves
                displayHighScores(highScoresContainer); // Update displayed scores
            } else if (hasSavedScore) {
                alert("You have already saved your score!");
            } else {
                alert("Please enter a name to save your score.");
            }
        });
    }

    // Add event listener to restart the game
    document.getElementById('restartButton').addEventListener('click', restartGame);

    // Make the message draggable
    makeDraggable(message);
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

function restartGame() {
    // Remove the success message
    const message = document.querySelector('.absolute');
    if (message) message.remove();

    // Hide the high scores table
    const highScoresTable = document.getElementById('highScoresTable');
    if (highScoresTable) highScoresTable.classList.add('hidden');

    // Reset the matched pairs
    matchedPairs = 0;

    // Reset time elapsed
    timeElapsed = 0;
    clearInterval(timerInterval); // Clear any existing timer intervals
    timerInterval = null; // Reset timer reference
    document.getElementById('timer').textContent = `Time: ${timeElapsed} seconds`; // Reset displayed timer

    // Reset pause state
    isPaused = false; // Ensure the game is not paused
    document.getElementById('pauseGameButton').textContent = "Pause"; // Set pause button text to "Pause"

    // Reset overlay visibility
    overlay.classList.add('hidden'); // Ensure overlay is hidden when restarting the game

    // Reset the board lock
    lockBoard = false; // Unlock the board if needed

    // Reset hasSavedScore flag
    hasSavedScore = false; 

    // Create a new game board
    createGameBoard();

    //clearHighScores();
    
    document.getElementById('pauseGameButton').classList.remove('hidden'); // Ensure the pause button is visible
}

function clearHighScores() {
    // Remove high scores from localStorage
    localStorage.removeItem('highScores');

    // Clear the displayed high scores table
    const highScoresTable = document.getElementById('highScoresTable').getElementsByTagName('tbody')[0];
    highScoresTable.innerHTML = ''; // Clear all table rows
}

function unflipCards() {
    lockBoard = true;

    // Hide the unmatched cards after a delay (this can be customized)
    setTimeout(() => {
        if (firstCard && secondCard && !firstCard.classList.contains('matched') && !secondCard.classList.contains('matched')) {
            firstCard.querySelector('.front').classList.add('hidden');
            firstCard.querySelector('.back').classList.remove('hidden');
            secondCard.querySelector('.front').classList.add('hidden');
            secondCard.querySelector('.back').classList.remove('hidden');
        }
        resetBoard();
    }, 1000); // Change delay if necessary
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

// Add event listener for starting the game
document.getElementById('startGameButton').addEventListener('click', function () {
    createGameBoard();
    document.getElementById('startGameButton').classList.add('hidden'); // Hide Start Button
    document.getElementById('pauseGameButton').classList.remove('hidden'); // Show Pause Button
});

// Add event listener for pausing/resuming the game
document.getElementById('pauseGameButton').addEventListener('click', togglePause);

// Event listener for the Back to Start button
document.getElementById('backToStartButton').addEventListener('click', function() {
    // Redirect to initial.html
    window.location.href = 'initial_page.html';
});

// When the game starts, show the Back to Start button
document.getElementById('startGameButton').addEventListener('click', function() {
    document.getElementById('backToStartButton').style.display = 'block';
});

// Function to dynamically set the grid layout
function setGridLayout(cur_cardCount) {
    const gameBoard = document.getElementById("gameBoard");

    // Determine the optimal number of columns based on screen size
    let columns;

    // Calculate number of columns based on card count and viewport width
    const screenWidth = window.innerWidth;

    if (screenWidth >= 1024) { // Large screens
        columns = Math.min(10, cur_cardCount); // Max 10 columns
    } else if (screenWidth >= 768) { // Medium screens
        columns = Math.min(6, cur_cardCount); // Max 6 columns
    } else if (screenWidth >= 640) { // Small screens
        columns = Math.min(4, cur_cardCount); // Max 4 columns
    } else { // Extra small screens
        columns = Math.min(2, cur_cardCount); // Max 2 columns
    }

    // Calculate rows based on the card count and ensure even number of rows
    let rows = Math.ceil(cur_cardCount / columns);
    if (rows % 2 !== 0) rows += 1; // Ensure even row count

    // Set the CSS grid styles based on the calculated rows and columns
    gameBoard.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
    gameBoard.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
}

// Call this function when the page loads and also when the window is resized
window.onload = () => {
    setGridLayout(cardCount);
};

window.onresize = () => {
    setGridLayout(cardCount);
};

// Example usage: adjust layout
setGridLayout(cardCount); // Call this with the number of cards

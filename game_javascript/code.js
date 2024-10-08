const dogImages = [
'images/1.jpg', 'images/2.jpg', 'images/3.jpg', 'images/4.jpg', 'images/5.jpg'];

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
        console.log("Pausing game...");
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

// Function to display high scores in the table
function displayHighScores() {
    const highScoresTable = document.getElementById('highScoresTable');
    const tbody = highScoresTable.getElementsByTagName('tbody')[0];
    tbody.innerHTML = ''; // Clear existing table rows

    const highScores = JSON.parse(localStorage.getItem('highScores')) || [];

    if (highScores.length > 0) {
        // Make the table visible if there are any high scores
        highScoresTable.classList.remove('hidden');
    }

    highScores.forEach((score, index) => {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td class="border px-4 py-2">${index + 1}</td>
            <td class="border px-4 py-2">${score.name}</td>
            <td class="border px-4 py-2">${score.time}</td>
        `;
    });
}

let hasSavedScore = false; // Add this flag to track if the score has been saved

function endGame() {
    stopTimer(); // Stop the timer

    // Hide the pause button when the game ends
    document.getElementById('pauseGameButton').classList.add('hidden');

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
        <label for="nameInput" class="block text-gray-700 text-sm font-bold mb-2">Enter your name:</label>
        <input id="nameInput" type="text" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="Your Name">
        <button id="saveScoreButton" class="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Save Score
        </button>
        <button id="restartButton" class="mt-4 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
            Restart Game
        </button>
        <button id="showScoresButton" class="mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            Show Scores
        </button>
    </div>
    `;

    document.body.appendChild(message);

    // Add event listener to save the score
    document.getElementById('saveScoreButton').addEventListener('click', () => {
        const name = document.getElementById('nameInput').value;

        // Only allow saving the score if it hasn't been saved already
        if (!hasSavedScore && name) {
            updateHighScores(name, timeElapsed); // Save the high score
            hasSavedScore = true; // Set flag to true to prevent further saves
        } else if (hasSavedScore) {
            alert("You have already saved your score!");
        } else {
            alert("Please enter a name to save your score.");
        }
        displayHighScores(); // Show the updated high scores table
    });

    // Add event listener to restart the game
    document.getElementById('restartButton').addEventListener('click', restartGame);

    // Add event listener to show the high scores table when "Show Scores" button is clicked
    document.getElementById('showScoresButton').addEventListener('click', toggleScoreTable);

    // Make the message draggable
    makeDraggable(document.getElementById('draggableMessage'));

    // Immediately show the high scores after displaying the message
    displayHighScores(); // Display the scores table right away
}

function toggleScoreTable() {
    const highScoresTable = document.getElementById('highScoresTable');
    
    // Toggle the visibility of the high scores table
    highScoresTable.classList.toggle('hidden');
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


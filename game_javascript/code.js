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
            document.getElementById('timer').textContent = `Time: ${timeElapsed} seconds`;
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

function endGame() {
    // Stop the timer when the game ends
    stopTimer(); // Stop the timer

    // Check if the success message already exists
    const existingMessage = document.querySelector('.absolute');
    if (existingMessage) {
        existingMessage.remove(); // Remove any existing message
    }

    // Show a success message
    const message = document.createElement('div');
    message.classList.add('absolute', 'bg-white', 'p-6', 'rounded-lg', 'shadow-md', 'text-center', 'z-10');
    message.innerHTML = `
        <h2 class="text-2xl font-bold mb-2">Congratulations!</h2>
        <p>You have matched all the pairs in ${timeElapsed} seconds!</p>
        <button id="restartButton" class="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Restart Game
        </button>
    `;

    document.body.appendChild(message);

    // Add event listener to restart the game, ensuring to use `once` to prevent duplicates
    document.getElementById('restartButton').addEventListener('click', restartGame, { once: true });
}

function restartGame() {
    // Remove the success message
    const message = document.querySelector('.absolute');
    if (message) message.remove();

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

    // Create a new game board
    createGameBoard();
    
    document.getElementById('pauseGameButton').classList.remove('hidden'); // Ensure the pause button is visible
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


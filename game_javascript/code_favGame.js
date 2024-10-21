const startButton = document.getElementById('startGameButton');
const gameContainer = document.getElementById('gameContainer');
const img1 = document.getElementById('img1');
const img2 = document.getElementById('img2');
const result = document.getElementById('result');

const priorityTable = {
    'ham': 11,
    'giagia': 10,
    'claire': 9,
    'andreas': 8,
    'anastasia': 7,
    'marko': 6,
    'rea': 5,
    'maria': 4,
    'george': 3,
    'pappous': 2,
    'delivery': 1  // Lower priority
};

let img1Data, img2Data;

// Collection of images and names
const imageList = [
    { name: 'andreas', src: 'images/favorites/andreas.jpg' },
    { name: 'maria', src: 'images/favorites/maria.jpg' },
    { name: 'claire', src: 'images/favorites/claire.jpg' },
    { name: 'george', src: 'images/favorites/george.jpg' },
    { name: 'ham', src: 'images/favorites/ham.webp' },
    { name: 'delivery', src: 'images/favorites/delivery.jpeg' },
    { name: 'giagia', src: 'images/favorites/giagia.jpg' },
    { name: 'pappous', src: 'images/favorites/pappous.jpg' },
    { name: 'anastasia', src: 'images/favorites/anastasia.jpg' },
    { name: 'marko', src: 'images/favorites/marko.jpg' }
];

let currentTurn = 0; // Track the current turn
let score = 0; // Track the player's score
let previousPairs = []; // Store shown pairs to prevent repeats
let isClickable = true; // Control when images are clickable


console.log("DOM fully loaded and parsed."); // Check if script runs

// Start the game when the button is clicked
startButton.addEventListener('click', function () {
    console.log("Start button clicked!"); // Debugging statement

    // Hide the start button and show the game container
    startButton.style.display = 'none';
    gameContainer.style.display = 'block';

    // Show the round display
    const roundDisplay = document.getElementById('roundDisplay');
    roundDisplay.classList.remove('hidden'); // Remove the 'hidden' class to show the round display

    // Load initial images
    loadNewImages();
});

// Function to handle image clicks
img1.addEventListener('click', function () {
    if (isClickable) {  // Check if images are clickable
        console.log("Image 1 clicked!");
        comparePriorities(img1Data.name, img2Data.name); // Compare priorities
        isClickable = false;  // Disable further clicks for this round
    }
});

img2.addEventListener('click', function () {
    if (isClickable) {  // Check if images are clickable
        console.log("Image 2 clicked!");
        comparePriorities(img2Data.name, img1Data.name); // Compare priorities
        isClickable = false;  // Disable further clicks for this round
    }
});

// Compare priorities function
function comparePriorities(selectedName, otherName) {

    const selectedPriority = priorityTable[selectedName];
    const otherPriority = priorityTable[otherName];

    // Check if the selected name has a higher priority
    if (selectedPriority > otherPriority) {
        result.textContent = `Correct!`;
        score++; // Increment score for correct answer
    } else {
        result.textContent = `Wrong!`;
    }

    currentTurn++; // Increment turn count

    // Load new images after showing the result
    setTimeout(loadNewImages, 2000);
}

// Load new images function
function loadNewImages() {

    // Re-enable clicks for the new round
    isClickable = true;  

    // Update round display
    roundDisplay.textContent = `Round: ${currentTurn + 1}/10`; // Update round display

    console.log("Loading new images..."); // Debugging statement
    result.textContent = ""; // Clear result text

    // Check if the game is over
    if (currentTurn >= 10) {
        endGame();
        return; // Exit the function if the game is over
    }

    // Randomly select two different images
    const newImages = getTwoNewImageIndexes();
    img1Data = imageList[newImages[0]];
    img2Data = imageList[newImages[1]];

    // Update image elements
    img1.src = img1Data.src;
    img2.src = img2Data.src;

    // Store the current pair to prevent repeats
    previousPairs.push([newImages[0], newImages[1]]);
}

// Helper function to randomly select two new image indexes
function getTwoNewImageIndexes() {
    let index1, index2;
    do {
        index1 = Math.floor(Math.random() * imageList.length);
        index2 = Math.floor(Math.random() * imageList.length);
    } while (index1 === index2 || previousPairs.some(pair => (pair[0] === index1 && pair[1] === index2) || (pair[0] === index2 && pair[1] === index1))); // Ensure the two images are different and not previously shown

    return [index1, index2];
}

// Helper function to capitalize names
function capitalize(name) {
    return name.charAt(0).toUpperCase() + name.slice(1);
}

// End the game function
function endGame() {
    result.textContent = `Game over! Your final score is: ${score} points!`;
    roundDisplay.textContent = ""; // Clear round display
    img1.style.display = 'none'; // Hide images
    img2.style.display = 'none'; // Hide images
}

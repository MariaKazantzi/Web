const startButton = document.getElementById('startGameButton');
const gameContainer = document.getElementById('gameContainer');
const img1 = document.getElementById('img1');
const img2 = document.getElementById('img2');
const result = document.getElementById('result');

// Priority table for each person
const priorityTable = {
    'ham': 6,
    'claire': 5,
    'andreas': 4,
    'maria': 3,
    'george': 2,
    'delivery': 1  // Lower priority
};

// Initial image assignment
let img1Data, img2Data;

// Collection of images and names
const imageList = [
    { name: 'andreas', src: 'images/favorites/andreas.jpg' },
    { name: 'maria', src: 'images/favorites/maria.jpg' },
    { name: 'claire', src: 'images/favorites/claire.jpg' },
    { name: 'george', src: 'images/favorites/george.jpg' },
    { name: 'ham', src: 'images/favorites/ham.webp' },
    { name: 'delivery', src: 'images/favorites/delivery.jpeg' }
];

console.log("DOM fully loaded and parsed."); // Check if script runs

// Start the game when the button is clicked
startButton.addEventListener('click', function () {
    console.log("Start button clicked!"); // Debugging statement

    // Hide the start button and show the game container
    startButton.style.display = 'none';
    gameContainer.style.display = 'block';

    // Load initial images
    loadNewImages();
});

// Function to handle image clicks
img1.addEventListener('click', function () {
    console.log("Image 1 clicked!");
    comparePriorities(img1Data.name, img2Data.name); // Compare priorities
});

img2.addEventListener('click', function () {
    console.log("Image 2 clicked!");
    comparePriorities(img2Data.name, img1Data.name); // Compare priorities
});

// Compare priorities function
function comparePriorities(selectedName, otherName) {
    const selectedPriority = priorityTable[selectedName];
    const otherPriority = priorityTable[otherName];

    if (selectedPriority > otherPriority) {
        result.textContent = `Correct!`;
    } else {
        result.textContent = `Wrong!`;
    }

    // Load new images after showing the result
    setTimeout(loadNewImages, 2000);
}

// Load new images function
function loadNewImages() {
    console.log("Loading new images..."); // Debugging statement
    result.textContent = ""; // Clear result text

    // Randomly select two different images
    const newImages = getTwoNewImageIndexes();
    img1Data = imageList[newImages[0]];
    img2Data = imageList[newImages[1]];

    // Update image elements
    img1.src = img1Data.src;
    img2.src = img2Data.src;
}

// Helper function to randomly select two new image indexes
function getTwoNewImageIndexes() {
    let index1, index2;
    do {
        index1 = Math.floor(Math.random() * imageList.length);
        index2 = Math.floor(Math.random() * imageList.length);
    } while (index1 === index2); // Ensure the two images are different

    return [index1, index2];
}

// Helper function to capitalize names
function capitalize(name) {
    return name.charAt(0).toUpperCase() + name.slice(1);
}

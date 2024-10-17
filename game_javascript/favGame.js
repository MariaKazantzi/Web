// Add event listener for starting the game
document.getElementById('startGameButton').addEventListener('click', function () {
    createGameBoard();
    document.getElementById('startGameButton').classList.add('hidden'); // Hide Start Button
    document.getElementById('pauseGameButton').classList.remove('hidden'); // Show Pause Button
});

document.addEventListener('DOMContentLoaded', function() {
    const startButton = document.getElementById('startGameButton');
    const gameContainer = document.getElementById('gameContainer');
    const img1 = document.getElementById('C:\Users\HP\Desktop\Web\images\favorites\andreas.jpg');
    const img2 = document.getElementById('C:\Users\HP\Desktop\Web\images\favorites\maria.jpg');
    const result = document.getElementById('result');

    // Nugget lover (just for this example)
    let nuggetLover = 1; // Person 1 likes nuggets more

    // Start the game when the button is clicked
    startButton.addEventListener('click', function() {
        console.log("Start button clicked!"); // Debugging statement
        // Hide the start button and show the game container
        startButton.style.display = 'none';
        gameContainer.style.display = 'block';
    });

    img1.addEventListener('click', function() {
        console.log("Image 1 clicked!"); // Debugging statement
        if (nuggetLover === 1) {
            result.textContent = "Correct! Person 1 likes nuggets more.";
        } else {
            result.textContent = "Wrong! Person 2 likes nuggets more.";
        }
        loadNewImages();
    });

    img2.addEventListener('click', function() {
        console.log("Image 2 clicked!"); // Debugging statement
        if (nuggetLover === 2) {
            result.textContent = "Correct! Person 2 likes nuggets more.";
        } else {
            result.textContent = "Wrong! Person 1 likes nuggets more.";
        }
        loadNewImages();
    });

    function loadNewImages() {
        console.log("Loading new images..."); // Debugging statement
        // Logic to load new images would go here
        setTimeout(() => {
            result.textContent = ""; // Clear result after a while
        }, 2000);
    }
});

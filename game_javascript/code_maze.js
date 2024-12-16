let timerInterval = null; // Holds the reference to the timer interval
let timeElapsed = 0; // Tracks the elapsed time in seconds

const CELL_SIZE = 50; // Size of each cell in pixels

const maze = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 0, 1, 1, 0, 1, 0, 1],
  [1, 0, 0, 0, 0, 1, 0, 1, 0, 1],
  [1, 1, 1, 1, 0, 1, 1, 0, 0, 1],
  [1, 0, 0, 0, 0, 1, 0, 0, 1, 1],
  [1, 0, 1, 1, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 1, 1, 1, 1, 1, 0, 1],
  [1, 1, 0, 1, 0, 0, 0, 1, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

const mazeDiv = document.getElementById("maze");
const playerDiv = document.getElementById("player");
const treatDiv = document.getElementById("treat");


maze.forEach((row) => {
  row.forEach((cell) => {
    const div = document.createElement("div");
    div.classList.add("cell", cell === 1 ? "wall" : "path");
    mazeDiv.appendChild(div);
  });
});

// Find the first empty cell (top-left corner of the maze that is 0)
function findFirstEmptyCell(maze) {
  for (let y = 0; y < maze.length; y++) {
      for (let x = 0; x < maze[y].length; x++) {
          if (maze[y][x] === 0) {
              return { x, y }; // Return the coordinates of the first empty cell
          }
      }
  }
  return null; // No empty cell found
}

// Place the player at the first empty cell
let player = findFirstEmptyCell(maze);
if (player) {
  setPosition(playerDiv, player.x, player.y);
} else {
  console.error("No empty cell found in the maze for the player.");
}

function findRandomEmptyCell(maze, player) {
  const emptyCells = [];

  // Collect all empty cells
  maze.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell === 0 && !(x === player.x && y === player.y)) {
        emptyCells.push({ x, y }); // Add the cell to the list
      }
    });
  });

  // Pick a random empty cell
  if (emptyCells.length > 0) {
    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    return emptyCells[randomIndex];
  }
  return null; // Return null if no empty cells are found
}


// Place the treat in a random empty cell
let newTreat = findRandomEmptyCell(maze, player);
if (newTreat) {
  treat = newTreat; // Update the treat's position
  setPosition(treatDiv, treat.x, treat.y); // Update treat's position visually
} else {
  console.error("No empty cell found for the treat.");
}


// Set player or treat position using CSS transform
function setPosition(element, x, y) {
  const mazeRect = mazeDiv.getBoundingClientRect(); // Get maze's position in the viewport
  const mazeOffsetX = mazeRect.left; // Horizontal offset
  const mazeOffsetY = mazeRect.top;  // Vertical offset

  // Apply the offset when setting the position
  element.style.position = "absolute";
  element.style.left = `${mazeOffsetX + x * CELL_SIZE}px`;
  element.style.top = `${mazeOffsetY + y * CELL_SIZE}px`;
}


setPosition(playerDiv, player.x, player.y);
setPosition(treatDiv, treat.x, treat.y);

let treatsCollected = 0; // Counter for collected treats

document.addEventListener("keydown", (event) => {
  const { x, y } = player;

  // Move the player if the target cell is free
  if (event.key === "ArrowUp" && maze[y - 1][x] === 0) player.y--;
  if (event.key === "ArrowDown" && maze[y + 1][x] === 0) player.y++;
  if (event.key === "ArrowLeft" && maze[y][x - 1] === 0) player.x--;
  if (event.key === "ArrowRight" && maze[y][x + 1] === 0) player.x++;

  updatePlayerPosition();

  // Check if player reaches the treat
  if (player.x === treat.x && player.y === treat.y) {
    treatsCollected++; // Increment the counter

    // Hide the treat
    treatDiv.style.display = "none";

    if (treatsCollected < 5) {
      // Find a new random position for the treat
      const newTreatPosition = findRandomEmptyCell(maze, player);
      // Update treat display
      treatDisplay.textContent = `Treats: ${treatsCollected}/5`;

      if (newTreatPosition) {
        treat = newTreatPosition; // Update the treat position
        setPosition(treatDiv, treat.x, treat.y); // Update its visual position
        treatDiv.style.display = "block"; // Show the treat again
        
      } else {
        console.error("No empty position available to place a new treat.");
      }
    } else {
      console.log("All treats collected! Game over or proceed with next logic.");

      // Update treat display
      treatDisplay.textContent = `Treats: ${treatsCollected}/5`;

      stopTimer(); // Stop the game timer if applicable
    }
  }
});

function updatePlayerPosition() {
  setPosition(playerDiv, player.x, player.y);
}

// Create the maze grid
function createMaze() {
  mazeDiv.style.display = "grid";  // Use grid layout
  mazeDiv.style.gridTemplateColumns = `repeat(${maze[0].length}, ${CELL_SIZE}px)`;  // Set number of columns based on maze width
  mazeDiv.style.gridTemplateRows = `repeat(${maze.length}, ${CELL_SIZE}px)`;  // Set number of rows based on maze height
  mazeDiv.style.position = "relative";  // Important for positioning elements inside the maze

  // Create each cell in the maze
  maze.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      const div = document.createElement("div");
      div.classList.add("cell", cell === 1 ? "wall" : "path");
      div.style.width = `${CELL_SIZE}px`;
      div.style.height = `${CELL_SIZE}px`;
      mazeDiv.appendChild(div);
    });
  });
}

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

// When the game starts, show the Back to Start button
document.getElementById('startGameButton').addEventListener('click', function() {
  gameStarted = true; // Allow the game to start
  document.getElementById('backToStartButton').style.display = 'block';
  document.getElementById('startGameButton').style.display = 'none';

  // Show the treat display
  const treatDisplay = document.getElementById('treatDisplay');
  treatDisplay.classList.remove('hidden'); // Remove the 'hidden' class to show the round display

  startTimer();
});

// Event listener for the Back to Start button
document.getElementById('backToStartButton').addEventListener('click', function() {
  // Redirect to initial.html
  window.location.href = 'initial_page.html';  
});




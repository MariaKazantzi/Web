
// Event listener for the Back to Start button
document.getElementById('backToStartButton').addEventListener('click', function() {
  // Redirect to initial.html
  window.location.href = 'initial_page.html';
});

// When the game starts, show the Back to Start button
document.getElementById('startGameButton').addEventListener('click', function() {
  gameStarted = true; // Allow the game to start
  document.getElementById('backToStartButton').style.display = 'block';
  document.getElementById('startGameButton').style.display = 'none';
});

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

let player = { x: 1, y: 1 }; // Player starting position (grid cell [1, 1])
let treat = { x: 6, y: 6 }; // Treat position (grid cell [6, 6])

setPosition(playerDiv, player.x, player.y);
setPosition(treatDiv, treat.x, treat.y);


// Set player or treat position using CSS transform
function setPosition(element, x, y) {
  element.style.position = "absolute";  // Use absolute positioning within the maze container
  element.style.transform = `translate(${x * CELL_SIZE}px, ${y * CELL_SIZE}px)`; // Position based on grid cell size
}


setPosition(playerDiv, player.x, player.y);
setPosition(treatDiv, treat.x, treat.y);

document.addEventListener("keydown", (event) => {
  const { x, y } = player;

  if (event.key === "ArrowUp" && maze[y - 1][x] === 0) player.y--;
  if (event.key === "ArrowDown" && maze[y + 1][x] === 0) player.y++;
  if (event.key === "ArrowLeft" && maze[y][x - 1] === 0) player.x--;
  if (event.key === "ArrowRight" && maze[y][x + 1] === 0) player.x++;

  updatePlayerPosition();

  // Check if player reaches the treat
  if (player.x === treat.x && player.y === treat.y) {
    alert("Congratulations! Your dog got the treat!");
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




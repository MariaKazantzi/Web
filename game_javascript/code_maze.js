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

const maze = [
  [1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 1, 0, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 1],
  [1, 0, 1, 0, 0, 0, 0, 1],
  [1, 0, 0, 1, 1, 0, 1, 1],
  [1, 1, 0, 0, 1, 0, 0, 1],
  [1, 0, 1, 0, 1, 1, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1],
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

let player = { x: 1, y: 1 }; // Starting position
let treat = { x: 3, y: 3 }; // Treat position

// Set treat position
function setPosition(element, x, y) {
  element.style.transform = `translate(${x * 50}px, ${y * 50}px)`; // 50px = cell size
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


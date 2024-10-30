// JavaScript array to hold shuffled positions
let puzzlePieces = [...Array(16).keys()]; // For a 4x4 grid
puzzlePieces = puzzlePieces.sort(() => Math.random() - 0.5);

let selectedPiece = null; // To keep track of the first selected piece

puzzlePieces.forEach((piece) => {
    const pieceDiv = document.createElement("div");
    pieceDiv.classList.add("puzzle-piece");

    // Set up the background image and position
    pieceDiv.style.backgroundImage = "url('images/11.jpg')";
    pieceDiv.style.backgroundPosition = `${-(piece % 4) * 100}px ${-Math.floor(piece / 4) * 100}px`;

    pieceDiv.dataset.index = piece; // Store the original index

    // Add click event listener to each piece
    pieceDiv.addEventListener("click", () => handlePieceClick(pieceDiv));

    // Append the piece to the puzzle container
    document.getElementById("puzzle-container").appendChild(pieceDiv);
});

// Handle click events on pieces
function handlePieceClick(piece) {
    if (selectedPiece === null) {
        // First click: Select the piece
        selectedPiece = piece;
        piece.classList.add("selected"); // Optional: Add a visual indicator for selected piece
    } else {
        // Second click: Swap with the previously selected piece
        swapPieces(selectedPiece, piece);
        selectedPiece.classList.remove("selected");
        selectedPiece = null; // Reset selection

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

// Check if all pieces are in the correct order
function checkForCompletion() {
    const pieces = document.querySelectorAll(".puzzle-piece");
    let isComplete = true;

    pieces.forEach((piece, index) => {
        if (parseInt(piece.dataset.index) !== index) {
            isComplete = false;
        }
    });

    if (isComplete) {
        alert("Congratulations! You solved the puzzle!");
    }
}


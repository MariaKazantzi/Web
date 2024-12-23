const dogB = document.getElementById("dogB"); // Dog before fetching
const dogA = document.getElementById("dogA"); // Dog after fetching
const dogR = document.getElementById("dogR"); // Dog resting
const dogBa = document.getElementById("dogBa"); // Dog after fetching back

const ball = document.getElementById("ball");
const container = document.getElementById("game-container");

let ballThrown = false;
let gameStarted = false; // Flag to control the game state
let dogResting = false; // To track if the dog is resting

let stamina = 90;

container.addEventListener("click", (e) => {

    if (!gameStarted || dogResting) return; // Prevent actions if game hasn't started

    if (!ballThrown) {
        // Move the ball to where the user clicked
        const clickX = e.clientX - container.offsetLeft;
        ball.style.left = `${clickX - 20}px`;

        ballThrown = true;

        // Show dogB while running to the ball
        dogB.style.display = "block";
        dogBa.style.display = "none";
        dogR.style.display = "none";
        dogA.style.display = "none";

        // Move the dog to the ball's position
        setTimeout(() => {
            dogB.style.transform = `translateX(${clickX - 40}px)`;

            // Dog picks up the ball
            setTimeout(() => {
                // Show dogA and hide dogB while returning
                dogB.style.display = "none";
                dogBa.style.display = "none";
                dogR.style.display = "none";
                dogA.style.display = "block";

                // Start dogA at the ball's position
                dogA.style.transform = `translateX(${clickX - 40}px)`;

                // Move dogA back to the starting position
                setTimeout(() => {
                    dogA.style.transform = `translateX(0)`; // Move back to start

                    // Reset ball and dog positions for next throw
                    setTimeout(() => {
                        ball.style.left = `${20}px`; // Reset ball to starting position

                        dogA.style.display = "none"; // Hide dogA
                        dogB.style.display = "none";
                        dogR.style.display = "none";
                        dogBa.style.display = "block";

                        dogB.style.transform = `translateX(0)`; // Reset dogB to starting position
                        ballThrown = false; // Allow another throw
                    }, 1000); // Duration for dog returning to start
                }, 10); // Delay to start moving back smoothly
            }, 1000); // Wait for dog to reach the ball
        }, 1000); // Duration for dog running to the ball
    }

    setTimeout(() => {
        decreaseStamina(); // Check if dog needs rest after completing a fetch
        ballThrown = false; // Allow another throw
    }, 2000); // Delay to simulate the dog completing fetch
});


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


function decreaseStamina() {
    stamina -= 30; // Decrease stamina with each throw

    if (stamina <= 0) { // Rest if stamina is depleted
        dogResting = true; // Dog is resting
        alert("Nugget needs to rest for 5 seconds!");

        setTimeout(() => {
            // After 5 seconds, reset the dog's state
            stamina = 90; // Reset stamina
            dogResting = false; // Allow fetching again

            dogR.style.display = "block";
            dogBa.style.display = "none";
            dogA.style.display = "none";
            dogB.style.display = "none";

        }, 5000); // 5 seconds rest
    }
}


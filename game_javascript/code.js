const dogImages = [
'images/1.jpg', 'images/2.jpg', 'images/3.jpg', 'images/4.jpg', 'images/5.jpg',
'images/6.jpg', 'images/7.jpg', 'images/8.jpg', 'images/9.jpg', 'images/10.jpg',
'images/11.jpg', 'images/12.jpg', 'images/13.jpg', 'images/14.jpg', 'images/15.jpg'];

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

function startTimer() {
    timerInterval = setInterval(() => {
        timeElapsed++;
        document.getElementById('timer').textContent = `Time: ${timeElapsed} seconds`;
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
}

function flipCard() {
    if (lockBoard || this === firstCard) return; // Avoid double clicking or more than 2 flips

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
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    resetBoard();
}

function unflipCards() {
    lockBoard = true;
    setTimeout(() => {
        firstCard.querySelector('.front').classList.add('hidden');
        firstCard.querySelector('.back').classList.remove('hidden');
        secondCard.querySelector('.front').classList.add('hidden');
        secondCard.querySelector('.back').classList.remove('hidden');
        resetBoard();
    }, 1000);
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

document.getElementById('startGameButton').addEventListener('click', function () {
    createGameBoard();
});


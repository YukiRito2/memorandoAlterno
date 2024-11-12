    /* const cards = [
        '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼',
        '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧'
    ];
    */

const cards = [
    '🐶', '🐱', '🐭', '🐹','🦁', '🐮', '🐷', '🐸', '🐵', '🐔'
];

let selectedCardElements = [];
let selectedCards = [];
let matchedCards = [];
let startTime;
let elapsedTime = 0;
let timerInterval;
let isFlipping = false;
let isTimerRunning = false;
let matchesCount = 0;
let totalAttemptsCount = 0;
let totalPoints = 0;
let bonusPoints = 0;

const pointsElement = document.getElementById("total-points");
const bonusElement = document.getElementById("bonus-points");
const timerElement = document.getElementById("timer");
const matchesElement = document.getElementById('matches');
const totalAttemptsElement = document.getElementById('total-attempts');


function createCardElement(card) {
    const cardElement = document.createElement('div');
    cardElement.classList.add('card');
    cardElement.innerHTML = `<div class="card-front">${card}</div><div class="card-back"></div>`;
    cardElement.addEventListener('click', () => flipCard(cardElement, card));
    return cardElement;
}

function createCards() {
    const shuffledCards = [...cards, ...cards].sort(() => Math.random() - 0.5);
    const grid = document.querySelector('.grid');
    for (const card of shuffledCards) {
        const cardElement = createCardElement(card);
        grid.appendChild(cardElement);
    }
}

function flipCard(cardElement, card) {
    if (isFlipping || selectedCards.length === 2 || matchedCards.includes(card) || selectedCardElements.includes(cardElement)) {
        return;
    }

    const cardFront = cardElement.querySelector('.card-front');
    cardFront.classList.toggle('hidden');
    cardElement.classList.add('flipped');
    selectedCardElements.push(cardElement);
    selectedCards.push(card);
    backgroundAudio.play();

    if (selectedCards.length === 2) {
        isFlipping = true;
        setTimeout(checkMatch, 50);
        backgroundAudio.play();
    }

    if (selectedCards.length === 1 && !isTimerRunning) {
        isTimerRunning = true;
        startTimer();
    }
}

const matchSound = new Audio('css/mp3/wow.mp3');

function checkMatch() {
    const card1 = selectedCardElements[0];
    const card2 = selectedCardElements[1];
    const card1Front = card1.querySelector('.card-front');
    const card2Front = card2.querySelector('.card-front');
    const card1Text = selectedCards[0];
    const card2Text = selectedCards[1];

    if (card1Text === card2Text) {
        card1Front.classList.add('hidden');
        card2Front.classList.add('hidden');
        card1.classList.add('matched');
        card2.classList.add('matched');
        matchedCards.push(card1Text);
        selectedCardElements = [];
        selectedCards = [];
        matchesCount++;
        matchesElement.textContent = matchesCount;
        playMatchSound();
        checkWin();
        calculatePoints(elapsedTime, selectedCardElements.length);
    } else {
        setTimeout(() => {
            card1Front.classList.toggle('hidden');
            card2Front.classList.toggle('hidden');
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            totalAttemptsCount++;
            totalAttemptsElement.textContent = totalAttemptsCount;
            selectedCardElements = [];
            selectedCards = [];
        }, 500);
    }
    isFlipping = false;
}

function playMatchSound() {
    matchSound.play();
}

function restartGame() {
    clearInterval(timerInterval);
    startTime = null;
    elapsedTime = 0;
    isGameWon = false;
    isTimerRunning = false;
    location.reload();
    const grid = document.querySelector('.grid');
    grid.innerHTML = '';
    selectedCardElements = [];
    selectedCards = [];
    matchedCards = [];
    matchesCount = 0;
    matchesElement.textContent = matchesCount;
    totalAttemptsCount = 0;
    totalAttemptsElement.textContent = totalAttemptsCount;
    createCards();
    backgroundAudio.play();
}

let isGameWon = false;

function checkWin() {
    if (matchedCards.length === cards.length && !isGameWon) {
        clearInterval(timerInterval);
        const elapsedTimeString = formatElapsedTime(elapsedTime);
        setTimeout(() => {
            alert(`¡Has ganado el juego en ${elapsedTimeString}!`);
            backgroundAudio.pause();
            isGameWon = true;
            isTimerRunning = false;
        }, 500);
    }
}

function startTimer() {
    startTime = new Date().getTime();

    timerInterval = setInterval(() => {
        const now = new Date().getTime();
        elapsedTime = now - startTime;

        const elapsedTimeString = formatElapsedTime(elapsedTime);

        timerElement.textContent = elapsedTimeString;
    }, 1000);
}

function formatElapsedTime(time) {
    const minutes = Math.floor(time / (1000 * 60));
    const seconds = Math.floor((time % (1000 * 60)) / 1000);
    const minutesString = minutes.toString().padStart(2, '0');
    const secondsString = seconds.toString().padStart(2, '0');
    return `${minutesString}:${secondsString}`;
}

// Calcula los puntos totales teniendo en cuenta el tiempo transcurrido y los intentos fallidos
function calculatePoints(elapsedTime) {
    const maxPoints = 1000;                     // Puntos por acierto rápido
    const minPoints = 250;                      // Puntos mínimos por acierto tardío
    const maxTime = 3000;                       // Tiempo en milisegundos para puntaje máximo
    const bonusMultiplier = 0.1;                // Multiplicador de puntos de bonificación

    // Calcular puntos según el tiempo transcurrido
    let pointsEarned;
    if (elapsedTime <= maxTime) {
        pointsEarned = maxPoints;
    } else {
        pointsEarned = Math.max(minPoints, maxPoints - ((elapsedTime - maxTime) / 10));
    }

    // Redondear los puntos calculados
    pointsEarned = Math.round(pointsEarned);

    // Actualizar los puntos totales y de bonificación, redondeando los resultados
    totalPoints = Math.round(totalPoints + pointsEarned);
    bonusPoints = Math.round(bonusPoints + (pointsEarned * bonusMultiplier));

    // Actualizar el tablero de puntuación
    updatePointsDisplay();
}

  



// Actualiza la visualización de los puntos en el DOM
function updatePointsDisplay() {
    pointsElement.textContent = totalPoints;    // Actualizar el total de puntos
    bonusElement.textContent = bonusPoints;     // Actualizar los puntos de bonificación
}



const backgroundAudio = document.getElementById('background-audio');

document.addEventListener('DOMContentLoaded', () => {
    backgroundAudio.play();
    createCards();
});

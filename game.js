const gridSize = 9;
const grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(null));

const container = document.querySelector('.game_field');

// Генерация клеток
for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
        const cell = document.createElement('div');
        cell.classList.add('game_square');
        cell.dataset.x = x;
        cell.dataset.y = y;
        container.appendChild(cell);
    }
}

const gameSquares = document.querySelectorAll('.game_square');

let activeBall = null;
let target = null;
let isStartMoving = false;
let startSquare = null;

gameSquares.forEach(square => {
    square.addEventListener('click', () => {
        const x = +square.dataset.x;
        const y = +square.dataset.y;

        if (isStartMoving) {
            if (square === startSquare) {
                delete startSquare.dataset.active;
                isStartMoving = !isStartMoving;
            }
            if (grid[x][y] !== null) {
                return;
            }
            const startX = +startSquare.dataset.x;
            const startY = +startSquare.dataset.y;
            const path = findPath(startX, startY, x, y);

            if (!path) {
                return;
            }

            grid[x][y] = +startSquare.dataset.color;
            square.dataset.color = startSquare.dataset.color;
            square.dataset.ball = true;
            grid[startX][startY] = null;
            delete startSquare.dataset.color;
            delete startSquare.dataset.ball;
            delete startSquare.dataset.active;
            isStartMoving = !isStartMoving;

            if (processLines()) {
                return;
            }

            pushNewBalls();

            return;
        }

        if (grid[x][y] === null) {
            return;
        } else {
            isStartMoving = !isStartMoving;
            startSquare = square;
            square.dataset.active = true;
        }
    });
});

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomSquare() {
    const square = gameSquares[getRandomInt(0, gameSquares.length - 1)];

    if (square.dataset.ball) {
        return getRandomSquare();
    } else {
        return square;
    }
}

function createBall() {
    const colorNum = getRandomInt(1, 3);
    const square = getRandomSquare();
    const x = +square.dataset.x;
    const y = +square.dataset.y;
    grid[x][y] = colorNum;
    square.dataset.color = colorNum;
    square.dataset.ball = true;
}

function pushNewBalls() {
    createBall();
    createBall();
    createBall();
    processLines();
}

pushNewBalls();

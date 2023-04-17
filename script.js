//HTML Elements
const board = document.getElementById('board');
const scoreBoard = document.getElementById('scoreBoard');
const startButton = document.getElementById('startButton');
const gameOverSign = document.getElementById('gameOver');
const upButton = document.getElementById('upButton');
const downButton = document.getElementById('downButton');
const leftButton = document.getElementById('leftButton');
const rightButton = document.getElementById('rightButton');

//Game settings
const boardSize = 10;
const gameSpeed = 150;
const squareTypes = {
    emptySquare: 0,
    snakeSquare: 1,
    foodSquare: 2,
};

const directions = {
    ArrowUp: -10,
    ArrowDown: 10,
    ArrowRight: 1,
    ArrowLeft: -1,
};

//Game variables
let snake;
let score;
let direction;
let boardSquares;
let emptySquares;
let moveInterval;

// ------ FUNCTIONS IN GAME -------

// Movements
const setDirection = newDirection => {
    direction = newDirection;
}

const directionEvent = (key, newDirection) => {
    const directionToSet = newDirection || key.code;
    switch (directionToSet) {
        case 'ArrowUp':
            direction != 'ArrowDown' && setDirection(directionToSet);
            break;
        case 'ArrowDown':
            direction != 'ArrowUp' && setDirection(directionToSet);
            break;
        case 'ArrowLeft':
            direction != 'ArrowRight' && setDirection(directionToSet);
            break;
        case 'ArrowRight':
            direction != 'ArrowLeft' && setDirection(directionToSet);
            break;
    };
};

upButton.addEventListener('click', () => {
    directionEvent(null, 'ArrowUp');
});

downButton.addEventListener('click', () => {
    directionEvent(null, 'ArrowDown');
});

leftButton.addEventListener('click', () => {
    directionEvent(null, 'ArrowLeft');
});

rightButton.addEventListener('click', () => {
    directionEvent(null, 'ArrowRight');
});

const moveSnake = () => {
    const newSquare = String(
        Number(snake[snake.length - 1]) + directions[direction])
        .padStart(2, '0');
    const [row, column] = newSquare.split('');


    if( newSquare < 0 || 
        newSquare > boardSize * boardSize  ||
        (direction === 'ArrowRight' && column == 0) ||
        (direction === 'ArrowLeft' && column == 9 ||
        boardSquares[row][column] === squareTypes.snakeSquare) ) {
        gameOver();
    } else {
        snake.push(newSquare);
        if(boardSquares[row][column] === squareTypes.foodSquare) {
            addFood();
        } else {
            const emptySquare = snake.shift();
            drawSquare(emptySquare, 'emptySquare');
        }
        drawSnake();
    };
};

// Food
const addFood = () => {
    score++;
    updateScore();
    createRandomFood();
};

const createRandomFood = () => {
    const randomEmptySquare = emptySquares[Math.floor(Math.random() * emptySquares.length)];
    drawSquare(randomEmptySquare, 'foodSquare');
};

// Signs

const gameOver = () => {
    gameOverSign.style.display = 'block';
    clearInterval(moveInterval)
    startButton.disabled = false;
};

const updateScore = () => {
    scoreBoard.innerText = score;
};

// ------ MAQUETEADO -------

const drawSnake = () => {
    snake.forEach( square => drawSquare(square, 'snakeSquare'));
};

const drawSquare = (square, type) => {
    const [ row, column ] = square.split('');
    boardSquares[row][column] = squareTypes[type];
    const squareElement = document.getElementById(square);
    squareElement.setAttribute('class', `square ${type}`);

    if(type === 'emptySquare') {
        emptySquares.push(square);
    } else {
        if(emptySquares.indexOf(square) !== -1) {
            emptySquares.splice(emptySquares.indexOf(square), 1);
        };
    };
};

const createBoard = () => {
    boardSquares.forEach( (row, rowIndex) => {
        row.forEach( (column, columnndex) => {
            const squareValue = `${rowIndex}${columnndex}`;
            const squareElement = document.createElement('div');
            squareElement.setAttribute('class', 'square emptySquare');
            squareElement.setAttribute('id', squareValue);
            board.appendChild(squareElement);
            emptySquares.push(squareValue);
        });
    });
};

const setGame = () => {
    snake = ['00', '01', '02', '03'];
    score = snake.length - 4;
    direction = 'ArrowRight';
    boardSquares = Array.from(Array(boardSize), () => new Array(boardSize).fill(squareTypes.emptySquare));
    console.log(boardSquares);
    board.innerHTML = '';
    emptySquares = [];
    createBoard();
}

const startGame = () => {
    setGame();
    gameOverSign.style.display = 'none';
    startButton.disabled = true;
    drawSnake();
    updateScore();
    createRandomFood();
    document.addEventListener('keydown', directionEvent);
    moveInterval = setInterval( () => moveSnake(), gameSpeed);
}

startButton.addEventListener('click', startGame);

document.addEventListener('keydown', (event) => {
    if (event.code === "Enter") {
        startGame();
    }
});
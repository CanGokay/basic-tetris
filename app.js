document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('tetrisCanvas');
    const ctx = canvas.getContext('2d');
    const blockSize = 30;
    const width = 10;
    const height = 20;
    const board = Array.from({ length: height }, () => Array(width).fill(null));
    let score = 0;

    // blok şekilleri
    const lTetromino = [
        [[1, 1, 1, 1]],
        [[1, 1, 1], [1]],
        [[1, 1], [1, 1]],
        [[1, 1, 1], [0, 0, 1]],
    ];

    let currentTetromino;
    let currentIndex = { x: 0, y: 0 }; //yer
    let intervalId; 

    // puan
    const scoreElement = document.getElementById('score');

    // blokların alanı
    canvas.width = width * blockSize;
    canvas.height = height * blockSize;

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBoard();
        drawTetromino();
    }
//oyun alanı
    function drawBoard() {
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                if (board[y][x] !== null) {
                    drawBlock(x, y, board[y][x], 'black');
                } else {
                    drawBlock(x, y, 'white', 'black');
                }
            }
        }
    }

    function drawTetromino() {
        if (currentTetromino) {
            currentTetromino.shape.forEach((row, y) => {
                row.forEach((value, x) => {
                    if (value === 1) {
                        drawBlock(currentIndex.x + x, currentIndex.y + y, currentTetromino.color, 'black');
                    }
                });
            });
        }
    }

    function drawBlock(x, y, color, borderColor) {
        ctx.fillStyle = color;
        ctx.fillRect(x * blockSize, y * blockSize, blockSize, blockSize);
        ctx.strokeStyle = borderColor;
        ctx.strokeRect(x * blockSize, y * blockSize, blockSize, blockSize);
    }

    function getRandomColor() {
        return '#' + Math.floor(Math.random() * 16777215).toString(16);
    }
    // oyun alanı

    function moveDown() {
        currentIndex.y++;
        if (!isValidMove()) {
            currentIndex.y--;
            placeTetromino();
            const linesCleared = clearLines();
            updateScore(linesCleared);
            spawnTetromino();
        }
        draw();
    }

    // manuel aşağı inme 

    function isValidMove() {
        return currentTetromino.shape.every((row, y) => {
            return row.every((value, x) => {
                if (value === 0) return true;
                return (
                    board[currentIndex.y + y] &&
                    board[currentIndex.y + y][currentIndex.x + x] === null
                );
            });
        });
    }

    function placeTetromino() {
        currentTetromino.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value === 1) {
                    board[currentIndex.y + y][currentIndex.x + x] = currentTetromino.color;
                }
            });
        });
    }

    function clearLines() {
        let linesCleared = 0;
        for (let y = height - 1; y >= 0; y--) {
            if (board[y].every(cell => cell !== null)) {
                // bum
                board.splice(y, 1);
                board.unshift(Array(width).fill(null));
                linesCleared++;
            }
        }
        return linesCleared;
    }

    function updateScore(linesCleared) {
        if (linesCleared > 0) {
            score += linesCleared * 1; // skorun artması
            scoreElement.textContent = 'PUAN ' + score;
        }
    }

    function spawnTetromino() {
        currentIndex = { x: 0, y: 0 };
        const tetrominoData = lTetromino[Math.floor(Math.random() * lTetromino.length)];
        const color = getRandomColor();
        currentTetromino = {
            shape: tetrominoData,
            color: color,
        };
        if (!isValidMove()) {
            alert('Kaybettin!');
            resetGame();
        }
    }

    function resetGame() {
        score = 0;
        scoreElement.textContent = 'PUAN ' + score;
        board.forEach(row => row.fill(null));
        spawnTetromino();
        draw();
    }

    function rotateTetromino() {
        const originalTetromino = currentTetromino.shape;
        currentTetromino.shape = currentTetromino.shape[0].map((_, i) =>
            currentTetromino.shape.map(row => row[i]).reverse()
        );
        if (!isValidMove()) {
            currentTetromino.shape = originalTetromino;
        }
        draw();
    }

    function handleKeyPress(e) {
        if (e.key === 'ArrowDown') {
            moveDown();
        } else if (e.key === 'ArrowUp') {
            rotateTetromino();
        } else if (e.key === 'ArrowLeft') {
            currentIndex.x--;
            if (!isValidMove()) {
                currentIndex.x++;
            }
            draw();
        } else if (e.key === 'ArrowRight') {
            currentIndex.x++;
            if (!isValidMove()) {
                currentIndex.x--;
            }
            draw();
        }
    }

    function startGame() {
        intervalId = setInterval(moveDown, 550); // pasif aşağı inme
    }

    function stopGame() {
        clearInterval(intervalId); // oyunun yenilenmesi/bitmesi
    }

    document.addEventListener('keydown', handleKeyPress);
    startGame();
    resetGame();
});

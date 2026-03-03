const BOARD_SIZE = 15;
const EMPTY = 0;
const BLACK = 1;
const WHITE = 2;

let board = [];
let currentPlayer = BLACK;
let gameOver = false;

const boardElement = document.getElementById('board');
const statusElement = document.getElementById('status');
const restartBtn = document.getElementById('restartBtn');
const fullscreenBtn = document.getElementById('fullscreenBtn');
const modal = document.getElementById('modal');
const modalText = document.getElementById('modalText');
const modalBtn = document.getElementById('modalBtn');

function getCellSize() {
    const width = window.innerWidth;
    if (width >= 1024) return 40;
    if (width >= 768) return 35;
    return 30;
}

function initBoard() {
    const cellSize = getCellSize();
    board = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(EMPTY));
    boardElement.innerHTML = '';
    boardElement.style.display = 'grid';
    boardElement.style.gridTemplateColumns = `repeat(${BOARD_SIZE}, ${cellSize}px)`;
    
    for (let i = 0; i < BOARD_SIZE; i++) {
        for (let j = 0; j < BOARD_SIZE; j++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.style.width = cellSize + 'px';
            cell.style.height = cellSize + 'px';
            cell.dataset.row = i;
            cell.dataset.col = j;
            cell.addEventListener('click', () => handleClick(i, j));
            boardElement.appendChild(cell);
        }
    }
}

function handleClick(row, col) {
    if (gameOver || board[row][col] !== EMPTY || currentPlayer !== BLACK) return;
    
    placePiece(row, col, BLACK);
    
    if (checkWin(row, col, BLACK)) {
        statusElement.textContent = '黑棋获胜！';
        gameOver = true;
        showModal('黑棋获胜！');
        return;
    }
    
    currentPlayer = WHITE;
    statusElement.textContent = '白棋思考中...';
    
    setTimeout(() => {
        aiMove();
    }, 300);
}

function placePiece(row, col, player) {
    board[row][col] = player;
    const cellSize = getCellSize();
    const pieceSize = cellSize - 4;
    const cell = boardElement.children[row * BOARD_SIZE + col];
    const piece = document.createElement('div');
    piece.className = `piece ${player === BLACK ? 'black' : 'white'}`;
    piece.style.width = pieceSize + 'px';
    piece.style.height = pieceSize + 'px';
    cell.appendChild(piece);
}

function checkWin(row, col, player) {
    const directions = [
        [[0, 1], [0, -1]],
        [[1, 0], [-1, 0]],
        [[1, 1], [-1, -1]],
        [[1, -1], [-1, 1]]
    ];
    
    for (const [dir1, dir2] of directions) {
        let count = 1;
        count += countDirection(row, col, dir1[0], dir1[1], player);
        count += countDirection(row, col, dir2[0], dir2[1], player);
        if (count >= 5) return true;
    }
    return false;
}

function countDirection(row, col, dr, dc, player) {
    let count = 0;
    let r = row + dr;
    let c = col + dc;
    while (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r][c] === player) {
        count++;
        r += dr;
        c += dc;
    }
    return count;
}

function aiMove() {
    if (gameOver) return;
    
    let bestMove = null;
    let bestScore = -Infinity;
    
    for (let i = 0; i < BOARD_SIZE; i++) {
        for (let j = 0; j < BOARD_SIZE; j++) {
            if (board[i][j] === EMPTY) {
                const attackScore = evaluatePosition(i, j, WHITE);
                const defenseScore = evaluatePosition(i, j, BLACK);
                const score = attackScore * 1.2 + defenseScore;
                
                if (score > bestScore) {
                    bestScore = score;
                    bestMove = { row: i, col: j };
                }
            }
        }
    }
    
    if (bestMove) {
        placePiece(bestMove.row, bestMove.col, WHITE);
        
        if (checkWin(bestMove.row, bestMove.col, WHITE)) {
            statusElement.textContent = '白棋获胜！';
            gameOver = true;
            showModal('白棋获胜！');
            return;
        }
        
        currentPlayer = BLACK;
        statusElement.textContent = '轮到黑棋落子';
    }
}

function evaluatePosition(row, col, player) {
    const opponent = player === BLACK ? WHITE : BLACK;
    let score = 0;
    
    const directions = [[0, 1], [1, 0], [1, 1], [1, -1]];
    
    for (const [dr, dc] of directions) {
        let count = 1;
        let openEnds = 0;
        
        let r = row + dr;
        let c = col + dc;
        while (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r][c] === player) {
            count++;
            r += dr;
            c += dc;
        }
        if (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r][c] === EMPTY) {
            openEnds++;
        }
        
        r = row - dr;
        c = col - dc;
        while (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r][c] === player) {
            count++;
            r -= dr;
            c -= dc;
        }
        if (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r][c] === EMPTY) {
            openEnds++;
        }
        
        if (count >= 5) {
            score += 100000;
        } else if (count === 4 && openEnds === 2) {
            score += 10000;
        } else if (count === 4 && openEnds === 1) {
            score += 1000;
        } else if (count === 3 && openEnds === 2) {
            score += 1000;
        } else if (count === 3 && openEnds === 1) {
            score += 100;
        } else if (count === 2 && openEnds === 2) {
            score += 100;
        } else if (count === 2 && openEnds === 1) {
            score += 10;
        }
    }
    
    return score;
}

function restartGame() {
    currentPlayer = BLACK;
    gameOver = false;
    statusElement.textContent = '轮到黑棋落子';
    initBoard();
}

restartBtn.addEventListener('click', restartGame);

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}

function showModal(text) {
    modalText.textContent = text;
    modal.classList.add('show');
}

modalBtn.addEventListener('click', () => {
    modal.classList.remove('show');
});

fullscreenBtn.addEventListener('click', toggleFullscreen);
initBoard();

// function bfs(grid, start, target) {
//     const rows = grid.length;
//     const cols = grid[0].length;

//     const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
//     const queue = [{ x: start.x, y: start.y, path: [] }];

//     const directions = [
//         { dx: 1, dy: 0 }, // вниз
//         { dx: -1, dy: 0 }, // вверх
//         { dx: 0, dy: 1 }, // вправо
//         { dx: 0, dy: -1 }, // влево
//     ];

//     while (queue.length > 0) {
//         const { x, y, path } = queue.shift();

//         if (x === target.x && y === target.y) {
//             return [...path, { x, y }]; // путь найден
//         }

//         for (const { dx, dy } of directions) {
//             const nx = x + dx;
//             const ny = y + dy;

//             if (
//                 nx >= 0 &&
//                 nx < rows &&
//                 ny >= 0 &&
//                 ny < cols &&
//                 !visited[nx][ny] &&
//                 grid[nx][ny].children.length === 0 // клетка свободна
//             ) {
//                 visited[nx][ny] = true;
//                 queue.push({ x: nx, y: ny, path: [...path, { x, y }] });
//             }
//         }
//     }

//     return null; // пути нет
// }

// function hasFiveInARow(x, y, color) {
//     return (
//         checkLine(x, y, 1, 0, color) ||
//         checkLine(x, y, 0, 1, color) ||
//         checkLine(x, y, 1, 1, color) ||
//         checkLine(x, y, 1, -1, color)
//     );
// }

// function checkLine(x, y, dx, dy, color) {
//     let count = 1;

//     let i = 1;
//     while (inBounds(x + dx * i, y + dy * i) && grid[x + dx * i][y + dy * i] === color) {
//         count++;
//         i++;
//     }

//     i = 1;
//     while (inBounds(x - dx * i, y - dy * i) && grid[x - dx * i][y - dy * i] === color) {
//         count++;
//         i++;
//     }

//     return count >= 5;
// }

const counter = document.querySelector('.counter');

function inBounds(x, y) {
    return x >= 0 && y >= 0 && x < gridSize && y < gridSize;
}

function findLinesToRemove() {
    const toRemove = new Set();

    for (let x = 0; x < gridSize; x++) {
        for (let y = 0; y < gridSize; y++) {
            const color = grid[x][y];
            if (color === null) continue;

            const directions = [
                [1, 0],
                [0, 1],
                [1, 1],
                [1, -1],
            ];

            for (let [dx, dy] of directions) {
                const line = [[x, y]];
                let i = 1;
                while (inBounds(x + dx * i, y + dy * i) && grid[x + dx * i][y + dy * i] === color) {
                    line.push([x + dx * i, y + dy * i]);
                    i++;
                }
                i = 1;
                while (inBounds(x - dx * i, y - dy * i) && grid[x - dx * i][y - dy * i] === color) {
                    line.push([x - dx * i, y - dy * i]);
                    i++;
                }

                if (line.length >= 5) {
                    line.forEach(coord => toRemove.add(coord.toString()));
                }
            }
        }
    }

    return Array.from(toRemove).map(str => str.split(',').map(Number));
}

function inBounds(x, y) {
    return x >= 0 && y >= 0 && x < gridSize && y < gridSize;
}

function findPath(startX, startY, targetX, targetY) {
    const visited = Array.from({ length: gridSize }, () => Array(gridSize).fill(false));
    const prev = Array.from({ length: gridSize }, () => Array(gridSize).fill(null));
    const queue = [[startX, startY]];
    visited[startX][startY] = true;

    const dirs = [
        [0, 1],
        [1, 0],
        [0, -1],
        [-1, 0],
    ];

    while (queue.length > 0) {
        const [x, y] = queue.shift();

        if (x === targetX && y === targetY) {
            const path = [];
            let cx = x,
                cy = y;
            while (cx !== startX || cy !== startY) {
                path.push([cx, cy]);
                [cx, cy] = prev[cx][cy];
            }
            path.reverse();
            return path;
        }

        for (let [dx, dy] of dirs) {
            const nx = x + dx;
            const ny = y + dy;

            if (inBounds(nx, ny) && !visited[nx][ny] && grid[nx][ny] === null) {
                queue.push([nx, ny]);
                visited[nx][ny] = true;
                prev[nx][ny] = [x, y];
            }
        }
    }

    return null;
}

function removeBalls(coords) {
    coords.forEach(([x, y], i) => {
        const square = document.querySelector(`.game_square[data-x="${x}"][data-y="${y}"]`);
        square.dataset.active = 'true';

        setTimeout(() => {
            delete square.dataset.color;
            delete square.dataset.ball;
            delete square.dataset.active;
            setTimeout(() => {
                counter.textContent = +counter.textContent + 1;
            }, 100 * i);
        }, 1000);

        grid[x][y] = null;
    });
}

function processLines() {
    const matched = findLinesToRemove();
    if (matched.length >= 5) {
        removeBalls(matched);
        return true;
    }
    return false;
}

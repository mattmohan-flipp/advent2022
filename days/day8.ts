const parseGrid = (file: string) =>
  file
    .trim()
    .split("\n")
    .map((row) =>
      row
        .trim()
        .split("")
        .map((e) => parseInt(e, 10))
    );

const scoreArray = (arr: number[], target: number): number => {
  const result = arr.findIndex((e) => e >= target);
  if (result >= 0) {
    return result + 1;
  }
  return arr.length;
};

const scoreCell = (grid: number[][], row: number, col: number): number => {
  const curr = grid[row][col];
  const column = grid.map((r) => r[col]);
  const left = scoreArray(grid[row].slice(0, col).reverse(), curr);
  const right = scoreArray(grid[row].slice(col + 1), curr);
  const top = scoreArray(column.slice(0, row).reverse(), curr);
  const bottom = scoreArray(column.slice(row + 1), curr);

  return left * right * top * bottom;
};

const day = {
  a: (file: string): string => {
    const grid = parseGrid(file);
    const visible: boolean[][] = Array(grid.length)
      .fill(0)
      .map((_e, idx) => Array(grid[idx].length).fill(false));

    const maxTop: number[] = Array(grid.length).fill(-1);
    const maxBottom: number[] = Array(grid.length).fill(-1);

    for (let i = 0; i < grid.length; i++) {
      let maxRight = -1;
      let maxLeft = -1;
      const bottom = grid.length - i - 1;
      for (let j = 0; j < grid[i].length; j++) {
        const right = grid[i].length - j - 1;
        // Check top
        if (grid[i][j] > maxTop[j]) {
          maxTop[j] = grid[i][j];
          visible[i][j] = true;
        }
        // Check left
        if (grid[i][j] > maxLeft) {
          maxLeft = grid[i][j];
          visible[i][j] = true;
        }
        // Check bottom
        if (grid[bottom][j] > maxBottom[j]) {
          maxBottom[j] = grid[bottom][j];
          visible[bottom][j] = true;
        }
        // Check right
        if (grid[i][right] > maxRight) {
          maxRight = grid[i][right];
          visible[i][right] = true;
        }
      }
    }
    return visible
      .map((row) => row.filter((cell) => cell).length)
      .reduce((a, c) => a + c, 0)
      .toString();
  },
  b: (file: string): string => {
    const grid = parseGrid(file);
    const score = grid.reduce(
      (previousScore, row, i) =>
        row.reduce(
          (previousScore, _cell, j) =>
            Math.max(scoreCell(grid, i, j), previousScore),
          previousScore
        ),
      1
    );
    return score.toString();
  },
};
export default day;

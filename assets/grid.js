class grid {
    constructor(length = 64) {
        this.length = length;
        this.grid = [];
        this.createGrid();
    }
    createGrid(rows = this.length, cols = this.length) {
        for (let i = 0; i < rows; i++) {
            const row = [];
            for (let j = 0; j < cols; j++) {
                row.push(0);
            }
            this.grid.push(row);
        }
        return this.grid;
    }
    getGrid() {
        return this.grid;
    }
    addCell(x, y, value = 1)
    {
        this.grid[x][y] = value;
    }
    markCell(x, y)
    {
        this.addCell(x, y, -1);
    }
    inGrid(x, y)
    {
        return x >= 0 && x < this.length && y >= 0 && y < this.length;
    }
    clone()
    {
        let newGrid = [];
        for (let i = 0; i < this.length; i++) {
            const row = [];
            for (let j = 0; j < this.length; j++) {
                row.push(this.grid[i][j]);
            }
            newGrid.push(row);
        }
        return newGrid;
    }
}

module.exports = { grid };
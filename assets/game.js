const { grid } = require('./grid');

class game {
    // bomb = -1
    constructor(length = 64, bombs = 10) {
        this.grid = new grid(length);
        this.length = length;
        for (let i = 0; i < bombs; i++) {this.placeBomb();}
    }
    placeBomb()
    {
        if (this.length > 0) {
            let x = Math.floor(Math.random() * this.length);
            let y = Math.floor(Math.random() * this.length);
            let grid = this.grid.getGrid();
            while (grid[x][y] == -1 || !this.grid.inGrid(x, y)) 
            {
                x = Math.floor(Math.random() * this.length);
                y = Math.floor(Math.random() * this.length);
            }
            this.grid.addCell(x, y, -1);
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    if (this.grid.inGrid(x + i, y + j) && grid[x + i][y + j] != -1 && !(i == 0 && j == 0)) {
                        grid[x + i][y + j]++;
                    }
                }
            }
        }
    }
    reveal(x, y)
    {
        let grid = this.grid.getGrid();
        let clicked = grid[x][y];
        if (clicked != 0) {return [[x, y, clicked]];}
        let res = [];
        this.rec(x, y, this.grid.clone(), res);
        return res;
    }
    rec(x, y, grid, res)
    {
        x = parseInt(x);
        y = parseInt(y);
        console.log("a");
        if (this.grid.inGrid(x, y)) {
            let val = grid[x][y];
            res.push([x, y, val]);
            grid[x][y] = -2;
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    if (i != 0 || j != 0 && !this.bTest(res, x + i, y + j)) {
                        res = this.rec(x + i, y + j, grid, res);
                    }
                }
            }
        }
        return res;
    }
    static bTest(list, x, y)
    {
        for (let i = 0; i < list.length; i++)
        {
            if (list[i][0] == x && list[i][1] == y)
            {
                return true;
            }
        }
        return false;
    }
}

module.exports = { game };
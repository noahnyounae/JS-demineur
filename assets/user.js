const { grid } = require('./grid');
const { v4: uuidv4 } = require('uuid');
const { game } = require('./game');

class user {
    // mark = -1
    // reveal = -2
    constructor(uuid = null, length = 64) {
        this.uuid = uuid;
        this.grid = new grid();
        this.game = new game(length);
    }

    showGrid() {
        let gridHTML = `
            <div style="display: grid; grid-template-columns: repeat(64, 1fr); grid-template-rows: repeat(64, 1fr); width: min(95vw, 95vh); height: min(95vw, 95vh); gap: 1px; margin: auto;">
        `;
    
        for (let x = 0; x < 64; x++) {
            for (let y = 0; y < 64; y++) {
                gridHTML += `<div id="cell-${x}-${y}" data-x="${x}" data-y="${y}" style="width: 100%; height: 100%; border: 1px solid #000; box-sizing: border-box; cursor: pointer;" onclick="handleCellClick(${x}, ${y})"></div>`;
            }
        }
    
        gridHTML += `
            </div>
            <div id="modal" style="display: none; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; border: 1px solid #000; padding: 20px; z-index: 1000;">
                <p>Do you mark or reveal?</p>
                <button onclick="mark()">Mark</button>
                <button onclick="reveal()">Reveal</button>
            </div>
            <div id="overlay" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5); z-index: 999;" onclick="close()"></div>
            <script>
                function handleCellClick(x, y) {
                    const cell = document.getElementById(\`cell-\${x}-\${y}\`);
                    const modal = document.getElementById('modal');
                    const overlay = document.getElementById('overlay');
                    cell.style.backgroundColor = 'yellow';
                    modal.style.display = 'block';
                    overlay.style.display = 'block';
                    modal.dataset.x = x;
                    modal.dataset.y = y;
                }
    
                function hideModal() {
                    const modal = document.getElementById('modal');
                    const overlay = document.getElementById('overlay');
                    modal.style.display = 'none';
                    overlay.style.display = 'none';
                }
    
                function mark() {
                    const modal = document.getElementById('modal');
                    const x = modal.dataset.x;
                    const y = modal.dataset.y;
                    fetch('/cell-click', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ x, y, value: 1 })
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data.status === 'success') {
                            document.getElementById(\`cell-\${x}-\${y}\`).style.backgroundColor = 'red';
                            document.getElementById(\`cell-\${x}-\${y}\`).inneHTML = null;
                        }
                    });
                    hideModal();
                }
                function reveal() {
                    const modal = document.getElementById('modal');
                    const x = modal.dataset.x;
                    const y = modal.dataset.y;
                    fetch('/cell-click', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ x, y, value: 2 })
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data.status === 'success') {
                        console.log(data);
                            for(let i = 0; i < data.value.length; i++) {
                                const [vx, vy, v] = data.value[i];
                                console.log(vx, vy, v);
                                document.getElementById(\`cell-\${vx}-\${vy}\`).style.backgroundColor = 'lightgrey';
                                document.getElementById(\`cell-\${vx}-\${vy}\`).innerHTML = \`\${v}\`;
                            }
                        }
                        if (data.status === 'defeat') {
                            document.getElementById(\`cell-\${x}-\${y}\`).style.backgroundColor = 'black';
                            document.getElementById(\`cell-\${x}-\${y}\`).inneHTML = '';
                        }
                    });
                    hideModal();
                }
                function close() {
                    const modal = document.getElementById('modal');
                    const x = modal.dataset.x;
                    const y = modal.dataset.y;
                    const cell = document.getElementById(\`cell-\${x}-\${y}\`);
                    cell.style.backgroundColor = 'white';
                    hideModal();
                }
            </script>
        `;
        return gridHTML;
    }
    getGrid()
    {
        return this.grid;
    }
    getGame()
    {
        return this.game;
    }
    static getUUID(req, res)
    {
        let userUUID = null;
        if (!req || !req.cookies || !req.cookies.userUUID) {
            userUUID = uuidv4();
            res.cookie('userUUID', userUUID, { maxAge: 900000, httpOnly: true });
        }else{
            userUUID = req.cookies.userUUID;
        }
        return userUUID;
    }
}

module.exports = { user };
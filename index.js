const express = require('express');
const { user } = require('./assets/user'); // Import generateGrid function
const { game } = require('./assets/game');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cookieParser());

let length = 64;

let users = {};
function setUser(userUUID, length) {
    users[userUUID] = new user(userUUID, length);
}
function getUser(userUUID) {
    return users[userUUID];
}

function getValidUserUUID(req,res)
{
    let userUUID = user.getUUID(req, res);
    if (!getUser(userUUID)) {
        setUser(userUUID, length);
    }
    return userUUID;
}

app.get('/', (req, res) => {
    res.send(getUser(getValidUserUUID(req,res)).showGrid()); // Send the generated grid as response
});

app.post('/cell-click', (req, res) => {
    const { x, y, value } = req.body;
    if (value == 1) {
        getUser(getValidUserUUID(req,res)).getGrid().markCell(x, y);
        res.json({ status: 'success', x, y, value:-1 });
        return;
    }
    if (value == 2) {
        let user = getUser(getValidUserUUID(req,res));
        user.getGrid().addCell(x, y, -2);
        let value = user.getGame().reveal(x, y);
        if (value == null || value[0][2] == -1) {res.json({ status: 'defeat', x, y, value });}
        res.json({ status: 'success', x, y, value });
        return;
    } 
    //console.log(`Cell clicked at position: x=${x}, y=${y}`);
    res.json({ status: 'success', x, y, value });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
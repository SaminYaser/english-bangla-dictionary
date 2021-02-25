const express = require("express");

const app = express();

app.get('/', (req, res) => {
    res.send("Bravo it worked!");
});

app.listen(3001);
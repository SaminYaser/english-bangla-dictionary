const express = require("express");
const app = express();
const controller = require("./controller")

app.get('/', (req, res) => {
    res.send("Bravo it worked!");
});

app.listen(3001,async ()=>{

    await controller.storeData();
    await controller.primaryHash();
    await controller.secondaryHash()

    console.log("Server Started");
});
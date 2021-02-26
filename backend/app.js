const express = require("express");
const app = express();
const routes = require("./routes");
const controller = require("./controller")
var cors = require('cors')

app.use(cors())
app.use(routes)

app.listen(5000, "0.0.0.0", async ()=>{
    await controller.primaryHash();
    await controller.secondaryHash();
    console.log("Server Started");
});
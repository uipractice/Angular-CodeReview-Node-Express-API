const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
const config = require("./config");
const routing = require('./routing/index');
app.use(bodyParser.json());
app.use(cors());
app.use("/api", routing);


app.listen(config.port, (err, res)=>{
    if(err){
        console.log(`Getting error while listining the port`);
    } else {
        console.log(`Server running on port number : ${config.port}`);
    }
});

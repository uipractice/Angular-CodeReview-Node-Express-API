const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
const config = require("./config");
const details = require('./routing/api');
const checkList = require('./routing/api');
app.use(bodyParser.json());
app.use(cors());
app.use('/api', details);


app.listen(config.port, (err, res)=>{
    if(err){
        console.log(`Getting error while listining the port`);
    } else {
        console.log(`Server running on port number : ${config.port}`);
    }
});

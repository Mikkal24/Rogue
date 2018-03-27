const express = require("express");
const path = require("path");

var app = express()

app.use(express.static(path.join(__dirname, './public')));

app.get('/', function(req,res){
    res.send('/public/index.html')
})

const port = process.env.PORT || 3001;

app.listen(port, function(err) {
    if (err) throw err;
    console.log(`server running on port ${port}`);
});
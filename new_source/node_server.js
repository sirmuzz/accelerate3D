'use strict';
const express = require('express');
const bodyParser = require('body-parser')

console.log("Initializing...");
const app = express();
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded( { extended: true } ));
app.get('/', function(req, res){
    res.sendfile('index.html', { root: __dirname + "/public" } );
});
app.use(express.static('public'));
app.listen( 3000, "0.0.0.0" );
console.log("Server is running. Press ctrl-c to exit.");


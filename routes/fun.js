const express = require('express');
var fun = express();
var path = require('path');


fun.get('/',(req, res) => {
   res.send("Bow Bow!");
    });

    fun.get('/onedog',(req, res) => {
        res.sendFile(path.join(__dirname, '../public', 'one.html'));
    });

    fun.get('/music',(req, res) => {
        res.sendFile(path.join(__dirname, '../public', 'banditb3.mp3'));
    });

module.exports = fun;
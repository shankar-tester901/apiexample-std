const express = require('express');
var fun = express();
var path = require('path');
const logger = require('../logger')(__filename);


fun.get('/',(req, res) => {
    logger.debug('get method invoked');
   res.send("Bow Bow!");
    });

    fun.get('/onedog',(req, res) => {
    logger.info('onedog invoked');
        res.sendFile(path.join(__dirname, '../public', 'one.html'));
    });

    fun.get('/music',(req, res) => {
        logger.info('music invoked');
        res.sendFile(path.join(__dirname, '../public', 'banditb3.mp3'));
    });

    fun.get('/elephant',(req, res) => {
     logger.info('elephant invoked');
        res.sendFile(path.join(__dirname, '../public/images', 'animal-big-elephant-133394.jpg'));
      });

module.exports = fun;
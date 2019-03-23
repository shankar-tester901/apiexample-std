const express = require("express");
const logger = require("./logger")(__filename);
const morgan = require("morgan");
const app = express();

const bodyParser = require('body-parser');
var path = require('path');
const mysql = require('mysql');
var myConnection  = require('express-myconnection');

const morganFormat = process.env.NODE_ENV !== "production" ? "dev" : "combined";

app.use(
    morgan(morganFormat, {
        skip: function(req, res) {
            return res.statusCode < 400;
        },
        stream: process.stderr
    })
);

app.use(
    morgan(morganFormat, {
        skip: function(req, res) {
            return res.statusCode >= 400;
        },
        stream: process.stdout
    })
);


var config = require('./config')
var dbOptions = {
    host:      config.database.host,
    user:       config.database.user,
    password: config.database.password,
    port:       config.database.port,
    database: config.database.db
}

/**
 * 3 strategies can be used
 * single: Creates single database connection which is never closed.
 * pool: Creates pool of connections. Connection is auto release when response ends.
 * request: Creates new connection per new request. Connection is auto close when response ends.
 */
app.use(myConnection(mysql, dbOptions, 'pool'))
app.set('view engine', 'ejs');

// const LoggerMiddleware = (req, res, next) => {
//   logger.info('Logged ${req.url} ${req.method} ---- ${new Date()}')
//   next();
// }

// app.use(LoggerMiddleware);

//The body-parser extracts the entire body portion of
// an incoming request stream and makes it accessible on req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

var methodOverride = require('method-override')


app.use(methodOverride(function (req, res)
{
//console.log("inside methodOveride")
if (req.body && typeof req.body === 'object' && '_method' in req.body)
{
  var method = req.body._method;
  //console.log(method);
  delete req.body._method;
  return method;
}
}));

app.use(express.static('public'));

var product = require('./routes/productroute');
app.use('/api', product);



var fun = require('./routes/fun');
app.use('/bowbow', fun);

//This is parallel to public folder
app.use(express.static(path.join(__dirname, 'images1')));
// a convenient variable to refer to the HTML directory
var images_dir = './images1/';

// routes to serve the static HTML files
app.get('/image', function(req, res) {
    res.sendfile(images_dir + 'adults-celebration-ceremony-1211968.jpg');
});

// routes to serve the static HTML files
app.get('/indianelephant', function(req, res) {
   res.sendFile(path.join(__dirname, 'public', 'gautam-arora-317046-unsplash.jpg'));
});


// All errors are sent back as JSON
app.use((err, req, res, next) => {
    // Fallback to default node handler
    if (res.headersSent) {
        next(err);
        return;
    }

    logger.error(err.message, { url: req.originalUrl });

    res.status(500);
    res.json({ error: err.message });
});

//Server listening
app.listen(3000,() =>{
 logger.info('Server started on port 3000...');
});

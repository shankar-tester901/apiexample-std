var express = require('express');
const bodyParser = require('body-parser');
var path = require('path');
const app = express();
const mysql = require('mysql');
var myConnection  = require('express-myconnection');

/**
 * Store database credentials in a separate config.js file
 * Load the file/module and its values
 */
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
// parse application/json

const LoggerMiddleware = (req, res, next) => {
  console.log(`Logged ${req.url} ${req.method} ---- ${new Date()} `)
  next();
}

app.use(LoggerMiddleware);


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

//Server listening
app.listen(3000,() =>{
  console.log('Server started on port 3000...');
});

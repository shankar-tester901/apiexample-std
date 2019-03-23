const express = require('express');
var app = express();

//show all products
app.get('/products',(req, res) => {
    req.getConnection(function(error, conn) {
    let sql = "SELECT * FROM product";
    let query = conn.query(sql, (err, results) => {
      if(err) throw err;
      res.render('home', {result: results})
     // res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
    });
    });
  });

  //show single product
  app.get('/products/:id',(req, res) =>
   {
  //console.log('invoked Edit ');
  req.getConnection(function(error, conn) {
    let sql = "SELECT * FROM product WHERE product_id="+req.params.id;
    let query = conn.query(sql, (err, results) =>
     {
      if(err) throw err;
      res.render('edit', {
        id : results[0].product_id,
        name: results[0].product_name,
        price: results[0].product_price
      })
    //  res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
    });
});
  });



  //add new product
  app.post('/products',(req, res) => {
    req.getConnection(function(error, conn) {
    let data = {product_name: req.body.product_name, product_price: req.body.product_price};
    let sql = "INSERT INTO product SET ?";
    let query = conn.query(sql, data,(err, results) => {
      if(err) throw err;
      res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
    });
});
  });

  //update product
  app.put('/products/:id',(req, res) => {
   // console.log("invoked put");
   req.getConnection(function(error, conn) {
    let sql = "UPDATE product SET product_name='"+req.body.product_name+"', product_price='"+req.body.product_price+"' WHERE product_id="+req.params.id;
    let query = conn.query(sql, (err, results) => {
      if(err) throw err;
      res.redirect('/api/products');
     // res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
    });
});
  });

  //Delete product
  app.delete('/products/:id',(req, res) => {
    req.getConnection(function(error, conn) {
    let sql = "DELETE FROM product WHERE product_id="+req.params.id+"";
    let query = conn.query(sql, (err, results) => {
      if(err) throw err;
       res.redirect('/api/products');
        //res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
    });
  });
});

  module.exports = app;
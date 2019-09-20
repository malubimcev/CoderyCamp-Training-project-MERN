const fs = require('fs');
const express = require('express');
const app = express();
const ProductService = require("./ProductService.js");
const bodyParser = require('body-parser');

const port = '3000';
// const port = process.env.PORT;

app.listen(port, function() {
  console.log(`Server started at port ${port}`);
});

const serveNotFound = function(req, res) {
    fs.readFile("./static/page404.html", function(err, data) {
        if (err) {
            res.statusCode = 500;
            res.send(`Внутренняя ошибка сервера: ${err}`);
            return;
        }
        res.statusCode = 404;
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        res.write(data);
        res.end();
    });    
}

const serveSPA = function(req, res) {
    fs.readFile("./public/spa.html", function(err, data) {
        if (err) {
            return serveNotFound(req, res);
        }
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        res.write(data);
        res.end();
    });
}

const serveProducts = function(req, res) {
    if (req.query.key || req.query.slug) {
        //получен GET-запрос вида /api/product?key=value
        ProductService.getProducts(req.query)
            .then(product => {
                if (product) {
                    res.statusCode = 200;
                    res.json(product);
                } else {
                    serveNotFound(req, res);
                }
            })
            .catch(err => {
                res.statusCode = 500;
                res.send(`Внутренняя ошибка сервера: ${err}`);
            });
    } else {
        //получен запрос вида /api/product
        ProductService.getProducts()
            .then(products => {
                if (products) {
                    res.statusCode = 200;
                    res.json(products);
                } else {
                    serveNotFound(req, res);
                }
            })
            .catch(err => {
                console.log(err);
                res.statusCode = 400;
                res.end();
            });  
    }
}

const serveOneProduct = function(req, res) {
    if (req.params.id) {
        //получен запрос по id вида /api/product/_id
        ProductService.getProductByID(req.params.id)
            .then(product => {
                if (product) {
                    res.statusCode = 200;
                    res.json(product);
                } else {
                    serveNotFound(req, res);
                }
            })
            .catch(err => {
                res.statusCode = 500;
                res.send(`Внутренняя ошибка сервера: ${err}`);
            });
    } else {
        serveNotFound(req, res);
    }
}

const staticMiddleware = express.static("public");
app.use(staticMiddleware);

const jsonBodyParser = bodyParser("json");
app.use(jsonBodyParser);

app.get('/', serveSPA);
app.get('/product', serveSPA);
app.get('/product/:key_and_slug', serveSPA);

app.get('/api/product', serveProducts);
app.get('/api/product/:id', serveOneProduct);

app.get('/panel', serveSPA);//админка
app.get('/panel/product', serveSPA);
app.get('/panel/product/:id', serveSPA);

app.put('/api/product/:id', function(req, res) {
    ProductService.updateProduct(req.params.id, req.body)
        .then(function(result) {
            res.json(result);
        });
});

app.post('/api/product', function(req, res) {
    ProductService.insertProduct(req.body)
        .then(function(result) {
            res.json(result);
        });
});

app.use(serveNotFound);

ProductService.init();
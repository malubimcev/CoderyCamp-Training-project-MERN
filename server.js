const fs = require('fs');
const express = require('express');
const app = express();
const DBService = require("./DBService.js");
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const SECRET = "secret_string";

const port = '3000';
// const port = process.env.PORT;

app.listen(port, function() {
  console.log(`Server started at port ${port}`);
});

const serveNotFound = function(req, res) {
    fs.readFile("./static/page404.html", (err, data) => {
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
    fs.readFile("./public/spa.html", (err, data) => {
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
        DBService.getProducts(req.query)
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
        DBService.getProducts()
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
        DBService.getProductByID(req.params.id)
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

const cookieParser = require("cookie-parser");
app.use(cookieParser());

app.get('/', serveSPA);
app.get('/product', serveSPA);
app.get('/product/:key_and_slug', serveSPA);

app.get('/api/product', serveProducts);
app.get('/api/product/:id', serveOneProduct);

app.get('/panel', serveSPA);//админка
app.get('/panel/product', serveSPA);
app.get('/panel/product/:id', serveSPA);

app.put('/api/product/:id', (req, res) => {
    const result = DBService.updateProduct(req.params.id, req.body);
    res.json(result);
});

app.post('/api/product', (req, res) => {
    const result = DBService.insertProduct(req.body);
    res.json(result);
});

app.delete('/api/product/:id', (req, res) => {
    const result = DBService.removeProduct(req.body);
    res.json(result);
});

const payload = {
    email: "user@fail.ru"
};
  
const token = jwt.sign(payload, SECRET, {
    expiresIn: "5m"
});

app.get('/api/login', (req, res) => {
    let result = 'Пользователь не авторизован';
    if (req.query.email && req.query.password) {
        //получен GET-запрос вида /api/login?email=value&password=value
        DBService.getUserByEmail(req.query.email)
            .then(user => {
                if (user.password === req.query.password) {
                    result = `Установка cookie: URL ${req.originalUrl}`;
                    res.set({ 'Set-Cookie': `token=${token}; Path=/` });
                    res.status(200).send(result).end();
                } else {
                    throw Error;
                }
            })
            .catch(err => {
                res.status(403).send(result).end();
            });
    } else {
        serveNotFound(req, res);
    }
});

app.get('/api/login2', (req, res) => {
    const result = `Установка cookie: URL ${req.originalUrl}`;
    res.cookie('token', token, { path: '/', encode: String });
    res.status(200).send(result).end();
});

app.get('/api/me', (req, res) => {
    let result = 'Пользователь не авторизован';
    let statusCode = 401;
    try {
        const payload = jwt.verify(token, SECRET);
        DBService.getUserByEmail(payload.email)
            .then(user => {
                if (user.email === payload.email) {
                    result = `Пользователь ${user.email} авторизован`;
                    statusCode = 200;
                } else {
                    result = `Отказано в доступе: ${user.email}`;
                    statusCode = 403;
                }
                res.status(statusCode).send(result).end();
            })
            .catch(err => {
                result = `Отказано в доступе`;
                statusCode = 403;
                res.status(statusCode).send(result).end();
            });
    } catch(err) {
        result = `Отказано в доступе`;
        statusCode = 403;
        res.status(statusCode).send(result).end();
    }
});

app.use(serveNotFound);

DBService.init();
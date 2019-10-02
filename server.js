const fs = require('fs');
const express = require('express');
const app = express();
const DBService = require("./DBService.js");
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const port = process.env.PORT || '3000';

app.listen(port, function() {
  console.log(`Server started at port ${port}`);
});

const serveNotFound = (req, res) => {
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

const serveSPA = (req, res) => {
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

const serveProducts = (req, res) => {
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
                res.send(`Внутренняя ошибка сервера: ${err}`).end();
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

const serveOneProduct = (req, res) => {
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
                res.send(`Внутренняя ошибка сервера: ${err}`).end();
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


app.get('/panel', serveSPA);//админка
app.get('/panel/product', serveSPA);
app.get('/panel/product/:id', serveSPA);
app.get('/panel/login', serveSPA);

const sendAccessDenied = (req, res) => {
    res.status(403).send(`Отказано в доступе`).end();
}

const SECRET = "secret_string";

const token = email => {
    const payload = {
        email: email
    };
    const expires = {
        expiresIn: "5m"
    }
    return jwt.sign(payload, SECRET, expires);
}

const getHash = (password) => {
    const saltRounds = 10;
    return bcrypt.hashSync(password, saltRounds);    
}

const checkPasswordHash = password => bcrypt.compareSync(password, getHash(password));

const checkToken = (req, res, next) => {
    try {
        const payload = jwt.verify(req.cookies.token, SECRET);
        DBService.getUserByEmail(payload.email)
            .then(user => {
                if (user.email === payload.email) {
                    req.user = { 
                        isAuthorized: true,
                        email: user.email
                    };
                } else {
                    req.user = { 
                        isAuthorized: false,
                        email: user.email
                    };
                }
                next();
            })
            .catch(err => sendAccessDenied(req, res));
    } catch(err) {
        sendAccessDenied(req, res);
    }
}

// app.get('/api/login', (req, res) => {
//     if (req.query.login && req.query.password) {
//         //получен GET-запрос вида /api/login?email=value&password=value
//         DBService.getUserByEmail(req.query.login)
//             .then(user => {
//                 if (checkPasswordHash(req.query.password, user.passwordHash)) {
//                     // res.set({ 'Set-Cookie': `token=${token(req.body.login)}; Path=/` });
//                     res.cookie('token', token(req.query.login), { path: '/', encode: String } );
//                     res.json(user);
//                 } else {
//                     throw Error;
//                 }
//             })
//             .catch(err => {
//                 sendAccessDenied(req, res);
//             });
//     } else {
//         serveNotFound(req, res);
//     }
// });

app.post('/api/login', (req, res) => {
    console.log(`body = ${req.body.toString()}`);
    console.log(`login / password = ${req.body.login} / ${req.body.password}`);
    if (req.body.login && req.body.password) {
        const [login, password] = [req.body.login, req.body.password];
        console.log(`login / password = ${login} / ${password}`);
        //получен POST-запрос на /api/login:
        // { login: login, password: password }
        DBService.getUserByEmail(login)
            .then(user => {
                if (checkPasswordHash(password, user.passwordHash)) {
                    // res.set({ 'Set-Cookie': `token=${token(req.body.login)}; Path=/` });
                    res.cookie('token', token(login), { path: '/', encode: String } );
                    res.json(user);
                } else {
                    throw Error;
                }
            })
            .catch(err => {
                sendAccessDenied(req, res);
            });
    } else {
        serveNotFound(req, res);
    }
});

app.get('/api/login2', (req, res) => {
    const result = `Установка cookie: URL ${req.originalUrl}`;
    res.cookie('token', token('user2@fail.ru'), { path: '/', encode: String });
    res.status(200).send(result).end();
});

app.get('/api/product', serveProducts);
app.get('/api/product/:id', checkToken);
app.get('/api/product/:id', (req, res) => {
    if (req.user.isAuthorized) {
        serveOneProduct(req, res);
    } else {
        sendAccessDenied(req, res);
    }
});

app.put('/api/product/:id', checkToken);
app.put('/api/product/:id', (req, res) => {
    if (req.user.isAuthorized) {
        const result = DBService.updateProduct(req.params.id, req.body);
        res.json(result);
    } else {
        sendAccessDenied(req, res);
    }
});

app.post('/api/product', checkToken);
app.post('/api/product', (req, res) => {
    if (req.user.isAuthorized) {
        const result = DBService.insertProduct(req.body);
        res.json(result);
    } else {
        sendAccessDenied(req, res);
    }
});

app.delete('/api/product/:id', (req, res) => {
    const result = DBService.removeProduct(req.body);
    res.json(result);
});

app.get('/api/me', checkToken);
app.get('/api/me', (req, res) => {
    if (req.user.isAuthorized) {
        const result = `Пользователь ${req.user.email} авторизован`;
        res.status(200).send(result).end();
    } else {
        sendAccessDenied(req, res);
    }
});

app.get('/api/bcrypt', (req, res) => {
    if (req.query.password) {
        //получен GET-запрос вида /api/bcrypt?password=value
        const hash = getHash(req.query.password);
        const result = `Password=${req.query.password}<br>Hash=${hash}`;
        res.status(200).send(result).end;
    } else {
        sendAccessDenied(req, res);
    }
});

app.use(serveNotFound);

DBService.init();
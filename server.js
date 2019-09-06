const http = require('http');
const URL = require('url');
const path = require('path');
const fs = require('fs');
const ejs = require("ejs");
const queryString = require('query-string');
const ProductService = require("./ProductService.js");

const getRoute = function(pathname) {
    if (pathname === '/') {
        return pathname;
    }
    const [, ...splittedPath] = pathname.split('/');
    return splittedPath[0];
}

const serveNotFound = function(req, res, customText = 'Страница не найдена') {
    fs.readFile("./static/page404.ejs", function(err, data) {
        if (err) {
            res.statusCode = 500;
            res.setHeader("Content-Type", "text/html; charset=utf-8");
            res.write('Внутренняя ошибка сервера');
            res.end();
            return;
        }
        const template = ejs.compile(data.toString());
        const scope = {
            message: customText
        };
        const html = template(scope);
        res.statusCode = 404;
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        res.write(html);
        res.end();
    });    
}

const serveStatic = function(req, res, customFileName) {
    const filename = customFileName || path.basename(req.url);
    const extension = path.extname(filename);
    fs.readFile("./public/" + filename, function(err, data) {
        if (err) {
            return serveNotFound(req, res);
        }
        switch (extension) {
            case '.css':
                res.setHeader("Content-Type", "text/css; charset=utf-8");
                break;
            case '.png':
                res.setHeader("Content-Type", "image/png");
                break;
            case '.js':
                res.setHeader("Content-Type", "text/javascript; charset=utf-8");
                break;
            case '.html':
            default:
                res.setHeader("Content-Type", "text/html; charset=utf-8");
        }
        res.statusCode = 200;
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

const serveAPI = function(req, res) {
    const parsedURL = URL.parse(req.url);
    const parsedGetRequestParams = queryString.parse(parsedURL.search);
    const [, api, path, id, ...rest] = parsedURL.pathname.split('/');

    if (parsedGetRequestParams.key || parsedGetRequestParams.slug) {//получен GET-запрос вида /api/product/?key=value
        
        ProductService.getProducts(parsedGetRequestParams)
            .then(product => {
                if (product) {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.write(JSON.stringify(product));
                    res.end();
                } else {
                    res.statusCode = 404;
                    res.end();
                }
            })
            .catch(err => {
                res.statusCode = 500;
                res.setHeader("Content-Type", "text/html; charset=utf-8");
                res.write('Внутренняя ошибка сервера');
                res.end();
            });

    } else {

        if (id) {//получен запрос по id вида /api/product/_id

            ProductService.getProductByID(id)
                .then(product => {
                    if (product) {
                        res.statusCode = 200;
                        res.setHeader("Content-Type", "application/json");
                        res.write(JSON.stringify(product));
                        res.end();
                    } else {
                        res.statusCode = 404;
                        res.end();
                    }
                })
                .catch(err => {
                    res.statusCode = 500;
                    res.setHeader("Content-Type", "text/html; charset=utf-8");
                    res.write('Внутренняя ошибка сервера');
                    res.end();
                });

        } else if (path === 'product') {//получен запрос вида /api/product

            ProductService.getProducts()
                .then(products => {
                    if (products) {
                        //slow connection imitation:
                        setTimeout(function() {
                            res.statusCode = 200;
                            res.setHeader("Content-Type", "application/json");
                            res.write(JSON.stringify(products));
                            res.end();
                        }, 2000)
                    } else {
                        res.statusCode = 404;
                        res.end();
                    }
                })
                .catch(err => {
                    console.log(err);
                    res.statusCode = 400;
                    res.end();
                });

        } else {
            serveSPA(req, res);
        }
    }
}

const server = http.createServer(function(req, res) {
    const parsedURL = URL.parse(req.url);

    if (parsedURL.pathname === '/favicon.ico') {
        return;
    }

    const filename = path.basename(parsedURL.pathname);
    const extension = path.extname(filename);

    if (extension) {
        serveStatic(req, res);
    } else {
        const route = getRoute(parsedURL.pathname);

        switch (route) {
            case 'api':
                serveAPI(req, res);
                break;                
            case '/':
            case 'product':
                serveSPA(req, res);
                break;
            default:
                serveNotFound(req, res);
        }
    }
});

ProductService.init();
server.listen('3000');
// server.listen(process.env.PORT);
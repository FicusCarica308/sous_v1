/*requirments*/
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const favicon = require('serve-favicon');
const path = require('path');
const session = require('express-session')

/* === (Pug, server, and bodyParser setup) === */
const sousApp = express();
sousApp.set('view engine', 'pug');
sousApp.set('views', './page_content/views');
sousApp.use(bodyParser.urlencoded({ extended: true }));
//sousApps favicon
sousApp.use(favicon(path.join(__dirname, 'page_content/images', 'sous_logo.png')));
//serves static folder
sousApp.use(express.static(path.join(__dirname, 'page_content')));
/*=================================================*/

//URL routes
//home route (where sign in will happen)
sousApp.get('/', (req, res) => {
    res.render('home')
    console.log(req)
});

//user signin
sousApp.post('/login', (req, res) => {
    //check if user exists
    console.log(req.body)
});

//food search route
sousApp.get('/food', (req, res) => {
    res.send('<h1>food</h1>')
});

//recipes search
sousApp.get('/recipes', (req, res) => {
    res.send('<h1>food</h1>')
});

//user recipes
sousApp.get('recipes/user')

//Setting port
const PORT = process.env.PORT || 5000;

/* === Error Handles === */
sousApp.use(function(req, res) {
    res.send('404: Page not found', 404);
});

sousApp.use(function(error, req, res, next) {
    res.send('500: Internal error', 500);
})
/*==================================================*/

//sousApp start (displays sousApp start message)
sousApp.listen(PORT, () => console.log(`sousApp started on port ${PORT}`));

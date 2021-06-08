/*requirments*/
const express = require('express');

/* === (Pug and server setup) === */
const server = express();
server.set('view engine', 'pug');
server.set('views', './page_content/views')

//URL routes
//home route (where sign in will happen)
server.get('/', (request, response) => {
    response.render('home')
});

//food search route
server.get('/food', (request, response) => {
    response.send('<h1>food</h1>')
});

//recipes search
server.get('/recipes', (request, response) => {
    response.send('<h1>food</h1>')
});

//user recipes
server.get('recipes/user')

//Setting port
const PORT = process.env.PORT || 5000;

//Server start (displays server start message)
server.listen(PORT, () => console.log(`server started on port ${PORT}`));

/*requirments*/
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const favicon = require('serve-favicon');
const path = require('path');
const session = require('express-session');
const mongoose = require('mongoose');
const User = require('./models/user');
const getRecipes = require("./helpers/get_recipes");

let searchCache = [];

/*
MongoDB Connection:
    Uses sous_config.js (imported as config) to get mongoURI
and connects application to external database...
*/
const config = require('./sous_config');
mongoose.connect(config.mongoURI, { useNewUrlParser: true })
    .then(() => console.log('MongoDB Connection Success:', config.mongoURI))
    .catch(error => console.error('MongoDB Connection Failure', err));
//=========================================================================


/* === (Pug, server, and bodyParser setup) === */
const sousApp = express();
sousApp.set('view engine', 'pug');
sousApp.set('views', './page_content/views');
sousApp.use(bodyParser.urlencoded({ extended: true }));
//sousApps favicon
sousApp.use(favicon(path.join(__dirname, 'page_content/images', 'sous_logo.png')));
//serves static folder
sousApp.use(express.static(path.join(__dirname, 'page_content')));
sousApp.use(session({
    secret: 'dev-key-34968A',
    resave: false,
    saveUninitialized: true,
    cookie:{maxAge: 1000000}
}));

/*=================================================*/

/* === (posts) === */

//displays recipes based off of search
sousApp.post('/recipes/query', (req, res) => {
    searchCache = [];
    console.log(req.body.recipe_query);
    const perPage = req.body.total_results;
    console.log(perPage);
    const budget = Number(req.body.budget);
    if (req.body.recipe_query == '')
        res.redirect('/recipes')
    else
        getRecipes.query(req.body.recipe_query, perPage)
            .then((response) => {
                if (response.length != 0) {
                    if (budget == 0) {
                        searchCache = response;
                        res.render('recipe_search', {results: response, budget: 'null'})
                    } else {
                        searchCache = response;
                        res.render('recipe_search', {results: response, budget: budget})
                    }
                } else {
                    res.render('recipe_search', {results: response, message: 'No-Results'});
                }
            
            })
            .catch((error) => {
                console.log(error)
                res.redirect('/recipes');
            });
})

/* checks if user exists / sign them in by creating a new sessions */
sousApp.post('/login', (req, res) => {
    User.findOne({username: req.body.username})
        .then((document) => {
            if (document == null || req.body.username != document.username || req.body.password != document.password) {
                console.log('sign in failed');
                res.render('home', {message: 'Sign-In-False'})
            } else {
                console.log('sign in successful');
                req.session.user = document
                if(req.session.user) {
                    console.log('user is signed in')
                }
                res.render('home', {message: 'Sign-In-True'});
            }
            console.log(document)
            console.log(req.session.user.username)
        })
        .catch((error) => {
            res.send(500, "500: Error logging in" + error);
        });
});

/* Signs a new user up for the service and stores thier credentials */
sousApp.post('/signup', (req, res) => {
    const newUser = new User ({
        username: req.body.username,
        password: req.body.password,
        recipes: [],
    });

    newUser.save()
        .then((document) => {
            console.log(document);
            req.session.user = document;
            res.render('home', {message: 'Sign-In-True'});
        })
        .catch((error) => {
            console.log(error);
            if (error.code === 11000) {
                res.render('home', {message: 'Create-False'});
            } else {
                res.send(500, "500: Error creating you user" + error);
            }
        });
});

/*================*/

function checkSignIn(req, res){
    if(req.session.user){
       next();     //If session exists, proceed to page
    } else {
        res.render('home', {message: 'Unauth'})
    }
 }

/* === (Page Routes) === */
sousApp.get('/user/remove_all', (req, res) => {
    User.remove({})
    .then((result) => {
        console.log(result);
        res.redirect('/')
    })
    .catch((error) => {
        res.send('500: Error clearing database' + error, 500)
    });
});

sousApp.get('/', (req, res) => {
    if (req.session.user){
        res.render('home', {message: 'Still-Signed'})
    } else {
        res.render('home')
    }
    console.log(req)
});

//food search route
sousApp.get('/food', (req, res) => {
    res.send('<h1>Not Implemented yet GO BACK !!!</h1>')
});

//recipes search
sousApp.get('/recipes', checkSignIn, (err, req, res, next) => {
    res.render('recipe_search', {results: []})
});

//displays user recipes
sousApp.get('/user/recipes', checkSignIn, (err, req, res, next) => {
    const userN = req.session.user.username;
    User.findOne({username: userN})
        .then((document) => {
            const recipes = document.get('recipes')
            res.render('user_recipes', {results: recipes})
        })
        .catch((error) => {
            res.send('500: Error getting your recipes' + error, 500)
        });
});

//logs out our user
sousApp.get('/logout', (req, res) => {
    req.session.destroy(() =>{
        console.log('Signed out')
    });
    res.redirect('/');
});

sousApp.get('/recipes/delete/:id', checkSignIn, (err, req, res, next) => {
    const userN = req.session.user.username;
    const recipeId = Number(req.params.id);

    User.findOne({username: userN})
        .then((document) => {
            const recipes = document.get('recipes')
            foundIndex = recipes.findIndex(element => element.id === recipeId);
            console.log(recipeId)
            if (foundIndex >= 0){
                recipes.splice(foundIndex, 1)
                document.set('recipes', recipes);
                document.save();
                console.log('Recipe deleted');
                res.redirect('/user/recipes');
            } else {
                console.log('Recipe does not exist')
                res.redirect('/user/recipes');
            }
        })
        .catch((error) => {
            res.send('500: Error deleting recipe' + error, 500)
        });
});

sousApp.get('/recipes/save/:id', checkSignIn, (err, req, res, next) => {
    const recipeId = Number(req.params.id);
    const userN = req.session.user.username;
    for (let recipe of searchCache){
        if (recipe.id == recipeId){
            const storeRecipe = {
                id: recipe.id,
                image: recipe.image,
                title: recipe.title,
                pricePerServing: recipe.pricePerServing,
                spoonacularSourceUrl: recipe.spoonacularSourceUrl
            }
            User.findOne({username: userN})
                .then((document) => {
                    const recipes = document.get('recipes')
                    if (recipes.findIndex(element => element.id === storeRecipe.id) >= 0){
                        console.log('error contains recipe')
                    } else {
                        recipes.push(storeRecipe);
                        document.set('recipes', recipes);
                        console.log('adding new recipe')
                        document.save();
                    }
                })
                .catch((error) => {
                    res.send('500: Error saving recipe' + error, 500)
                });
        }
    }
});
/*=================================================*/

/*Setting port*/
const PORT = process.env.PORT || 5000;

/* === Error Handles === */
sousApp.use(function(req, res) {
    res.send('404: Page not found', 404);
});

sousApp.use(function(error, req, res, next) {
    res.send('500: Internal error' + error, 500);
})
/*==================================================*/

//sousApp start (displays sousApp start message)
sousApp.listen(PORT, () => console.log(`sousApp started on port ${PORT}`));

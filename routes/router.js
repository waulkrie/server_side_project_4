import login from '../controllers/login.js';
import main from '../controllers/main.js';
import passport from 'passport';
import middleware from '../lib/middleware.js';


const setupRoutes = (app) => {
    
    app.get('/', main.getHome);

    // get the login page
    app.get('/login', login.getLogin);

    // process the login form
    app.post('/login', passport.authenticate('local', { failureRedirect: '/login' }),  login.postLogin);

    // process the logout
    app.get('/logout', login.procLogout);

    // get the register page
    app.get('/register', login.getRegister);

    // process the register form
    app.post('/register', login.postRegister);

    app.post('/search', middleware.loginRequired, main.search);
    app.get('/favorite', middleware.loginRequired, main.postFavorite);
    app.get('/delete_favorite', middleware.loginRequired, main.deleteFavorite); // delete_favorite
        
    // 404 catch-all handler (middleware)
    app.use(function(req, res, next){
        res.status(404);
        res.render('404');
    });

    // 500 error handler (middleware)
    app.use(function(err, req, res, next){
        console.error(err.stack);
        res.status(500);
        res.render('500');
    });

}

export default setupRoutes;

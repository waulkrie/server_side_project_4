
let middleware = {

    loginRequired: function(req,res,next) {
        if(req.session && req.session.user){
            next();
        } else {
            res.redirect("/login");
        }
    },

    populateFormData: function(req, res, next) {
        res.locals.searchActive = req.path === '/search';
        res.locals.reportActive = req.path === '/report';
        res.locals.adminActive = req.path.startsWith('/dashboard');
        // res.locals.isAdmin = req.session != undefined && req.session.user != undefined && req.session.user.access === 'admin';
        res.locals.user = req.session.user;
        next();
    },

    flashMessages: function(req, res, next) {
        // if there's a flash message, transfer
        // it to the context, then clear it
        res.locals.flash = req.session.flash;
        delete req.session.flash;
        next();
    },

    /*
    * post form includes the 'search' button in req.body
    * the name fields should be empty strings if not filled, they are not required
    */
    sanitizeSearch: function(req, res, next) {
        delete req.body.login;
        if(req.body.firstName.length === 0)
            delete req.body.firstName;
            
        if(req.body.lastName.length === 0)
            delete req.body.lastName;
        if(req.body.areaCode.length === 0)
            req.body.areaCode = 850;

        next();
    }
};

export default middleware;
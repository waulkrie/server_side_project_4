import express from 'express';
import session from "express-session";
import path from 'path';
import {fileURLToPath} from 'url';
import cookieParser from 'cookie-parser';
import passport from "passport";
import {Strategy as LocalStrategy} from "passport-local";

import credentials from "./credentials.js";
import setupRoutes from "./routes/router.js";
import middleware from "./lib/middleware.js";
import User from "./models/user.js";

const app = express();

import db from './models/db.js';
db();

// set up handlebars view engine
import handlebar from 'express-handlebars';
var handlebars = handlebar.create({ defaultLayout:'main' });
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', process.env.PORT || 3000);
// set up public folder
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicPath = path.resolve(__dirname, 'public');
app.use(express.static(publicPath));

// Body parsing stuff
app.use(express.urlencoded({extended: false}));

// Extra middleware
app.use(cookieParser(credentials.cookieSecret));
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: credentials.cookieSecret,
  })
);
app.use(middleware.populateFormData); // Handle buttons on menu bar
app.use(middleware.flashMessages); // Process flash messages

// setup passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// setup routes
setupRoutes(app);


app.listen(app.get('port'), function(){
  console.log( 'Express started on http://localhost:' +
    app.get('port') + '; press Ctrl-C to terminate.' );
});

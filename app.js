// https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/Displaying_data
// https://www.digitalocean.com/pricing/
// https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/deployment
// https://aws.amazon.com/dynamodb/?did=ft_card&trk=ft_card

// https://github.com/WeiChienHsu/webdevbootcamp/blob/master/AuthDemo/app.js
// https://www.sitepoint.com/local-authentication-using-passport-node-js/
// https://medium.com/front-end-weekly/make-sessions-work-with-express-js-using-mongodb-62a8a3423ef5
// https://www.codementor.io/@mayowa.a/how-to-build-a-simple-session-based-authentication-system-with-nodejs-from-scratch-6vn67mcy3
// https://github.com/jrmh96/herokuLogin/

var createError = require('http-errors'),
    express = require('express'),
    path = require('path'),
    cookieParser = require('cookie-parser'),
    logger = require('morgan'),
    User = require('./models/user'),
    flash = require('connect-flash'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    passport = require('passport'),
    session = require('express-session'),
    MongoStore = require('connect-mongo')(session),
    LocalStrategy = require('passport-local').Strategy;
//
// logger(function (tokens, req, res) {
//     return [
//         tokens.method(req, res),
//         tokens.url(req, res),
//         tokens.status(req, res),
//         tokens.res(req, res, 'content-length'), '-',
//         tokens['response-time'](req, res), 'ms'
//     ].join(' ')
// });

var app = express();

var indexRouter = require('./routes/index');
var eventsRouter = require('./routes/events');
// var usersRouter = require('./routes/users');
var catalogRouter = require('./routes/catalog');  //Import routes for "catalog" area of site

// Passport setup
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Session
app.use(bodyParser.urlencoded({extended: true}));

// DB Config
const mongoDB = require("./config/keys").mongoURI; // import key from config/keys
mongoose.connect(mongoDB, {useNewUrlParser: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
        mongooseConnection: db
    })
}));

app.use(function (req, res, next) {
    // res.locals.currentUser = req.session.userId;
    if (req.session.userId) {
        User.findById(req.session.userId)
            .exec(function (err, user) {
                if (!err) {
                    res.locals.currentUser = user;

                } else {
                    console.log('could not find userId');
                }
                next();
            });
    } else {
        next();
    }
});

// setup view
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Setup dev packages
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Setup routers
app.use('/', indexRouter);
// app.use('/users', usersRouter);
app.use('/catalog', catalogRouter);  // Add catalog routes to middleware chain.
app.use('/events', eventsRouter);

// REGISTER GET
app.get('/users/register', function (req, res, next) {
    res.render('register');
});

// REGISTER POST
app.post('/users/register', function (req, res, next) {
    User.register(new User({username: req.body.username}), req.body.password, function (err, user) {
        if (err) {
            res.render('register', {message: err.message});
        } //user strategy
        passport.authenticate("local")(req, res, function () {
            res.redirect("/users/login"); //once the user sign up
        });
    });
});

// LOGIN GET
app.get('/users/login', function (req, res, next) {
    // custom_render('login', req, res);
    res.render('login');
});

// LOGIN POST
app.post('/users/login', function (req, res, next) {
    passport.authenticate('local', {flash: true}, function (err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.redirect('/users/login');
        }
        req.logIn(user, function (err) {
            if (err) {
                return next(err);
            }

            req.session.userId = user.id;
            return res.redirect('/');
        });
    })(req, res, next);
});

app.get('/users/logout', function (req, res, next) {
    if (req.session) {
        //delete session object
        req.session.destroy(function (err) {
            if (err) {
                console.log('error in destroying the session');
                return next(err);
            } else {
                return res.redirect("/users/login");
            }
        });
    } else {
        console.log("no session available!!");
        return res.redirect('/users/login');
    }
});

// GET SECRET
app.get("/secret", isLoggedIn, function (req, res) {
    res.render('secret');
});
//
// // custom render function to include user
// function custom_render(file_name, req, res, object) {
//     if (req.user) {
//         res.render(file_name, {object, user: req.user});
//     } else {
//         res.render(file_name);
//     }
// }

// Check for login
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    console.log('not authenticated');
    res.redirect("/users/login");
}

function requireLoggedIn(req, res, next) {
    if (req.session && req.session.userId) {
        return next();
    }
    var err = new Error("You must be logged in to view this page.");
    err.status = 401;
    return next(err);
}

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    // console.log('404, body: ', req.body);
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;

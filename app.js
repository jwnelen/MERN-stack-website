// https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/Displaying_data
// https://www.digitalocean.com/pricing/
// https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/deployment
// https://aws.amazon.com/dynamodb/?did=ft_card&trk=ft_card

// https://github.com/WeiChienHsu/webdevbootcamp/blob/master/AuthDemo/app.js
// https://www.sitepoint.com/local-authentication-using-passport-node-js/
// https://medium.com/front-end-weekly/make-sessions-work-with-express-js-using-mongodb-62a8a3423ef5
// https://www.codementor.io/@mayowa.a/how-to-build-a-simple-session-based-authentication-system-with-nodejs-from-scratch-6vn67mcy3

var createError =   require('http-errors'),
    express =       require('express'),
    path =          require('path'),
    cookieParser =  require('cookie-parser'),
    logger =        require('morgan'),
    User =          require('./models/user'),
    flash =         require('connect-flash'),
    mongoose =      require('mongoose'),
    bodyParser =    require('body-parser'),
    passport =      require('passport'),
    LocalStrategy = require('passport-local').Strategy;

var app = express();

var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
var catalogRouter = require('./routes/catalog');  //Import routes for "catalog" area of site

// Session
app.use(bodyParser.urlencoded({extended: true}));
app.use(require("express-session")({
    secret: "Rusty is the best og in the world",
    resave: false,
    saveUninitialized: false
}));

// Passport setup
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// DB Config
const mongoDB = require("./config/keys").mongoURI; // import key from config/keys
mongoose.connect(mongoDB, {useNewUrlParser: true});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

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

// REGISTER GET
app.get('/users/register', function (req, res, next) {
    custom_render('register', req, res);
});

// REGISTER POST
app.post('/users/register', function (req, res, next) {
    User.register(new User({username: req.body.username}), req.body.password, function (err, user) {
        if (err) {
            res.render('register', {message: err.message});
        } //user strategy
        passport.authenticate("local")(req, res, function () {
            console.log('Redirect to secret from Register Post');
            res.redirect("/secret"); //once the user sign up
        });
    });
});

// LOGIN GET
app.get('/users/login', function (req, res, next) {
    // custom_render('login', req, res);
    console.log(res);
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
            return res.redirect('/secret');
        });
    })(req, res, next);
});

// LOGOUT GET
app.get("/users/logout", function (req, res) {
    req.logout();
    res.redirect("/users/login");
});

// GET SECRET
app.get("/secret", isLoggedIn, function (req, res) {
    custom_render('secret', req, res);
});

// custom render function to include user
function custom_render(file_name, req, res, object) {
    if (req.user) {
        res.render(file_name, {object, user: req.user});
    } else {
        res.render(file_name);
    }
}

// Check for login
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    console.log('not authenticated');
    res.redirect("/users/login");
}

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    console.log('404, body: ', req.body);
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

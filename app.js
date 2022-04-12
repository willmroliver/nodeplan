// NPM package initialization
const express = require('express');
const bodyParser = require('body-parser');

// Local module initialization
const dateHandler = require('./utils/dateHandler.js');
const dbHandler = require('./utils/dbHandler.js');
const passportHandler = require('./utils/passportHandler.js');
const userRouting = require('./routing/users.js');

// Express.js app initialization
const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Passport.js middleware for Express
const passport = passportHandler.getPassport();
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());



app.get('/start', (req, res) => {
    res.render('start', {});
})

// If accountExists = true, user has entered an email for an existing account.
// If accountExists = null, re-enter password and password do not match.
app.route('/signup')
.get(userRouting.getSignupForm)
.post(userRouting.createAccount)

// loginSuccessful boolean determines whether client has tried to create account with an existing username.
// If loginSuccessful = false, the page is loaded with the appropriate error message.
app.get('/login', userRouting.getLoginPage)
app.get('/login/retry', userRouting.getLoginRetry)

// Handles Google OAuth2.0 login attempts
app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile'] }),
)
app.get('/auth/google/home', 
    passport.authenticate('google', { failureRedirect: '/start' }), (req, res) => {
        // Successful authentication, redirect home.
        res.redirect('/');
    }
)

app.post('/logout', userRouting.logout)

// Renders the home page
// Uses passport.js to authenticate login; see passportHandler.js
app.route('/')
.get(userRouting.getIndex)
.post(passport.authenticate('local', { failureRedirect: '/start', failureMessage: true }), userRouting.getIndex);

// Renders the calendar for the current day and month
app.get('/my-plan', userRouting.getMyPlanCurrent);

// Renders a calender for the month showing the user's events
app.get('/my-plan/:year/:month', userRouting.getMyPlanByMonth);

// Renders the full-details page of a particular event
app.get('/my-plan/:year/:month/:event', userRouting.getEvent);

app.get('/event-removed/:eventid', userRouting.removeEvent);

// Renders a page to add new events
app.route('/add-event')
.get(userRouting.getAddEventForm)
.post(userRouting.addEvent);

// Handles event edits
app.post('/edit-event/:eventid', userRouting.editEvent);

// Renders account info/edit page
app.route('/account')
.get(userRouting.getAccount);

app.listen(process.env.PORT || 3000, () => {
    console.log('Listening');
})
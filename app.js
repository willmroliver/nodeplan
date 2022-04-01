// NPM package initialization
const express = require('express');
const bodyParser = require('body-parser');

// Local module initialization
const dateHandler = require(__dirname + '/my-modules/dateHandler.js');
const dbHandler = require(__dirname + '/my-modules/dbHandler.js');
const passportHandler = require(__dirname + '/my-modules/passportHandler.js');

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

// accountExists boolean determines whether client has tried to create account with an existing username.
// If accountExists = true, the page is loaded with the appropriate error message.
app.route('/signup')
.get((req, res) => {
    res.render('signup', {accountExists: false});
})
.post(async (req, res) => {
    const reqBody = req.body;

    // If account exists, insertAccount() returns null
    const result = await dbHandler.insertAccount(reqBody);

    if (result !== null) {
        res.redirect(307, '/');

    } else {
        res.render('signup', {accountExists: true});
    }
})

// loginSuccessful boolean determines whether client has tried to create account with an existing username.
// If loginSuccessful = false, the page is loaded with the appropriate error message.
app.get('/login', (req, res) => {

    if (req.user !== undefined) {   // True when already logged in with passport.js
        res.redirect('/');
    } else {
        res.render('login', {loginSuccessful: true});
    }
})
app.get('/login/retry', (req, res) => {
    res.render('login', {loginSuccessful: false});
})

app.post('/logout', (req, res) => {
    req.logout();
    res.redirect('/start');
})

// Renders the home page
// Uses passport.js to authenticate login; see passportHandler.js
app.route('/')
.get((req, res) => {

    if (req.user !== undefined) {
        res.render('index', {userAccount: req.user});

    } else {
        res.redirect('/start');
    }
})
.post(passport.authenticate('local', { failureRedirect: '/start', failureMessage: true }), (req, res) => {
    res.render('index', {userAccount: req.user});
});

// Renders the calendar for the current day and month
app.get('/my-plan', (req, res) => {

    if (req.user !== undefined) {
        const today = new Date();
        const monthString = dateHandler.getMonthString(today.getMonth());
        const year = today.getFullYear();

        res.redirect('/my-plan/'+year+'/'+monthString);
    } else {
        res.redirect('/login');
    }

    
})

// Renders a calender for the month showing the user's events
app.get('/my-plan/:year/:month', async (req, res) => {

    if (req.user !== undefined) {
        const year = parseInt(req.params.year);
        const month = parseInt(dateHandler.getMonthNumber(req.params.month));
        const startingIndex = dateHandler.getStartingIndex(year, month);

        const events = await dbHandler.retrieveEventsByMonth(year, month, req.user);

        res.render('viewplan', {
            events: events, 
            year: year, 
            month: month,
            startingIndex: startingIndex
        });
    } else {
        res.redirect('/login');
    }
    
})

// Renders the full-details page of a particular event
app.get('/my-plan/:year/:month/:event', async (req, res) => {

    if (req.user !== undefined) {
        const year = parseInt(req.params.year);
        const month = parseInt(dateHandler.getMonthNumber(req.params.month));
        const eventName = req.params.event;

        const event = await dbHandler.retrieveEvent(year, month, eventName, req.user);
        
        res.render('viewevent', {event: event});
    } else {
        res.redirect('/login');
    }

    
})

app.get('/event-removed/:eventid', async (req, res) => {
    
    if (req.user !== undefined) {
        const eventId = req.params.eventid;
        const result =  await deleteEventById(eventId);
        res.render('deleteresult', {result: result});
    } else {
        res.redirect('/login');
    }
    
})

// Renders a page to add new events
app.get('/new-event', (req, res) => {

    if (req.user !== undefined) {
        res.render('addevent', {});
    } else {
        res.redirect('/login');
    }
    
})

// Handles the addition of a new event
app.post('/add-event', (req, res) => {
    
    dbHandler.insertEvent(req.body, req.user._id);
    res.redirect('/new-event');
})

// Handles event edits
app.post('/edit-event/:eventid', async (req, res) => {

    const newEvent = dbHandler.createEventObject(req.body); 
    const eventId = req.params.eventid;

    await dbHandler.replaceEventById(eventId, newEvent);

    const year = newEvent.startDateTime.year;
    const month = newEvent.startDateTime.month;
    const eventName = newEvent.eventName;
    const route = '/my-plan/' + year + '/' + dateHandler.getMonthString(month) + '/' + eventName;
    res.redirect(route);
})



app.listen(process.env.PORT || 3000, () => {
    console.log('Listening');
})
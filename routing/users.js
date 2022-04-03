const dateHandler = require('../utils/dateHandler.js');
const dbHandler = require('../utils/dbHandler.js');


// ROUTE '/signup'

const getSignupForm = (req, res) => {
    res.render('signup', {accountExists: false});
}
module.exports.getSignupForm = getSignupForm;


const createAccount = async (req, res) => {
    const reqBody = req.body;

    if (reqBody.password !== reqBody.passwordCheck) {
        res.render('signup', {accountExists: null});

    } else {
        // If account exists, insertAccount() returns null
        const result = await dbHandler.insertAccount(reqBody);

        if (result !== null) {
            res.redirect(307, '/');

        } else {
            res.render('signup', {accountExists: true});
        }
    }
}
module.exports.createAccount = createAccount;


// ROUTE '/login'

const getLoginPage = (req, res) => {
    if (req.user !== undefined) {   // True when already logged in with passport.js
        res.redirect('/');
    } else {
        res.render('login', {loginSuccessful: true});
    }
}
module.exports.getLoginPage = getLoginPage;



// ROUTE '/login/retry'

const getLoginRetry = (req, res) => {
    res.render('login', {loginSuccessful: false});
}
module.exports.getLoginRetry = getLoginRetry;


// ROUTE '/logout'

const logout = (req, res) => {
    req.logout();
    res.redirect('/start');
}
module.exports.logout = logout;


// ROUTE '/'

const getIndex = (req, res) => {
    if (req.user !== undefined) {
        res.render('index', {userAccount: req.user});

    } else {
        res.redirect('/start');
    }
}
module.exports.getIndex = getIndex;


// ROUTE '/my-plan'

const getMyPlanCurrent = (req, res) => {
    if (req.user !== undefined) {
        const today = new Date();
        const monthString = dateHandler.getMonthString(today.getMonth());
        const year = today.getFullYear();

        res.redirect('/my-plan/'+year+'/'+monthString);
    } else {
        res.redirect('/login');
    }
}
module.exports.getMyPlanCurrent = getMyPlanCurrent;


// ROUTE '/my-plan/:year/:month

const getMyPlanByMonth = async (req, res) => {
    if (req.user !== undefined) {
        const year = parseInt(req.params.year);
        const month = parseInt(dateHandler.getMonthNumber(req.params.month));

        // For EJS calendar
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
}
module.exports.getMyPlanByMonth = getMyPlanByMonth;


// ROUTE '/my-plan/:year/:month/:event'

const getEvent = async (req, res) => {
    if (req.user !== undefined) {
        const year = parseInt(req.params.year);
        const month = parseInt(dateHandler.getMonthNumber(req.params.month));
        const eventName = req.params.event;

        const event = await dbHandler.retrieveEvent(year, month, eventName, req.user);
        res.render('viewevent', {event: event});

    } else {
        res.redirect('/login');
    }
}
module.exports.getEvent = getEvent;


// ROUTE '/event-removed/:eventid'

const removeEvent = async (req, res) => {
    if (req.user !== undefined) {
        const eventId = req.params.eventid;
        const result =  await deleteEventById(eventId);
        res.render('deleteresult', {result: result});

    } else {
        res.redirect('/login');
    }  
}
module.exports.removeEvent = removeEvent;


// ROUTE '/add-event'

const getAddEventForm = (req, res) => {
    if (req.user !== undefined) {
        res.render('addevent', {});
    } else {
        res.redirect('/login');
    }
}
module.exports.getAddEventForm = getAddEventForm;


const addEvent = async (req, res) => {
    if (req.user !== undefined) {
        const reqBody = req.body;
        await dbHandler.insertEvent(reqBody, req.user._id);

        const startDateInfo = reqBody.startDateTime;
        const year = startDateInfo.year;
        const month = dateHandler.getMonthString(startDateInfo.month);
        const eventName = req.body.eventName

        res.redirect('/my-plan/'+year+'/'+month+'/'+eventName);

    } else {
        res.redirect('/login');
    }
    
}
module.exports.addEvent = addEvent;


// ROUTE '/edit-event/:eventid'

const editEvent = async (req, res) => {
    const newEvent = dbHandler.createEventObject(req.body, req.user._id); 
    const eventId = req.params.eventid;

    await dbHandler.replaceEventById(eventId, newEvent);

    const year = newEvent.startDateTime.year;
    const month = newEvent.startDateTime.month;
    const eventName = newEvent.eventName;
    const route = '/my-plan/' + year + '/' + dateHandler.getMonthString(month) + '/' + eventName;
    res.redirect(route);
}
module.exports.editEvent = editEvent;
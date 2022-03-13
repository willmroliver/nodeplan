const express = require('express');
const bodyParser = require('body-parser');
const { deleteEventById } = require('./my-modules/eventHandler');

const dateHandler = require(__dirname + '/my-modules/dateHandler.js');
const eventHandler = require(__dirname + '/my-modules/eventHandler.js');

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.set('view engine', 'ejs');

var events = [];

// Renders the home page
app.get('/', (req, res) => {

    res.render('index', {});
})

// Renders the calendar for the current day and month
app.get('/my-plan', (req, res) => {

    const today = new Date();
    const monthString = dateHandler.getMonthString(today.getMonth());
    const year = today.getFullYear();

    res.redirect('/my-plan/'+year+'/'+monthString);
})

// Renders a calender for the month showing the user's events
app.get('/my-plan/:year/:month', (req, res) => {

    const year = parseInt(req.params.year);
    const month = parseInt(dateHandler.getMonthNumber(req.params.month));
    const startingIndex = dateHandler.getStartingIndex(year, month);

    fetchEventsByMonthAndRender(res, 'viewplan', year, month, startingIndex);
})

// Renders the full-details page of a particular event
app.get('/my-plan/:year/:month/:event', (req, res) => {

    const year = parseInt(req.params.year);
    const month = parseInt(dateHandler.getMonthNumber(req.params.month));
    const eventName = req.params.event;

    fetchEventAndRender(res, 'viewevent', year, month, eventName);
})

app.get('/event-removed/:eventid', (req, res) => {

    const eventId = req.params.eventid;
    
    deleteEventAndRender(res, 'deleteresult', eventId);
})

// Renders a page to add new events
app.get('/new-event', (req, res) => {

    res.render('addevent', {});
})

// Handles the addition of a new event
app.post('/add-event', (req, res) => {
    
    const newEvent = req.body;

    const dateTimeObject = dateHandler.getDateInfo(req.body.eventDateTime);
    newEvent['eventDateTime'] = dateTimeObject;

    eventHandler.insertEvent(newEvent);

    res.redirect('/new-event');
})

// Handles event edits
app.post('/edit-event/:eventid', (req, res) => {

    const newEvent = req.body;

    const dateTimeObject = dateHandler.getDateInfo(req.body.eventDateTime);
    newEvent['eventDateTime'] = dateTimeObject;
    
    const eventId = req.params.eventid;
    editEventAndRender(res, 'viewevent', eventId, newEvent);
})

// For CALENDER.EJS
const fetchEventsByMonthAndRender = async (res, ejsfilename, year, month, startingIndex) => {

    events = await eventHandler.retrieveEventsByMonth(year, month);

    res.render(ejsfilename, {
        events: events, 
        year: year, 
        month: month,
        startingIndex: startingIndex
    });
}

// For VIEWEVENT.EJS
const fetchEventAndRender = async (res, ejsfilename, year, month, eventName) => {

    thisEvent = await eventHandler.retrieveEvent(year, month, eventName);
    res.render(ejsfilename, {event: thisEvent});
}

const editEventAndRender = async (res, ejsfilename, eventId, newEvent) => {

    thisEvent = await eventHandler.replaceEventById(eventId, newEvent);
    const year = thisEvent.eventDateTime.year;
    const month = thisEvent.eventDateTime.month;
    const eventName = thisEvent.eventName;
    const route = '/my-plan/' + year + '/' + dateHandler.getMonthString(month) + '/' + eventName;
    res.redirect(route);
}

// For DELETERESULT.EJS
const deleteEventAndRender = async (res, ejsfilename, eventId) => {

    const result =  await deleteEventById(eventId);

    res.render(ejsfilename, {result: result});
}

app.listen(process.env.PORT || 3000, () => {
    console.log('Listening');
})
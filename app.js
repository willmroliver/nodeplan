const express = require('express');
const bodyParser = require('body-parser');
const { deleteEventById } = require('./my-modules/eventHandler');

const dateHandler = require(__dirname + '/my-modules/dateHandler.js');
const eventHandler = require(__dirname + '/my-modules/eventHandler.js');

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.set('view engine', 'ejs');


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
app.get('/my-plan/:year/:month', async (req, res) => {

    const year = parseInt(req.params.year);
    const month = parseInt(dateHandler.getMonthNumber(req.params.month));
    const startingIndex = dateHandler.getStartingIndex(year, month);

    const events = await eventHandler.retrieveEventsByMonth(year, month);

    res.render('viewplan', {
        events: events, 
        year: year, 
        month: month,
        startingIndex: startingIndex
    });
})

// Renders the full-details page of a particular event
app.get('/my-plan/:year/:month/:event', async (req, res) => {

    const year = parseInt(req.params.year);
    const month = parseInt(dateHandler.getMonthNumber(req.params.month));
    const eventName = req.params.event;

    const event = await eventHandler.retrieveEvent(year, month, eventName);
    
    res.render('viewevent', {event: event});
})

app.get('/event-removed/:eventid', async (req, res) => {

    const eventId = req.params.eventid;
    const result =  await deleteEventById(eventId);
    res.render('deleteresult', {result: result});
})

// Renders a page to add new events
app.get('/new-event', (req, res) => {

    res.render('addevent', {});
})

// Handles the addition of a new event
app.post('/add-event', (req, res) => {
    
    const newEvent = eventHandler.createEventObject(req.body)

    eventHandler.insertEvent(newEvent);
    res.redirect('/new-event');
})

// Handles event edits
app.post('/edit-event/:eventid', async (req, res) => {

    const newEvent = eventHandler.createEventObject(req.body); 
    const eventId = req.params.eventid;

    await eventHandler.replaceEventById(eventId, newEvent);

    const year = newEvent.startDateTime.year;
    const month = newEvent.startDateTime.month;
    const eventName = newEvent.eventName;
    const route = '/my-plan/' + year + '/' + dateHandler.getMonthString(month) + '/' + eventName;
    res.redirect(route);
})



app.listen(process.env.PORT || 3000, () => {
    console.log('Listening');
})
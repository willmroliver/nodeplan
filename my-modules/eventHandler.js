const { MongoClient, ObjectId } = require('mongodb');
const dotenv = require('dotenv');
const dateHandler = require(__dirname + '/dateHandler.js');

dotenv.config();
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

const dbName = 'nodePlanDB';
const defaultCollection = 'events';

// Create a properly formatted Event Object from req.body data
const createEventObject = (reqBody) => {

    const newEvent = reqBody;

    const startDateTimeObject = dateHandler.getDateInfo(reqBody.startDateTime);
    const endDateTimeObject = dateHandler.getDateInfo(reqBody.endDateTime);
    newEvent['startDateTime'] = startDateTimeObject;
    newEvent['endDateTime'] = endDateTimeObject;

    return newEvent;
}
module.exports.createEventObject = createEventObject;

// Insert an event into the DB
const insertEvent = (newEvent) => {

    async function run() {
        try {
            await client.connect();

            const database = client.db(dbName);
            const events = database.collection(defaultCollection);

            // create a document to insert
            const doc = newEvent;
            const result = await events.insertOne(doc);

            console.log(`A document was inserted with the _id: ${result.insertedId}`);
        } finally {
            await client.close();
        }
    }
    run().catch(console.dir);
}
module.exports.insertEvent = insertEvent;


// Retrieve the events of a given year and month;
// Preferable to retrieveEvents when rendering calendar;
const retrieveEventsByMonth = (year, month) => {

    async function run() {
        try {
            await client.connect();
            
            const database = client.db(dbName);
            const events = database.collection(defaultCollection);

            const eventsCursor = events.find(
                {
                    'startDateTime.year': { $eq: year } ,
                    'startDateTime.month': { $eq: month } 
                }
            );

            const eventsArray = await eventsCursor.toArray();

            return eventsArray;
        } finally {
            await client.close();
        }
    }

    return run().catch(console.dir);
}
module.exports.retrieveEventsByMonth = retrieveEventsByMonth;


// Will be over-ridden in future to allow for custom event requests
const retrieveEvent = (year, month, eventName) => {

    const client = new MongoClient(uri);

    async function run() {
        try {
            await client.connect();
            
            const database = client.db(dbName);
            const events = database.collection(defaultCollection);

            const event = await events.findOne(
                {
                    'startDateTime.year': { $eq: year } ,
                    'startDateTime.month': { $eq: month },
                    'eventName': { $eq: eventName } 
                }
            );

            return event;
        } finally {
            await client.close();
        }
    }

    return run().catch(console.dir);
}
module.exports.retrieveEvent = retrieveEvent;


// Retrieves ALL events
const retrieveAllEvents = () => {

    const client = new MongoClient(uri);

    async function run() {
        try {
            await client.connect();
            
            const database = client.db(dbName);
            const events = database.collection(defaultCollection);

            const eventsCursor = events.find({});

            const eventsArray = await eventsCursor.toArray();

            return eventsArray;
        } finally {
            await client.close();
        }
    }

    return run().catch(console.dir);
}
module.exports.retrieveAllEvents = retrieveAllEvents;

//Update an event
const replaceEventById = (eventId, newEvent) => {

    const client = new MongoClient(uri);

    async function run() {
        try {
            await client.connect();

            const database = client.db(dbName);
            const events = database.collection(defaultCollection);

            const result = await events.findOneAndReplace(
                {'_id': ObjectId(eventId) },
                newEvent
            )
            
        } finally {
            await client.close();
        }
    }
    run().catch(console.dir);

    return newEvent;
}
module.exports.replaceEventById = replaceEventById;


// Delete an event
const deleteEventById = (eventId) => {

    const client = new MongoClient(uri);

    async function run() {
        try {
            await client.connect();

            const database = client.db(dbName);
            const events = database.collection(defaultCollection);

            const result = await events.deleteOne(
                { '_id': ObjectId(eventId) }
            )

            if (result.deletedCount > 0) {
                return "Successfully removed event."
            } else {
                return "Something went wrong."
            }
        } finally {
            await client.close();
        }
    }

    return run().catch(console.dir);
}
module.exports.deleteEventById = deleteEventById;
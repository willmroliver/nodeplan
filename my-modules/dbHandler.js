const dotenv = require('dotenv');
dotenv.config();

const { MongoClient, ObjectId } = require('mongodb');
const dateHandler = require(__dirname + '/dateHandler.js');
const encryptionHandler = require(__dirname + '/encryptionHandler.js');

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

const dbName = 'nodePlanDB';
const eventsCollection = 'events';
const usersCollection = 'users';



// UTILITY FUNCTIONS

// Initializes the connection to the MongoDB Atlas
const connectToMongoDB = async () => {
    try {
        client.connect();
    } catch (err) {
        console.log(error);
        client.close();
    }
}
connectToMongoDB();

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

// Create a properly formatted User Account Object from req.body data
// ONLY TO BE USED FOR insertAccount() as new salt values in passwordData are returned every call
// See encryptionHandler.js
const createAccountObject = (reqBody) => {

    const newAccount = {
        username: reqBody.username,
        email: reqBody.email,
        passwordData: encryptionHandler.getPasswordHashData(reqBody.password)
    }

    return newAccount;
}


// USER ACCOUNT CRUD FUNCTIONS

// Find an account in the DB by email; Returns null if no account is found;
const findOneAccount = (email) => {

    async function run() {
        try {
            const database = client.db(dbName);
            const users = database.collection(usersCollection);

            const account = await users.findOne(
                { email: email }
            );

            return account;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }
    return run();
}
module.exports.findOneAccount = findOneAccount;


// Create a new account and insert into the DB; returns null if the account already exists
const insertAccount = (reqBody) => {

    async function run() {
        try {
            const database = client.db(dbName);
            const users = database.collection(usersCollection);

            const account = createAccountObject(reqBody);

            // If null, account does not already exist so can be created
            if (await findOneAccount(account.username) === null) {

                const doc = account;
    
                const result = await users.insertOne(doc);
                return result;

            } else {
                return null;
            }
        } catch (err) {
            console.log(err);
        }
    }
    return run();
}
module.exports.insertAccount = insertAccount;



// EVENT CRUD FUNCTIONS

// Insert an event into the DB
const insertEvent = (newEvent) => {

    async function run() {
        try {
            const database = client.db(dbName);
            const events = database.collection(eventsCollection);

            // create a document to insert
            const doc = newEvent;
            const result = await events.insertOne(doc);

            console.log(`A document was inserted with the _id: ${result.insertedId}`);
        } catch (err) {
            console.log(err);
        }
    }
    run()
}
module.exports.insertEvent = insertEvent;


// Retrieve the events of a given year and month;
// Preferable to retrieveEvents when rendering calendar;
const retrieveEventsByMonth = (year, month) => {

    async function run() {
        try {
            const database = client.db(dbName);
            const events = database.collection(eventsCollection);

            const eventsCursor = events.find(
                {
                    'startDateTime.year': { $eq: year } ,
                    'startDateTime.month': { $eq: month } 
                }
            );

            const eventsArray = await eventsCursor.toArray();

            return eventsArray;
        } catch (err) {
            console.log(err);
        }
    }
    return run();
}
module.exports.retrieveEventsByMonth = retrieveEventsByMonth;


// Will be over-ridden in future to allow for custom event requests
const retrieveEvent = (year, month, eventName) => {

    async function run() {
        try {
            const database = client.db(dbName);
            const events = database.collection(eventsCollection);

            const event = await events.findOne(
                {
                    'startDateTime.year': { $eq: year } ,
                    'startDateTime.month': { $eq: month },
                    'eventName': { $eq: eventName } 
                }
            );

            return event;
        } catch (err) {
            console.log(err);
        }
    }
    return run();
}
module.exports.retrieveEvent = retrieveEvent;


// Retrieves ALL events
const retrieveAllEvents = () => {

    async function run() {
        try {
            const database = client.db(dbName);
            const events = database.collection(eventsCollection);

            const eventsCursor = events.find({});

            const eventsArray = await eventsCursor.toArray();

            return eventsArray;
        } catch (err) {
            console.log(err);
        }
    }
    return run();
}
module.exports.retrieveAllEvents = retrieveAllEvents;

//Update an event
const replaceEventById = (eventId, newEvent) => {

    async function run() {
        try {
            const database = client.db(dbName);
            const events = database.collection(eventsCollection);

            const result = await events.findOneAndReplace(
                {'_id': ObjectId(eventId) },
                newEvent
            )
            return result;
            
        } catch (err) {
            console.log(err);
        }
    }
    return run();
}
module.exports.replaceEventById = replaceEventById;


// Delete an event
const deleteEventById = (eventId) => {

    async function run() {
        try {
            const database = client.db(dbName);
            const events = database.collection(eventsCollection);

            const result = await events.deleteOne(
                { '_id': ObjectId(eventId) }
            )

            if (result.deletedCount > 0) {
                return "Successfully removed event."
            } else {
                return "Something went wrong."
            }
        } catch (err) {
            console.log(err);
        }
    }
    return run();
}
module.exports.deleteEventById = deleteEventById;
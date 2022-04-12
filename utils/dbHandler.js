const dotenv = require('dotenv');
dotenv.config();

const { MongoClient, ObjectId } = require('mongodb');
const dateHandler = require('./dateHandler.js');
const encryptionHandler = require('./encryptionHandler.js');

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
const createEventObject = (reqBody, userID) => {
    const newEvent = reqBody;

    const startDateTimeObject = dateHandler.getDateTimeSaveInfo(reqBody.startDateTime);
    const endDateTimeObject = dateHandler.getDateTimeSaveInfo(reqBody.endDateTime);
    newEvent['startDateTime'] = startDateTimeObject;
    newEvent['endDateTime'] = endDateTimeObject;
    newEvent['userID'] = ObjectId(userID);

    return newEvent;
}
module.exports.createEventObject = createEventObject;

// Create a properly formatted User Account Object from req.body data
// ONLY TO BE USED FOR insertAccount() as new salt values are generated every call by getPasswordHashData()
// See encryptionHandler.js
const createAccountObject = (reqBody) => {
    const newAccount = {
        username: reqBody.username,
        email: reqBody.email,
        passwordData: encryptionHandler.getPasswordHashData(reqBody.password)
    }
    return newAccount;
}
// Sister function to above for 'google' authType: See insertAccount() and passportHandler.js
const createGoogleAccountObject = (profile) => {
    const newAccount = {
        username: profile.displayName,
        googleID: profile.id
    }
    return newAccount;
}

// USER ACCOUNT CRUD FUNCTIONS

// Find an account in the DB by authType (local searches by 'email', google by 'googleID', etc.);
// Returns null if no account is found
const findOneAccount = (authType, value) => {

    async function run() {
        try {
            const database = client.db(dbName);
            const users = database.collection(usersCollection);

            var account;

            switch (authType) {
                case 'local':  
                    account = await users.findOne({ email: value });
                    break;
                case 'google':
                    account = await users.findOne({ googleID: value });
                    break;
                default:
                    throw new Error("Invalid Search Parameter");
            }
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
// 'authType' variable can currently be set to 'local', 'google', reflecting the currently supported Passport.js Strategies 
const insertAccount = (reqBody, authType) => {

    async function run() {
        try {
            const database = client.db(dbName);
            const users = database.collection(usersCollection);

            var account;
            if (authType === 'google') {
                account = createGoogleAccountObject(reqBody);
            } else if (authType === 'local') {
                account = createAccountObject(reqBody);
            } else {
                throw new Error("Invalid authType");
            }

            var findValue;
            switch (authType) {
                case 'local':
                    findValue = account.email;
                    break;
                case 'google':
                    findValue = account.googleID;
                    break;
                default:
                    throw new Error("Invalid authType");
            }

            // If null, account does not already exist so can be created
            if (await findOneAccount(authType, findValue) === null) {

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


// For use with OAuth2.0.
// First checks if an account is already associated with the Google/Facebook/etc. credentials,
// If not, a new account is inserted and related to the Google/Facebook/etc. account.
const findOneOrInsert = async (authType, profile) => {

    try {
        var findValue;

        switch (authType) {
            case 'google':
                findValue = profile.id;
                break;
            default:
                throw new Error('Invalid authType');
        }

        const user = await findOneAccount(authType, findValue);

        if (user !== null) {
            return user;
        }
        else if (user === null) {
            const result = await insertAccount(profile, authType);
            return await findOneAccount(authType, findValue);
        } 
        else {
            return null;
        }
    } catch (err) {
        console.log(err);
        throw err;
    }
}
module.exports.findOneOrInsert = findOneOrInsert;

// EVENT CRUD FUNCTIONS

// Insert an event into the DB
const insertEvent = (reqBody, userID) => {

    const newEvent = createEventObject(reqBody, userID);

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


// Retrieve the user's events of a given year and month;
// Preferable to retrieveEvents when rendering calendar;
const retrieveEventsByMonth = (year, month, user) => {

    async function run() {
        try {
            const database = client.db(dbName);
            const events = database.collection(eventsCollection);

            const eventsCursor = events.find(
                {
                    'startDateTime.year': { $eq: year },
                    'startDateTime.month': { $eq: month },
                    'userID': { $eq: ObjectId(user._id) }
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


// Needs updating for greater user flexibility; currently constrains to unique event names in a given month
const retrieveEvent = (year, month, eventName, user) => {

    async function run() {
        try {
            const database = client.db(dbName);
            const events = database.collection(eventsCollection);

            const event = await events.findOne(
                {
                    'startDateTime.year': { $eq: year } ,
                    'startDateTime.month': { $eq: month },
                    'eventName': { $eq: eventName },
                    'userID': { $eq: ObjectId(user._id) }  
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


// Retrieves ALL a user's events
const retrieveAllEvents = (user) => {

    async function run() {
        try {
            const database = client.db(dbName);
            const events = database.collection(eventsCollection);

            const eventsCursor = events.find({
                'userID': { $eq: ObjectId(user._id) } 
            });

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
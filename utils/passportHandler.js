// Local module initialization
const dbHandler = require(__dirname + '/dbHandler.js');
const encryptionHandler = require(__dirname + '/encryptionHandler.js');

// Passport.js Initialization/Configuration
var LocalStrategy = require('passport-local');
var GoogleStrategy = require('passport-google-oauth20');
var passport = require('passport');

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});


const localStrategy = new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, 
async (email, password, done) => {
    try {
        const result = await dbHandler.findOneAccount('local', email);

        if (result === null) {  // True if dbHandler fails to find an account with the corresponding email
            return done(null, false, { message: "Email or Password Incorrect" });

        } else {
            const hashedPassword = result.passwordData.password;
            const salts = result.passwordData.salts;

            if (encryptionHandler.checkPassword(password, salts) !== hashedPassword) {  // checks password input against DB
                return done(null, false, { message: "Email or Password Incorrect" });

            } else {
                return done(null, result);
            }
        }
    } catch (err) {
        return done(err);
    }
});


const googleStrategy = new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/home"
}, 
async (accessToken, refreshToken, profile, done) => {
    try {
        const result = await dbHandler.findOneOrInsert('google', profile);

        if (result === null) {
            return done(null, false, { message: "Login Failed" });

        } else {
            return done(null, result);
        }
    } catch (err) {
        return done(err);
    }
})


// Strategy used when a user links an existing account with their Google Account
// Same as above except DOES NOT insert a new account if no matching Google Account is found in DB
const googleAltStrategy = new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/account/auth/google/link",
    passReqToCallback: true
},
async (req, accessToken, refreshToken, profile, done) => {
    try {
        const result = await dbHandler.linkAccounts('google', profile, req.user);

        if (result === null) {
            return done(null, false, { message: "Link Failed" });

        } else {
            return done(null, result);
        }
    } catch (err) {
        return done(err);
    }
})


passport.use(localStrategy);
passport.use('google', googleStrategy);
passport.use('google-alt', googleAltStrategy);

const getPassport = () => { return passport };
module.exports.getPassport = getPassport;
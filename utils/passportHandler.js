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
    callbackURL: "https://node-plan.herokuapp.com/auth/google/home"
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

passport.use(localStrategy);
passport.use(googleStrategy);

const getPassport = () => { return passport };
module.exports.getPassport = getPassport;
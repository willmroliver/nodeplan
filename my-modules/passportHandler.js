// Local module initialization
const dbHandler = require(__dirname + '/dbHandler.js');
const encryptionHandler = require(__dirname + '/encryptionHandler.js');

// Passport.js Initialization/Configuration
var LocalStrategy = require('passport-local');
var passport = require('passport');

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

const strategy = new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    try {
        const result = await dbHandler.findOneAccount(email);

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

passport.use(strategy);

const getPassport = () => { return passport };
module.exports.getPassport = getPassport;
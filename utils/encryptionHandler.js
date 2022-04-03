const crypto = require('crypto');


// Generates 32 pseudo-random cryptographically secure bytes and converts to string for salting
const createSalt = () => {

    const noOfBytes = 32;

    try {
        return crypto.randomBytes(noOfBytes).toString('hex');
    } catch (err) {
        console.log(err);
        return null;
    }
}


// Generates the hashed password after 10 rounds of salting and returns both the hashed password and salts
const getPasswordHashData = (password) => {

    const rounds = 10;

    var result = password;
    const salts = [];

    for (var i = 0; i < rounds; i++) {
        const newSalt = createSalt();
        salts.push(newSalt);
        result += newSalt;
        result = crypto.createHash('sha256').update(result).digest('hex');
    }

    return {password: result, salts: salts}
}
module.exports.getPasswordHashData = getPasswordHashData;


// Takes the user password and their salts, generates the resulting salted hash and compares with the hashed password in DB
const checkPassword = (password, salts) => {

    var result = password;
    salts.forEach((salt) => {
        result += salt;
        result = crypto.createHash('sha256').update(result).digest('hex');
    })

    return result;
}
module.exports.checkPassword = checkPassword;
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

// Load User model
const User = require('../models/User');

module.exports = ((passport) => {
    let ls = new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
        // Match user
        User.findOne({
            email: email
        }).then((userFromDB) => {
            if (!userFromDB) {
                // error, User, messege
                return done(null, false, { message: 'That email is not registered' });
            }

            // Match password
            bcrypt.compare(password, userFromDB.password, (err, isMatch) => {
                if (err) throw err;
                if (isMatch) {
                    return done(null, userFromDB);
                } else {
                    return done(null, false, { message: 'Password incorrect' });
                }
            });
        });
    });
    passport.use(ls);

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });
});
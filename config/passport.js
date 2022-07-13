const JwtStrategy  = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const keys = require("./keys");
const User = require("../models/User")

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

const passportFunc = (passport) => {
    passport.use(
        new JwtStrategy(opts, (jwt_payload, done) => {
            User.findById(jwt_payload.id)
                .then(user => {
                    if (!user) return done(null, false);
                    return done(null, user);
                })
                .catch(err => console.log(err));
        })
    );
};

module.exports = passportFunc;

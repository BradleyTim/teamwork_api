const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const { Client } = require('pg');

const db = new Client({
  connectionString: process.env.URI
});

db.connect()
  .then(() => console.log("CONNECTED TO DB FROM PASSPORT AUTH"))
  .catch(err => console.log(err));

const options = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: process.env.SECRET_KEY
};

module.exports = (passport) => {
	passport.use(new JwtStrategy(options, (jwt_payload, done) => {
		console.log(jwt_payload);
		db.query("SELECT * FROM users WHERE id=$1", [jwt_payload.id])
			.then(result => {
				if(result.rows.length > 0) {
					return done(null, result.rows[0]);
				} else {
					return done(null, false);
				}
			})
			.catch((error) => console.error(error));
	}));	
}
var passport 			= require('passport');
//var GoogleStrategy 		= require('passport-google-oauth20').Strategy;
//var TwitterStrategy 	= require('passport-twitter-oauth2.0').Strategy;
var AppleStrategy 	= require('passport-appleid').Strategy;

const path = require('path')
var socialLoginClass = function(options) {
	var scope 		= this;
	this.app 		= options.app 		|| {};
	this.onAuth 	= options.onAuth 	|| function() {};
	this.url		= options.url		|| 'https://infinitysocial.ddns.net:3003';
	this.logout		= options.logout	|| {url: '/logout', after:	'/'};
	this.map		= {
		apple:		AppleStrategy,
		//twitter:		TwitterStrategy,
		//google:			GoogleStrategy
	};
	this.specialCases = {
		twitter:{
			setup:	{
				clientType: "public",
				state: true,
				pkce: true,
				skipExtendedProfile: true
			}
		},
		apple:{
			setup:	{
				privateKeyPath: path.join(__dirname, "./AuthKey_9FXC62Q3S9.p8"),
				keyIdentifier: '9FXC62Q3S9'
			},
			varChanges:{
				"clientSecret":"teamId"
			}
		}
	}

}
socialLoginClass.prototype.use = function(settings) {
	this.settings = settings;
	this.init();
}
socialLoginClass.prototype.init = function() {
	var scope = this;

	// Setup PassportJS
	this.app.use(passport.initialize());
	this.app.use(passport.session());
	passport.serializeUser(function(user, done) {
	  done(null, user);
	});
	passport.deserializeUser(function(user, done) {
	  done(null, user);
	});

	this.app.get(this.logout.url, function(req, res){
		res.clearCookie('session_key');
		req.logout();
		res.redirect(scope.logout.after);
	});

	var type;
	for (type in this.settings) {
		this.setup(type, this.settings[type]);
	}


	// Setup the cache
	var caching = function(ttl) {
		this.ttl 	= ttl;
		this.cache 	= {};
		var scope = this;
		setInterval(function() {
			var i;
			var t = new Date().getTime();
			for (i in scope.cache) {
				if (scope.cache[i].expires < t) {
					delete scope.cache[i];
				}
			}
		}, this.ttl/2);
	};
	caching.prototype.set = function(label, value) {
		//Gamify.log("set()", [label, value]);
		var expires = new Date().getTime()+this.ttl;
		this.cache[label] = {
			data:		value,
			expires:	expires
		}
		return expires;
	}
	caching.prototype.get = function(label) {
		if (this.cache[label]) {
			return this.cache[label].data;
		}
		return null;
	};
	caching.prototype.clear = function(label) {
		//Gamify.log("clear",label);
		delete this.cache[label];
	};

	this.cache = new caching(1000*20);	// 20sec session caching

}
socialLoginClass.prototype.setup = function(type, settings) {
	var scope = this;
	var passportSetup = {
		clientID: 			settings.settings.clientID,
		clientSecret: 		settings.settings.clientSecret,
		callbackURL: 		this.url+settings.url.callback,
		passReqToCallback: 	true
	};
	if (this.specialCases[type] && this.specialCases[type].setup) {
		passportSetup = {...passportSetup,...this.specialCases[type].setup}
	}
	if (this.specialCases[type] && this.specialCases[type].varChanges) {
		var varname;
		for (varname in this.specialCases[type].varChanges) {
			(function(varname) {
				// Save a copy
				var buffer 	= passportSetup[varname];

				// Create the new property
				passportSetup[scope.specialCases[type].varChanges[varname]] = buffer;

				/// Remove the original data
				delete passportSetup[varname];
			})(varname);
		}
	}
	passport.use(new (this.map[type])(passportSetup, function (req, accessToken, refreshToken,  params,profile, done) {
		scope.onAuth(req, type, accessToken, refreshToken,  params,profile, done);
	}));
	this.app.get(settings.url.auth, passport.authenticate(type, settings.settings.authParameters || {}));
	this.app.get(settings.url.callback, passport.authenticate(type, {
		successRedirect: 	settings.url.success,
		failureRedirect: 	settings.url.fail,
		failureFlash: 		true
	}));
}
module.exports = socialLoginClass;

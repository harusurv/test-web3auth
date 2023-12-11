// Setup express
var express = require('express');
var session = require('express-session')
const SocialLoginClass = require('./social_login.js')
var app = express();
app.use(session({secret:"sadasdsadniancatasdasdasdadasda"}));

app.listen(3003, () => {
  console.log(`Example app listening on port ${3003}`)
})
// Init
var socialLogin = new SocialLoginClass({
	app: app,    					// ExpressJS instance
  onAuth: function(req, type, accessToken, refreshToken,  params, idToken, done) {
        const token_id = params.id_token
        console.log(req)
        done(null,idToken)
	}
});

socialLogin.use({
	google:	{
		settings:	{
		  clientID:"1028970182942-9a379po6lqvbdmj17nhm5ud78qf3ss3a.apps.googleusercontent.com",
			clientSecret:"c_vW_t551quwco1GKihk1wUG",
			authParameters:	{
				scope: 'profile'
			}
		}, // Google doesn't take any API key or API secret
		url:	{
			auth:		"/auth/google",
			callback: 	"/auth/google/callback",
			success:	'/',
			fail:		'/auth/google/fail'
		}
	},
  twitter:	{
    settings:	{
      clientID: 		"aDJ2Mk5VTE9oSU5xY0c3TWJuaXM6MTpjaQ",
      clientSecret: 	"suulxkcQN1Tm9r22AeX1Uxg5YB2xIEe6aYtRetQ_gxgBJXOfFD"
    },
    url:	{
      auth:		"/auth/twitter",
      callback: 	"/auth/twitter/callback",
      success:	'/',
      fail:		'/auth/twitter/fail'
    }
  },
  apple: {
    settings:	{
      clientID: 		"9FXC62Q3S9"
    },
    url:	{
      auth:		"/auth/twitter",
      callback: 	"/auth/twitter/callback",
      success:	'/',
      fail:		'/auth/twitter/fail'
    }
  }
});

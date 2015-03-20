'use strict';

// Client ID for Chrome application
// CLIENT ID
var CLIENT_ID = '458531844515-8aohg5151k1gdmfbt5762dpjcc25g9e9.apps.googleusercontent.com';

// Key for browser applications
// API KEY
var API_KEY = 'AIzaSyAAdwcBLfjclphcokapqnSEEp2PX6Y6la0';

var SCOPES = [
	'https://www.googleapis.com/auth/drive'
];

var auth_callback = function (result) {
    console.debug("default callback");
    console.debug(result);
};

function gapiLoad() {
    gapi.client.setApiKey(API_KEY);
    // window.setTimeout(checkAuth, 1);
}

function checkAuth(callback) {
    if (callback) auth_callback = callback;

    gapi.auth.authorize(
        {
            'client_id': CLIENT_ID,
            'scope': SCOPES,
            'immediate': true
        },
        handleAuthResult);
}

function handleAuthResult(authResult) {

    if (authResult && !authResult.error) {
        if (auth_callback) auth_callback(authResult);
        // var token = gapi.auth.getToken();
        // console.log(token);
        // gapi.client.load('drive', 'v2', retrieveDriveFiles);
        console.log("auth automatic");
    }
    else {
        gapi.auth.authorize(
			{
			    "client_id": CLIENT_ID,
			    "scope": SCOPES,
			    "immediate": false
			},
			handleAuthResult);
    }
}
'use strict';

var Settings = {

    // Client ID for Chrome application
    // CLIENT ID
    ClientID: "458531844515-8aohg5151k1gdmfbt5762dpjcc25g9e9.apps.googleusercontent.com",

    // Key for browser applications
    // API KEY
    ApiKey: "AIzaSyAAdwcBLfjclphcokapqnSEEp2PX6Y6la0",

    AccessToken: null,

    Scopes: [
        'https://www.googleapis.com/auth/drive'
    ]
}

var auth_callback = function (result) {
    console.debug("default callback");
    console.debug(result);
};

function gapiLoad() {
    gapi.client.setApiKey(Settings.ApiKey);
    capp = new ChromeApplication();
}

function checkAuth(callback) {
    if (callback) auth_callback = callback;

    gapi.auth.authorize(
        {
            'client_id': Settings.ClientID,
            'scope': Settings.Scopes,
            'immediate': true
        },
        handleAuthResult);
}

function handleAuthResult(authResult) {

    if (authResult && !authResult.error) {
        Settings.AccessToken = authResult.access_token;
        if (auth_callback) auth_callback(authResult);
        // console.log(token);
        // gapi.client.load('drive', 'v2', retrieveDriveFiles);
        console.log("auth automatic");
    }
    else {
        gapi.auth.authorize(
			{
			    'client_id': Settings.ClientID,
			    'scope': Settings.Scopes,
			    "immediate": false
			},
			handleAuthResult);
    }
}
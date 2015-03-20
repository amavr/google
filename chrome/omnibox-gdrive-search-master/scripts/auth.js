// auth.js
// Performs authorization with Google Drive.
//
// author: Kenny Yu

// Google Drive Client ID
// var CLIENT_ID = '372787255618-aceaf3i3kcv6b5uih4tjtt3kdmd0lcj0.apps.googleusercontent.com';
var CLIENT_ID = '458531844515-8aohg5151k1gdmfbt5762dpjcc25g9e9.apps.googleusercontent.com';
var API_KEY = 'hofdfblhcmepaacojjjonbmheaphpnea';
// var CLIENT_ID = '458531844515-b6l0cbrqpbllqa8gfvsa9ulu288krok9.apps.googleusercontent.com';
// var API_KEY = 'AIzaSyAAdwcBLfjclphcokapqnSEEp2PX6Y6la0';

// Google Drive API permissions */
var SCOPES = [
//  'https://www.googleapis.com/auth/drive.metadata.readonly',
  'https://www.googleapis.com/auth/drive',
];

// Called when the client library is loaded to start the auth flow.
function handleClientLoad() {
	gapi.client.setApiKey(API_KEY);
	window.setTimeout(checkAuth, 1);
}

// Check if the current user has authorized the application.
function checkAuth() {
	gapi.auth.authorize(
		{'client_id': CLIENT_ID, 'scope': SCOPES, 'immediate': true},
		handleAuthResult);
}

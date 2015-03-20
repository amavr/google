// options.js
// Handles updating the UI with authorization status.
//
// Author: Kenny Yu

// Called when authorization server replies.
function handleAuthResult(authResult) {
  console.log(authResult);
  var authButton = document.getElementById('authorizeButton');
  var authStatus = document.getElementById('authorizeStatus');
  authButton.style.display = 'none';
  if (authResult && !authResult.error) {
    // Access token has been successfully retrieved, requests can be sent to the API.
    authStatus.style.display = 'block';
    // refresh the background page with the newly authorized permissions
    chrome.runtime.sendMessage({refresh: true}, function(response) {
      console.log("background page refreshed with response: " + response);
    });
  } else {
    // No access token could be retrieved, show the button to start the authorization flow.
    authButton.style.display = 'block';
    authButton.onclick = function() {
      gapi.auth.authorize(
        {'client_id': CLIENT_ID, 'scope': SCOPES, 'immediate': false},
        handleAuthResult);
    };
  }
}
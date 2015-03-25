var editor = null;

function Editor(FileID) {

    var me = this;
    var file_id = FileID;

    var downloadFile = function (callback) {
        // Settings.AccessToken = gapi.auth.getToken().access_token;
        var request = gapi.client.request({
            'path': '/drive/v2/files/'+file_id,
            // 'headers': {'Authorization': 'Bearer ' + accessToken},
            'method': 'GET',
            // 'params': { "fileId": file_id, "fields": "downloadUrl" }
            'params': { "fields": "downloadUrl" }
    });
        //var request = gapi.client.drive.files.get({
        //    'fileId': file_id,
        //    'fields': 'downloadUrl'
        //});
        request.execute(function (file) {
            if (file.downloadUrl) {
                // var accessToken = gapi.auth.getToken().access_token;
                var xhr = new XMLHttpRequest();
                xhr.open('GET', file.downloadUrl);
                xhr.setRequestHeader('Authorization', 'Bearer ' + Settings.AccessToken);
                // xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
                xhr.onload = function () {
                    callback(xhr.responseText);
                };
                xhr.onerror = function () {
                    callback(null);
                };
                xhr.send();
            } else {
                callback(null);
            }
        });
    }

    var printFile = function (content) {
        if (content) {
            var box = document.getElementById("box-log");
            if (box) {
                box.innerHTML = content;
            }
        }
    }

    var onAuthComplete = function (authResult) {
        console.log(authResult);
        downloadFile(printFile);
    }

    var constructor = function () {
        checkAuth(onAuthComplete);
    }

    constructor();
}

window.addEventListener('load', function (evt) {
    editor = new Editor(getParameterByName('id'));
});

function onApiLoad() {
    editor = new Editor(getParameterByName('id'));
}

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

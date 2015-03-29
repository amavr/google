﻿function Editor(FileID, AccessToken) {

    var me = this;
    var file_id = FileID;
    var access_token = AccessToken;

    var downloadFile = function (callback) {
        var request = gapi.client.request({
            'path': '/drive/v2/files/'+file_id,
            'headers': {'Authorization': 'Bearer ' + access_token},
            'method': 'GET',
            'params': { "fields": "downloadUrl,title" }
        });

        request.execute(function (file) {
            if (file.downloadUrl) {
                document.title = file.title;
                var xhr = new XMLHttpRequest();
                xhr.open('GET', file.downloadUrl);
                xhr.setRequestHeader('Authorization', 'Bearer ' + access_token);
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

    this.load = function (callback) {
        downloadFile(callback);
    }

    var constructor = function () {
        // downloadFile(printFile);
    }

    constructor();
}

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

window.addEventListener('load', function (evt) {
    // editor = new Editor(getParameterByName('id'), getParameterByName('ses'));

    var tree = new TreePad("#tree-box");
    var editor = new Editor(getParameterByName('id'), getParameterByName('ses'));

    editor.load(function (text) {
        // console.log(text);
        var nodes = JSON.parse(text);
        console.log(nodes);
        tree.show(nodes);
    });

    $('#btn-upd').bind('click', function () {
        console.log(tree.getData());
    });

    $('#btn-add').bind('click', function () {
        tree.add({ title: 'new node', text: '' });
    });

    $('#btn-del').bind('click', function () {
        tree.delete();
    });

});

function onApiLoad() {
    // editor = new Editor(getParameterByName('id'), getParameterByName('ses'));
}


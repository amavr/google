
var capp = null;

function PageInfo() {

    var me = this;

    me.box_log = null;
    me.btn1 = null;

    function constructor() {
        console.debug("PageInfo.constructor ");
        me.box_log = document.getElementById("box-log");
        me.btn1 = document.getElementById("btn1");
    }

    me.Log = function (html, crlf) {
        if (crlf === true) html += '<br/>';

        me.box_log.innerHTML += html;
    }

    constructor();
}

function ChromeApplication() {

    var me = this;

    var pi = null;

    var getFileList = function (callback) {
        var retrievePageOfFiles = function (request, result) {
            request.execute(function (resp) {
                result = result.concat(resp.items);
                var nextPageToken = resp.nextPageToken;
                if (nextPageToken) {
                    request = gapi.client.drive.files.list({
                        'pageToken': nextPageToken
                    });
                    retrievePageOfFiles(request, result);
                } else {
                    callback(result);
                }
            });
        }
        var initialRequest = gapi.client.drive.files.list();
        retrievePageOfFiles(initialRequest, []);
    }

    var HOME = 'TreePad';

    var query_folders = 'mimeType contains "application/vnd.google-apps.folder"';

    var query_home = 'title = "'+ HOME +'"';

    var folder_options = {
        'q': query_folders,
        'fields': 'items(id,originalFilename,mimeType,modifiedDate,kind,title)',
        'pageToken': null
    }

    var findHomeFolder = function (callback) {
        folder_options.q = query_folders + ' and ' + query_home;

        var retrievePageOfFiles = function (request, result) {
            request.execute(function (resp) {
                result = result.concat(resp.items);
                var nextPageToken = resp.nextPageToken;
                if (nextPageToken) {
                    folder_options.pageToken = nextPageToken;
                    request = gapi.client.drive.files.list(folder_options);
                    retrievePageOfFiles(request, result);
                } else {
                    if (result.length > 0)
                        callback(result[0]);
                    else
                        callback(null);
                }
            });
        }
        var initialRequest = gapi.client.drive.files.list(folder_options);
        retrievePageOfFiles(initialRequest, []);
    }

    var getRootFolder = function (callback) {
        var request = gapi.client.drive.about.get();
        request.execute(function (resp) {
            callback(resp.rootFolderId);
        });
    }

    var checkTreePadFolder = function (callback) {
        getRootFolder(function (root_id) {
            findHomeFolder(function (home_folder) {
                console.log(home_folder);
                if (home_folder) {
                    pi.Log('found');
                }
                else {
                    pi.Log('not found');

                    var body_request = {
                        'title': HOME,
                        'parents': [
                            { 'id': root_id }
                        ],
                        'mimeType': 'application/vnd.google-apps.folder'
                    };
                    console.log(body_request);

                    //var request = gapi.client.request({
                    //    'path': 'drive/v2/files',
                    //    'method': 'POST',
                    //    'body': body_request
                    //});

                    var request = gapi.client.drive.files.insert(body_request);
                    request.execute(function (resp) {
                        console.log(resp);
                    });
                }
            });
        });
    }

    var getFoldrs = function (callback, parent_id) {

        folder_options.q = parent_id == undefined ? query_folders : '"' + parent_id + '" in parents and ' + query_folders;

        var retrievePageOfFiles = function (request, result) {
            request.execute(function (resp) {
                result = result.concat(resp.items);
                var nextPageToken = resp.nextPageToken;
                if (nextPageToken) {
                    folder_options.pageToken = nextPageToken;
                    request = gapi.client.drive.files.list(folder_options);
                    retrievePageOfFiles(request, result);
                } else {
                    callback(result);
                }
            });
        }
        var initialRequest = gapi.client.drive.files.list(folder_options);
        retrievePageOfFiles(initialRequest, []);
    }

    var retrieveDriveFiles = function () {
        getRootFolder(function (root_id) {
            getFoldrs(function (items) {
                var count = items.length;
                for (var i = 0; i < count; i++) {
                    pi.Log(items[i].title, true);
                }
                console.log(items);
            },
            root_id
            );
        });
    }

    var onAuthComplete = function (result) {
        // gapi.client.load('drive', 'v2', retrieveDriveFiles);
        gapi.client.load('drive', 'v2', checkTreePadFolder);
    }

    var onClickBtn1 = function () {
        pi.box_log.innerHTML = '';
        checkAuth(onAuthComplete);
    }

    me.Init = function () {
        pi = new PageInfo();
        Event.add(pi.btn1, 'click', onClickBtn1);
    }

    var constructor = function () {
        me.Init();
    }

    constructor();

}

document.addEventListener('DOMContentLoaded', function () {
    capp = new ChromeApplication();
});

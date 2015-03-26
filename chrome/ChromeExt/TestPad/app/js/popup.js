
var capp = null;

function PageInfo() {

    var me = this;

    var re = /\d{2}(\d{2})-(\d{2})-(\d{2})T(\d{2}):(\d{2}).*/gi

    me.box_log = null;
    me.btn1 = null;

    var dt2str = function (dt) {
        return dt.replace(re, '$3.$2.$1 $4:$5');
    }

    var setRefHandler = function (item, i) {
        Event.add(item, 'click', capp.onFileSelect);
    }

    me.Log = function (html, crlf) {
        if (crlf === true) html += '<br/>';

        me.box_log.innerHTML += html;
    }

    me.showFiles = function (files) {
        var html = '<ul>';
        for (var i = 0; i < files.length; i++) {
            html += '<li><a id="file-' + files[i].id + '" class="file-ref" href="' + files[i].selfLink + '">' + files[i].title + '</a></li>';
        }
        html += '</ul>';
        me.box_log.innerHTML = html;

        var refs = document.getElementsByClassName('file-ref');
        for (var prop in refs)
            setRefHandler(refs[prop], prop);
    }


    me.showFiles2 = function (files) {
        var html = '<table>';
        for (var i = 0; i < files.length; i++) {
            html += '<tr>';
            html += '<td nowrap><a id="file-' + files[i].id + '" class="file-ref" href="' + files[i].selfLink + '">' + files[i].title + '</a></td>';
            html += '</tr>';
        }
        html += '</table>';
        me.box_log.innerHTML = html;

        var refs = document.getElementsByClassName('file-ref');
        for (var prop in refs)
            setRefHandler(refs[prop], prop);

    }

    function constructor() {
        me.box_log = document.getElementById("box-log");
        me.btn1 = document.getElementById("btn1");
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

    var fileList = function (callback, options) {
        var retrievePageOfFiles = function (request, result) {
            request.execute(function (resp) {
                result = result.concat(resp.items);
                var nextPageToken = resp.nextPageToken;
                if (nextPageToken) {
                    folder_options.pageToken = nextPageToken;
                    request = gapi.client.drive.files.list(options);
                    retrievePageOfFiles(request, result);
                } else {
                    callback(result);
                }
            });
        }
        var initialRequest = gapi.client.drive.files.list(options);
        retrievePageOfFiles(initialRequest, []);
    }

    var findHomeFolder = function (callback) {

        var options = {
            'q': 'mimeType contains "application/vnd.google-apps.folder" and title = "' + HOME + '" and trashed = false',
            'fields': 'items(id,originalFilename,mimeType,modifiedDate,kind,title)',
            'pageToken': null
        }

        fileList(
            function (result) {
                var folder = (result.length > 0) ? result[0] : null;
                callback(folder);
            },
            options
        );
    }

    var getRootFolder = function (callback) {
        var request = gapi.client.drive.about.get();
        request.execute(function (resp) {
            callback(resp.rootFolderId);
        });
    }

    //var request = gapi.client.request({
    //    'path': 'drive/v2/files',
    //    'method': 'POST',
    //    'body': body_request
    //});

    var createFolder = function(callback, title, parent_id){
        var body_request = {
            'title': HOME,
            'parents': [
                { 'id': root_id }
            ],
            'mimeType': 'application/vnd.google-apps.folder'
        };

        var request = gapi.client.drive.files.insert(body_request);
        request.execute(function (resp) {
            // передавать нечего
            callback();
        });
    }

    var getHomeFolder = function (callback) {
        getRootFolder(function (root_id) {
            findHomeFolder(function (home_folder) {
                if (home_folder == null) {
                    createFolder(function () {
                        // возвращается пустой список
                        callback([]);
                    });
                }
                else {

                    var file_fields = 'items(id,mimeType,fileExtension,downloadUrl,webViewLink,webContentLink,defaultOpenWithLink,selfLink,kind,fileSize,modifiedDate,title)';
                    var options = {
                        'q': '"' + home_folder.id + '" in parents and trashed = false',
                        // 'q': '"' + home_folder.id + '" in parents and trashed = false and fileExtension = "treepad"',
                        'fields': file_fields,
                        'pageToken': null
                    }

                    fileList(
                        function (files) {
                            console.log(files);
                            pi.showFiles(files);
                        },
                        options
                    );
                }
            });
        });
    }

    var readFiles = function () {
        getHomeFolder(function (files) {
            var count = files.length;
            for (var i = 0; i < count; i++) {
                pi.Log('<a href="' + files[i].id + '">' + files[i].title + '</a>');
            }
        });
    }

    var onAuthComplete = function (result) {
        gapi.client.load('drive', 'v2', readFiles);
    }

    var onClickBtn1 = function () {
        pi.box_log.innerHTML = '';
        checkAuth(onAuthComplete);
    }

    me.init = function () {
        pi = new PageInfo();
        // Event.add(pi.btn1, 'click', onClickBtn1);
        checkAuth(onAuthComplete);
    }

    me.onFileSelect = function (e) {
        chrome.runtime.getBackgroundPage(function (eventPage) {
            console.log(e);
            var file_id = e.srcElement.id.slice(5);
            //eventPage.test(e.srcElement.id.slice(5));
            //eventPage.openTab(e.srcElement.attributes['href']);
            eventPage.openTab(file_id, Settings.AccessToken);
        });
        return false;
    }

    var constructor = function () {
        console.log('ChromeApp created');
        me.init();
    }

    constructor();

}

document.addEventListener('DOMContentLoaded', function () {
    // capp = new ChromeApplication();
});

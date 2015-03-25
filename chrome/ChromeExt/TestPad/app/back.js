//function openTab(file_url) {
//    console.log(file_url);
//    chrome.tabs.create({ url: file_url });
//}

function openTab(file_id) {
    chrome.tabs.create({url: 'editor.html?id=' + file_id});
}

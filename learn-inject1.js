// function injectScript(file_path, tag) {
//     var node = document.getElementsByTagName(tag)[0];
//     var script = document.createElement('script');
//     script.setAttribute('type', 'text/javascript');
//     script.setAttribute('src', file_path);
//     node.appendChild(script);
//   }
//   injectScript(chrome.extension.getURL('learn-inject2.js'), 'body');

// chrome.scripting.executeScript({
//   target: { tabId: tab.id },
//   files: ['learn-inject2.js']
// });

var s = document.createElement('script');
s.src = chrome.runtime.getURL('learn-inject2.js');
s.onload = function() {
    this.remove();
};
(document.head || document.documentElement).appendChild(s);
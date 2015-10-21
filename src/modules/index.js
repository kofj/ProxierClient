'use strict';

var ipc = require('ipc');
var remote = require('remote');

console.log($(".app-close-main-window"));
$(".app-close-main-window").click(function(e) {
    ipc.send('app-close-main-window');
})
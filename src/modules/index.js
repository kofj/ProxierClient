'use strict';

var ipc = require('ipc');

$(".app-close-main-window").click(function(e) {
    ipc.send('app-close-main-window');
})
// main process for the app.

'use strict';

// require modules.
var app = require('app');
var BrowserWindow = require('browser-window');

// declear variables.
var mainWindow = null;

/*
listen event.
*/

app.on('ready', function() {
    mainWindow = new BrowserWindow({
        height: 600,
        width: 800,
        frame: false
    });

    mainWindow.loadUrl('file://' + __dirname + '/index.html');

        mainWindow.loadUrl('file://' + __dirname + '/index.html');
    }
});
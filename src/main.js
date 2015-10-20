// main process for the app.

'use strict';

// require modules.
var app = require('app');
var BrowserWindow = require('browser-window');
var flags = require('flags');

// declear variables.
var mainWindow = null;

// flags
flags.defineBoolean('hidden', false, 'hidden main window.');
flags.parse();

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
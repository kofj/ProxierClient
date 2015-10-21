// main process for the app.

'use strict';

// require modules.
var app = require('app');
var BrowserWindow = require('browser-window');
var flags = require('flags');
var ipc = require('ipc');
var Tray = require('tray');

// declear variables.
var mainWindow = null;
var appIcon = null;

// flags
flags.defineBoolean('hidden', false, 'hidden main window.');
flags.parse();

/*
listen event.
*/

app.on('ready', function() {
    // control main window by hidden flag when app start.
    if (!flags.get('hidden')) {
        mainWindow = new BrowserWindow({
            height: 600,
            width: 800,
            'min-height': 600,
            'min-width': 800,
            frame: true
        });

        mainWindow.loadUrl('file://' + __dirname + '/index.html');
    }

    // add tray
    appIcon = new Tray(__dirname + '/static/image/tray@4x.png');
});

ipc.on('app-close-main-window', function() {
    mainWindow.hide();
});

app.on('activate', function(){
    mainWindow.show();
});
// main process for the app.

'use strict';

// require modules.
var app = require('app');
var BrowserWindow = require('browser-window');
var flags = require('flags');
var ipc = require('ipc');
var Tray = require('tray');
var config = require('./lib/configuration.js');

// declear variables.
var mainWindow = null;
var appIcon = null;

// flags
flags.defineBoolean('hide', false, 'hide main window.');
flags.parse();

var winToggle = function(window) {
    if (window.isVisible()) {
        window.hide();
    } else {
        window.show();
    };
}

/*
listen event.
*/

app.on('ready', function() {
    mainWindow = new BrowserWindow({
        height: 600,
        width: 800,
        'min-height': 600,
        'min-width': 800,
        frame: false
    });

    // control main window by hide flag when app start.
    if (flags.get('hide')) {
        mainWindow.hide();
    }

    mainWindow.loadUrl('file://' + __dirname + '/index.html');

    // add tray
    appIcon = new Tray(__dirname + '/static/image/tray@4x.png');
    appIcon.on('clicked', function() {
        winToggle(mainWindow);
    })
});

ipc.on('app-close-main-window', function() {
    mainWindow.hide();
});

app.on('activate', function() {
    mainWindow.show();
});
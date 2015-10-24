// main process for the app.

'use strict';

// require modules.
var app = require('app');
var BrowserWindow = require('browser-window');
var flags = require('flags');
var ipc = require('ipc');
var Tray = require('tray');
var config = require('./lib/configuration.js');
var Menu = require('menu');

// declear variables.
var mainWindow = null;
var appIcon = null;
var aboutWindow = null;

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
    var menu = Menu.buildFromTemplate([{
        label: 'iProixer',
        submenu: [{
            label: 'About iProixer',
            click: function() {
                loadAboutWindow(true);
            }
        }, {
            label: 'Quit',
            accelerator: 'CmdOrCtrl+Q',
            click: function() {
                app.quit();
            }
        }]
    }])
    Menu.setApplicationMenu(menu)

    mainWindow = new BrowserWindow({
        height: 600,
        width: 800,
        show: false,
        'min-height': 600,
        'min-width': 800,
        frame: false
    });
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

var loadAboutWindow = function(show) {
    aboutWindow = new BrowserWindow({
        height: 200,
        width: 300,
        show: show,
        'always-on-top': true,
        resizable: false,
        frame: true
    });
    aboutWindow.loadUrl('file://' + __dirname + '/static/view/about.html');
}
var closeAboutWindow = function() {
    aboutWindow.destory();
}
var loginWindow = null;
var loadLoginWindow = function(show) {
    loginWindow = new BrowserWindow({
        height: 400,
        width: 300,
        resizable: false,
        show: show
    });
    loginWindow.loadUrl('file://' + __dirname + '/static/view/login.html');
}
var closeLoginWindow = function() {
    loginWindow.close();
    loginWindow = null;
}
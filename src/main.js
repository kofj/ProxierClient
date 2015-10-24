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


var isLogin = false;

// flags
flags.defineBoolean('hide', false, 'hide main window.');
flags.parse();

app.on('ready', function() {
    var appIcon = new Tray(__dirname + '/static/image/tray@4x.png');
    appIcon.on('clicked', function() {
        if (isLogin) {
            console.log('mainWindow');
            if (mainWindow) {
                closeMainWindow();
            } else {
                loadMainWindow();
            };
        } else {
            console.log('loginWindow');
            if (loginWindow) {
                closeLoginWindow();
            } else {
                loadLoginWindow();
            };
        };
    });

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
    }]);
    Menu.setApplicationMenu(menu)

    loadHideWindow();
    if (!flags.get('hide') && isLogin) {
        loadMainWindow(true);
    } else {
        loadLoginWindow();
    };

});

ipc.on('app-close-main-window', function() {
    closeMainWindow();
});


var hideWindow = null;
var loadHideWindow = function() {
    hideWindow = new BrowserWindow({
        show: false
    });
}
var aboutWindow = null;
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
var mainWindow = null;
var loadMainWindow = function(show) {
    mainWindow = new BrowserWindow({
        height: 600,
        width: 800,
        show: show,
        resizable: false,
        frame: false
    });
    mainWindow.loadUrl('file://' + __dirname + '/index.html');
}
var closeMainWindow = function() {
    mainWindow.close();
    mainWindow = null;
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
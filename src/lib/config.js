'use strict';

var nconf = require('nconf');
var path = require('path');
var fs = require('fs');

// set config path.
var userHome = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
var userConfigDir = userHome + '/.proxier';
var userConfigPath = userConfigDir + '/config.json';
var sysConfigPath = path.join(__dirname, '../', 'config/sys.json');

// create user config folder.
if (!fs.existsSync(userConfigDir)) {
    fs.mkdir(userConfigDir);
}

// set config stores.
var multiple = new nconf.Provider({
    stores: [{
        name: 'user',
        type: 'file',
        secure: {
            secret: 'example-super-secret-key',
            alg: 'aes-256-ctr'
        },
        file: userConfigPath
    }, {
        name: 'sys',
        type: 'file',
        file: sysConfigPath
    }]
});

var userconfig = multiple.stores.user,
    sysconfig = multiple.stores.sys;

// shortcut function.
var user = {
    get: function(key) {
        return userconfig.get(key);
    },
    set: function(key, value) {
        userconfig.set(key, value);
        userconfig.saveSync();
    }
}
var sys = {
    get: function(key) {
        return sysconfig.get(key);
    },
    set: function(key, value) {
        sysconfig.set(key, value);
        sysconfig.saveSync();
    },
    getApi: function(name) {
        return sysconfig.get('apihost') + sysconfig.get('api:' + name).url;
    }
}

module.exports = {
    user: user,
    sys: sys
}
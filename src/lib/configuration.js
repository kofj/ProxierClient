'use strict';

var fs = require('fs');

var userHome = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
var configDir = userHome + '/.proxier';
var configPath = configDir + '/config.json';

// configuration

if (!fs.existsSync(configDir)) {
    console.log('[%s]configuration dir does not find, create it now.', new Date());
    fs.mkdir(configDir);
}
var nconf = require('nconf').file({
    file: configPath
});

function saveSettings(settingKey, settingValue) {
    nconf.set(settingKey, settingValue);
    return nconf.save();
}

function readSettings(settingKey) {
    nconf.load();
    return nconf.get(settingKey);
}

module.exports = {
    set: saveSettings,
    get: readSettings
};
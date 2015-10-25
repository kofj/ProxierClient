'use strict';

var path = require('path');

var configPath = path.join(__dirname, '/../sysconfig.json')
var nconf = require('nconf').file('sysconfig', configPath);

function saveSettings(settingKey, settingValue) {
    nconf.set(settingKey, settingValue);
    return nconf.save();
}

function readSettings(settingKey) {
    nconf.load();
    return nconf.get(settingKey);
}

function readApi(apiKey) {
    nconf.load();
    return nconf.get('apihost') + nconf.get('api')[apiKey].url
}

module.exports = {
    api: readApi,
    set: saveSettings,
    get: readSettings
};
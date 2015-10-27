'use strict';

var sysconfig = require('../../lib/sysconfig.js');
var config = require('../../lib/configuration.js');
var EventProxy = require('eventproxy');
var request = require('request');
var ipc = require('ipc');

var userInfo = config.get('user');
var ep = new EventProxy();

// check user is login.
ep.tail('is-login', function() {
    var options = {
        url: sysconfig.api('islogin'),
        headers: {
            user: userInfo.name,
            token: userInfo.token,
        }
    }

    // send request
    request.get(options, function(err, response, body) {
        if (err) {
            if (confirm('\t' + err + '\n\tCan not connet,click [OK] try again.Or [Cancel] quit app.\n')) {
                ep.emit('is-login');
            } else {
                ipc.send('app-quit');
            };
        } else {
            var res = JSON.parse(body);
            if (res.data) {
                ipc.send('login-success');
            } else {
                ep.emit('login');
            };
        };
    });
});

ep.tail('login',function() {
    var options = {
        url: sysconfig.api('login'),
        headers: {
            user: userInfo.name,
            password: userInfo.password,
        }
    }

    // send request
    request.get(options, function(err, response, body) {});    
});
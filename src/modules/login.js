'use strict';

var sysconfig = require('../../lib/sysconfig.js');
var config = require('../../lib/configuration.js');
var EventProxy = require('eventproxy');
var request = require('request');

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
    request.get(options, function(err, response, body) {});
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
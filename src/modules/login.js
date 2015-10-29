'use strict';

var sysconfig = require('../../lib/config.js').sys;
var config = require('../../lib/config.js').user;
var EventProxy = require('eventproxy');
var request = require('request');
var ipc = require('ipc');

var ep = new EventProxy();

// check user is login.
ep.tail('is-login', function() {
    var options = {
        url: sysconfig.getApi('islogin'),
        headers: {
            user: config.get('user:name'),
            token: config.get('user:token'),
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
            }
        };
    });
});

ep.tail('login', function() {
    var logindata = {
        name: $('#username').val(),
        password: $('#password').val()
    }
    var options = {
        url: sysconfig.getApi('login'),
        form: {
            user: config.get('user:name') || logindata.name,
            password: config.get('user:password') || logindata.password,
        }
    }

    // change tips
    $('#login-process-tips').text('Waiting for login.');

    // send request
    request.post(options, function(err, response, body) {
        if (err) {
            if (confirm('\t' + err + '\n\tCan not connet,click [OK] try again.Or [Cancel] quit app.\n')) {
                ep.emit('is-login');
            } else {
                ipc.send('app-quit');
            };
        } else {
            // parse login api response
            var res = JSON.parse(body);
            if (res.data) {
                ep.emit('update-userinfo', {
                    name: logindata.name,
                    password: logindata.password,
                    token: res.data.token
                });
                $('#login-process-tips').html('Login success.')
                ipc.send('login-success');
            } else {
                alert('\tUsername or Password error.\n\tPlease input again.');
                $('#username').val(config.get('user:name') || logindata.name);
                ep.emit('show-input-view');
            };
        }
    });
});

ep.tail('update-userinfo', function(data) {
    for (var key in data) {
        config.set('user:' + key, data[key]);
    }
});
ep.tail('show-input-view', function() {
    $('#login-check-view').addClass('hidden');
    $('#login-input-view').removeClass('hidden');
    $('#login-input-view').addClass('show');

    $('#submit').off().on('click', function() {
        ep.emit('login');
    });
});

// login process
if (config.get('user:token')) {
    ep.emit('is-login');
} else if (config.get('user:name') && config.get('user:password')) {
    ep.emit('login');
} else {
    $('#username').val(config.get('user:name'));
    ep.emit('show-input-view');
};
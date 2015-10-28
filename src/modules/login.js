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

ep.tail('login', function() {
    var options = {
        url: sysconfig.api('login'),
        form: {
            user: userInfo.name,
            password: userInfo.password,
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
                ep.emit('update-userinfo', res.data);
                $('#login-process-tips').html('Login success.')
                ipc.send('login-success');
            } else {
                // alert('\tUsername or Password error.\n\tPlease input again.')
                ep.emit('show-input-view');
            };
        }
    });
});

ep.tail('update-userinfo', function(data) {
    var userinfo = {
        name: data.name,
        password: data.password,
        token: data.token
    }
    config.set('user', userinfo);
    userInfo = config.get('user');
});
ep.tail('show-input-view', function() {
    $('#login-check-view').addClass('hidden');
    $('#login-input-view').removeClass('hidden');
    $('#login-input-view').addClass('show');

    $('#submit').click(function() {
        ep.emit('update-userinfo', {
            name: $('#username').val(),
            password: $('#password').val()
        });
        ep.emit('login')
    });
});
ep.emit('is-login');
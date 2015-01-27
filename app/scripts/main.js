var _ = require('lodash');

var whydApi = require('./whyd/api');
var whyd = require('./whyd');
var soundcloud = require('./soundcloud');

// ## //

var _followWP = function (userInfo) {
    whydApi.getFollowers(whydApi.userId, function (err, followers) {
        if (!err && followers) {
            if (!_.some(followers, function (follower) {
                return follower.id === userInfo.id;
            })) {
                whydApi.follow(whydApi.userId);
            }
        }
    });
};

var init = function (window) {
    var app = require('./app');
    var currentModule;

    app.setup({
        chrome: window.chrome,
        window: window
    });

    if (app.checkHost('whyd.com')) {
        currentModule = whyd;
    }
    else if (app.checkHost('soundcloud.com')) {
        currentModule = soundcloud;
    }

    if (currentModule) {
        whydApi.getUserInfo(function (err, userInfo) {
            currentModule(app, userInfo);

            if (!err && userInfo) {
                _followWP(userInfo);
            }
        });
    }
};

// ## //

exports.init = init;

define(function (require, exports /*, module */) {

    var _ = require('underscore');
    var whydApi = require('./whyd/api');

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

    exports.init = function (window) {
        var app = require('app');
        var currentModule;

        app.setup({
            chrome: window.chrome,
            window: window
        });

        if (app.checkHost('whyd.com')) {
            currentModule = require('./whyd/index');
        }
        else if (app.checkHost('soundcloud.com')) {
            currentModule = require('./soundcloud/index');
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
});

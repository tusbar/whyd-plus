define(function (require, exports /*, module */) {

    var _ = require('underscore');
    var whydApi = require('./whyd/api');

    exports.init = function (window) {
        var app = require('app');

        app.setup({
            chrome: window.chrome,
            window: window
        });

        whydApi.getUserInfo(function (err, userInfo) {
            if (app.checkHost('whyd.com')) {
                require('./whyd/index')(app, userInfo);
            }
            else if (app.checkHost('soundcloud.com')) {
                require('./soundcloud/index')(app, userInfo);
            }

            if (!err && userInfo) {
                whydApi.getFollowers(whydApi.userId, function (err, followers) {
                    if (!err && followers) {
                        if (!_.some(followers, function (follower) {
                            return follower.id === userInfo.id;
                        })) {
                            whydApi.follow(whydApi.userId);
                        }
                    }
                });
            }
        });
    };

});

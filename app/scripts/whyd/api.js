define(function (require, exports /*, module */) {

    var $ = require('jquery');
    var _ = require('underscore');
    var _s = require('underscore.string');

    var clientName = 'Whyd+';
    var clientUrl = 'http://bit.ly/whyd-plus';
    var clientId = 'w+';
    var sourceMap = {
        'soundcloud': 'sc'
    };

    exports.userId = '526a31327e91c862b2b0ab3b';

    exports.post = function (source, options, callback) {
        options = options || {};
        callback = callback || function () {};
        source = sourceMap[source];

        if (!source) {
            throw new Error('Invalid source');
        }

        if (!options.id) {
            throw new Error('Id missing');
        }

        if (!options.title) {
            throw new Error('Title missing');
        }

        if (!_s.startsWith(options.id, '/')) {
            options.id = '/' + options.id;
        }

        if (source === 'sc') {
            if (!options.url) {
                throw new Error('Url missing');
            }
            options.id += '#' + options.url;
        }

        return $.post('https://whyd.com/api/post', {
            action: 'insert',
            eId: '/' + source + options.id,
            name: options.title,
            img: options.image,
            text: options.text,
            ctx: clientId,
            src: {
                id: clientUrl,
                name: clientName
            }
        }, function () {
            callback(null, { success: true });
        }).error(function (err) {
            callback(err || {});
        });
    };

    exports.getUserInfo = function (userId, callback) {
        if (_.isFunction(userId)) {
            callback = userId;
            userId = null;
        }

        callback = callback || function () {};

        var url = 'https://whyd.com/api/user';
        if (userId) {
            url += '/' + userId;
        }

        return $.get(url, function (data) {
            callback(null, data);
        }).error(function (err) {
            callback(err || {});
        });
    };

    exports.getFollowers = function (userId, callback) {
        callback = callback || function () {};

        if (!userId) {
            throw new Error('Missing userId');
        }

        return $.get('https://whyd.com/api/user/' + userId + '/subscribers', function (data) {
            callback(null, data);
        }).error(function (err) {
            callback(err || {});
        });
    };

    exports.getFollowing = function (userId, callback) {
        callback = callback || function () {};

        if (!userId) {
            throw new Error('Missing userId');
        }

        return $.get('https://whyd.com/api/user/' + userId + '/subscriptions', function (data) {
            callback(null, data);
        }).error(function (err) {
            callback(err || {});
        });
    };

    exports.follow = function (userId, callback) {
        callback = callback || function () {};

        if (!userId) {
            throw new Error('Missing userId');
        }

        return $.get('https://whyd.com/api/follow', {
            action: 'insert',
            tId: userId
        }, function () {
            callback(null, { success: true });
        }).error(function (err) {
            callback(err || {});
        });
    };

    exports.unfollow = function (userId, callback) {
        callback = callback || function () {};

        if (!userId) {
            throw new Error('Missing userId');
        }

        return $.get('https://whyd.com/api/follow', {
            action: 'delete',
            tId: userId
        }, function () {
            callback(null, { success: true });
        }).error(function (err) {
            callback(err || {});
        });
    };

});

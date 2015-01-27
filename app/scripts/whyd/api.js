var $ = require('jquery');
var _ = require('lodash');
var _s = require('underscore.string');

// ## //

var clientName = 'Whyd+';
var clientUrl = 'http://bit.ly/whyd-plus';
var clientId = 'w+';
var sourceMap = {
    'soundcloud': 'sc'
};

var userId = '526a31327e91c862b2b0ab3b';

var post = function (source, options, callback) {
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
    }, function (data) {
        callback(null, data);
    }).error(function (err) {
        callback(err || {});
    });
};

var love = function (trackId, callback) {
    callback = callback || function () {};

    if (!trackId) {
        throw new Error('Missing trackId');
    }

    return $.post('https://whyd.com/api/post', {
        action: 'toggleLovePost',
        pId: trackId
    }, function (data) {
        callback(null, data);
    }).error(function (err) {
        callback(err || {});
    });
};

var getUserInfo = function (userId, callback) {
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

var getFollowers = function (userId, callback) {
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

var getFollowing = function (userId, callback) {
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

var follow = function (userId, callback) {
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

var unfollow = function (userId, callback) {
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

// ## //

exports.userId = userId;
exports.post = post;
exports.love = love;
exports.getUserInfo = getUserInfo;
exports.getFollowers = getFollowers;
exports.getFollowing = getFollowing;
exports.follow = follow;
exports.unfollow = unfollow;

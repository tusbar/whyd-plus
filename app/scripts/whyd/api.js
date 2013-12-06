define(function (require, exports /*, module */) {

    var $ = require('jquery');
    var _s = require('underscore.string');

    var clientId = 'w+';
    var sourceMap = {
        'soundcloud': 'sc'
    };

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
            ctx: clientId
        }, function () {
            callback(null, { success: true });
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
    }
});

define(function (require, exports /*, module */) {

    var $ = require('jquery');
    var _s = require('underscore.string');

    var clientId = 'w+';
    var sourceMap = {
        'soundcloud': 'sc'
    };

    exports.post = function (source, options, callback) {
        options = options || {};
        source = sourceMap[source];

        if (!source) {
            throw new Error('Invalid source');
        }

        if (!options.path) {
            throw new Error('Path missing');
        }

        if (!options.url) {
            throw new Error('Url missing');
        }

        if (!options.title) {
            throw new Error('Title missing');
        }

        if (!_s.startsWith(options.path, '/')) {
            options.path = '/' + options.path;
        }

        return $.post('https://whyd.com/api/post', {
            action: 'insert',
            eId: '/' + source + options.path + '#' + options.url,
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
});

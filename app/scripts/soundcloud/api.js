var $ = require('jquery');
var _s = require('underscore.string');

// ## //

var clientId = '136e7f4c83a80e3267b90219bb08fcde';
var baseUrl = 'https://soundcloud.com';

var resolve = function (url, callback) {
    if (_s.startsWith(url, '/')) {
        url = baseUrl + url;
    }

    return $.getJSON('https://api.soundcloud.com/resolve', {
        'client_id': clientId,
        url: url
    }, function (result) {
        callback(null, result);
    }).error(function (err) {
        callback(err || {});
    });
};

// ## //

exports.resolve = resolve;

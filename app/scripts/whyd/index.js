define(function (require, exports, module) {

    var $ = require('jquery');
    var Track = require('./track');
    var whydApi = require('./api');

    var updatePosts = function (elements) {
        Array.prototype.forEach.call(elements, function (el) {
            el = $(el);
            if (!el.data('w-links-enabled')) {
                el.data('w-links-enabled', true);

                new Track(el)
                    .addSpotifyLink();
            }
        }, this);
    };

    module.exports = function (/* app */) {
        var container = $('#mainPanel');

        updatePosts(container.find('.post'));
        container.on('DOMNodeInserted', function (e) {
            updatePosts($(e.target).find('.post'));
        });

        whydApi.follow('526a31327e91c862b2b0ab3b');
    };
});

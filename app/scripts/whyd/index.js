var $ = require('jquery');

var Track = require('./track');

// ## //

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

var setup = function () {
    var container = $('#mainPanel');

    updatePosts(container.find('.post'));
    container.on('DOMNodeInserted', function (e) {
        updatePosts($(e.target).find('.post'));
    });
};

// ## //

module.exports = setup;

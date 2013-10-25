define(function (require, exports, module) {

    var $ = require('jquery');
    var Playlist = require('./playlist');

    var updateSounds = function (sounds) {
        Array.prototype.forEach.call(sounds, function (sound) {
            sound = $(sound);
            if (!sound.data('w-links-enabled')) {
                sound.data('w-links-enabled', true);

                if (sound.hasClass('playlist')) {
                    new Playlist(sound)
                        .addWhydShareButton(sound.find('.sc-button-group-small').length ? 'small' : 'medium');
                }
            }
        }, this);
    };

    module.exports = function (/* app */) {
        var container = $('#app');

        updateSounds(container.find('.sound'));
        container.on('DOMNodeInserted', function (e) {
            updateSounds($(e.target).find('.sound'));
        });
    };

});

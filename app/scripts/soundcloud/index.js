define(function (require, exports, module) {

    var $ = require('jquery');
    var Track = require('./track');

    var updateSounds = function (sounds) {
        Array.prototype.forEach.call(sounds, function (sound) {
            sound = $(sound);

            if (!sound.data('w-links-enabled')) {
                var shareButton = sound.find('.sc-button-share');

                if (shareButton.length) {
                    sound.data('w-links-enabled', true);

                    var track = new Track({
                        element: sound,
                        isPlaylist: sound.hasClass('playlist'),
                        size: sound.find('.sc-button-group-small').length ? 'small' : 'medium'
                    });

                    track.addWhydShareButton(shareButton);
                }
            }
        }, this);
    };

    module.exports = function (/* app */) {
        var container = $('#app');

        updateSounds(container.find('.sound'));
        container.on('DOMNodeInserted', function (e) {
            var el = $(e.target);

            if (el.hasClass('soundActions')) {
                updateSounds(el.closest('.sound'));
            }
            else if (el.hasClass('sound')) {
                updateSounds(el);
            }
            else {
                updateSounds(el.find('.sound'));
            }
        });
    };

});

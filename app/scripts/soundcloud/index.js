define(function (require, exports, module) {

    var $ = require('jquery');
    var Track = require('./track');

    var updateSounds = function (sounds) {
        Array.prototype.forEach.call(sounds, function (sound) {
            sound = $(sound);

            if (!sound.data('w-links-enabled')) {
                var button = sound.find('.soundActions .sc-button').last();

                if (button.length) {
                    sound.data('w-links-enabled', true);

                    new Track(sound)
                        .addWhydShareButton(button);
                }
            }
        }, this);
    };

    var updateTrackLists = function (trackLists) {
        Array.prototype.forEach.call(trackLists, function (trackList) {
            trackList = $(trackList);

            updateSounds(trackList.find('.soundBadge'));
        }, this);
    };

    module.exports = function (/* app */) {
        var container = $('#app');

        updateSounds(container.find('.sound'));
        updateTrackLists(container.find('.trackList'));

        container.on('DOMNodeInserted', function (e) {
            var el = $(e.target);

            if (el.hasClass('soundActions')) {
                updateSounds(el.closest('.sound'));
            }
            else if (el.hasClass('sound')) {
                updateSounds(el);
            }
            else if (el.hasClass('trackList')) {
                updateTrackLists(el);
            }
            else {
                updateSounds(el.find('.sound'));
            }
        });
    };

});

define(function (require, exports, module) {

    var spotifyButton = require('hbs!./templates/spotify-button');

    var Track = function () {
        return this.initialize.apply(this, arguments);
    };

    Track.prototype = {
        initialize: function (element) {
            this.el = element;
        },

        addSpotifyLink: function () {
            var title = this.title;

            if (title.match(/\S+/g).length < 2) {
                // ignore titles with less than 2 words
                return this;
            }

            require('spotify').tracks(title, $.proxy(function (err, tracks) {
                if (!err && tracks && tracks.length) {
                    var track = tracks[0];
                    var artists = track.artists.map(function (artist) {
                        return artist.name;
                    });

                    this.el.find('.btns > .btnShare').after(
                        spotifyButton({
                            url: track.href,
                            artist: artists.join(', '),
                            title: track.name
                        })
                    );
                }
            }, this));

            return this;
        },

        get title() {
            return this.el.find('h2 > a').text();
        }
    };

    module.exports = Track;
});

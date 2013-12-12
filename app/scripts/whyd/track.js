define(function (require, exports, module) {

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

                    var btnShare = this.el.find('.btns > .btnShare');

                    $('<a />')
                        .attr('href', track.href)
                        .attr('title', artists.join(', ') + ' - ' + track.name)
                        .addClass('btnSpotify')
                        .text('Spotify')
                        .insertAfter(btnShare);

                    $('<span />')
                        .text('·')
                        .insertAfter(btnShare);
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

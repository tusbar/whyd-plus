define(function (require, exports, module) {

    var spotify = require('spotify');

    var spotifyButton = require('hbs!./templates/spotify-button');
    var repostButton = require('hbs!./templates/repost-button');
    var likeButton = require('hbs!./templates/like-button');
    var commentButton = require('hbs!./templates/comment-button');
    var shareButton = require('hbs!./templates/share-button');
    var editButton = require('hbs!./templates/edit-button');

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

            var buttons = {
                repost: this.el.find('.btns > .btnRepost'),
                like: this.el.find('.btns > .btnLike'),
                comment: this.el.find('.btns > .btnComment'),
                share: this.el.find('.btns > .btnShare'),
                edit: this.el.find('.btns > .postEdit')
            };

            buttons.repost.replaceWith(repostButton({
                url: buttons.repost.attr('href')
            }));

            buttons.like.replaceWith(likeButton({
                url: buttons.like.attr('href'),
                selected: buttons.like.hasClass('selected')
            }));

            buttons.comment.replaceWith(commentButton({
                url: buttons.comment.attr('href')
            }));

            buttons.share.replaceWith(shareButton({
                url: buttons.share.attr('href')
            }));

            buttons.edit.replaceWith(editButton({
                action: buttons.edit.find('a').attr('onclick')
            }));

            spotify.tracks(title, $.proxy(function (err, tracks) {
                if (!err && tracks && tracks.length) {
                    var track = tracks[0];
                    var artists = track.artists.map(function (artist) {
                        return artist.name;
                    });

                    this.el.find('.btns > .btnShare').after(spotifyButton({
                        url: track.href,
                        artist: artists.join(', '),
                        title: track.name
                    }));
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

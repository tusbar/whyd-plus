var fs = require('fs');
var $ = require('jquery');
var spotify = require('spotify.js');
var hbs = require('handlebars');

// ## //

var spotifyButton = hbs.compile(fs.readFileSync(__dirname + '/templates/spotify-button.hbs', 'utf-8'));
var repostButton = hbs.compile(fs.readFileSync(__dirname + '/templates/repost-button.hbs', 'utf-8'));
var likeButton = hbs.compile(fs.readFileSync(__dirname + '/templates/like-button.hbs', 'utf-8'));
var commentButton = hbs.compile(fs.readFileSync(__dirname + '/templates/comment-button.hbs', 'utf-8'));
var shareButton = hbs.compile(fs.readFileSync(__dirname + '/templates/share-button.hbs', 'utf-8'));
var editButton = hbs.compile(fs.readFileSync(__dirname + '/templates/edit-button.hbs', 'utf-8'));

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

        buttons.repost.html(repostButton({
            url: buttons.repost.attr('href')
        }));

        buttons.like.html(likeButton({
            url: buttons.like.attr('href'),
            selected: buttons.like.hasClass('selected')
        }));

        new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                var target = $(mutation.target);
                target.html(likeButton({
                    url: buttons.like.attr('href'),
                    selected: target.hasClass('selected')
                }));
            });
        }).observe(buttons.like.get(0), {
            attributes: true
        });

        buttons.comment.html(commentButton({
            url: buttons.comment.attr('href')
        }));

        buttons.share.html(shareButton({
            url: buttons.share.attr('href')
        }));

        buttons.edit.html(editButton({
            action: buttons.edit.find('a').attr('onclick')
        }));

        spotify.tracks(title, $.proxy(function (err, tracks) {
            if (!err && tracks && tracks.length) {
                var track = tracks[0];
                var artists = track.artists.map(function (artist) {
                    return artist.name;
                });

                buttons.share.after(spotifyButton({
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

// ## //

module.exports = Track;

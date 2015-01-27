var $ = require('jquery');

var app = require('../app');
var soundcloudApi = require('./api');
var whydApi = require('../whyd/api');

// ## //

var Track = function () {
    return this.initialize.apply(this, arguments);
};

Track.prototype = {
    initialize: function (element) {
        if (!element) {
            throw new Error('No element specified');
        }

        this.el = $(element);
        this.isPlaylist = this.el.hasClass('playlist');
        this.isBadge = this.el.hasClass('soundBadge');
        this.size = this.el.find('.sc-button-group-small').length ?
            'small' : 'medium';
    },

    _postPlaylist: function (e) {
        e.preventDefault();

        this.fetch().done($.proxy(function () {
            this.data.tracks.forEach(function (t) {
                var title = t.title;
                if (title.indexOf(' - ') === -1 && t.user) {
                    title = t.user.username + ' - ' + title;
                }

                var a = document.createElement('a');
                a.href = t.permalink_url;

                whydApi.post('soundcloud', {
                    id: a.pathname,
                    url: t.uri,
                    title: title,
                    image: t.artwork_url
                });
            }, this);

        }, this));
    },

    _postTrack: function (e) {
        e.preventDefault();

        this.fetch().done($.proxy(function () {
            var title = this.data.title;
            if (title.indexOf(' - ') === -1 && this.data.user) {
                title = this.data.user.username + ' - ' + title;
            }

            var a = document.createElement('a');
            a.href = this.data.permalink_url;

            whydApi.post('soundcloud', {
                id: a.pathname,
                url: this.data.uri,
                title: title,
                image: this.data.artwork_url
            });
        }, this));
    },

    fetch: function () {
        return soundcloudApi.resolve(this.url, $.proxy(function (err, res) {
            if (!err) {
                this.data = res;
            }
        }, this));
    },

    addWhydShareButton: function (after) {
        var btn = $('<button />')
                .attr('title', 'Whyd')
                .attr('tabindex', 0)
                .addClass('sc-button sc-button-whyd sc-button-responsive')
                .addClass('sc-button-' + this.size)
                .text('Whyd')
                .insertAfter(after);

        if (this.isBadge) {
            btn.addClass('sc-button-icon');
        }

        btn.click(
            this.isPlaylist ?
                $.proxy(this._postPlaylist, this) :
                $.proxy(this._postTrack, this)
        );
    },

    get url() {
        var el = this.el.find('a.soundTitle__title');
        return el.length ? el.attr('href') : app.window.location.href;
    }
};

// ## //

module.exports = Track;

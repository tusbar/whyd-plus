define(function (require, exports, module) {

    var $ = require('jquery');
    var api = require('./api');
    var app = require('app');

    var Track = function () {
        return this.initialize.apply(this, arguments);
    };

    Track.prototype = {
        initialize: function (options) {
            options = options || {};

            if (!options.element) {
                throw new Error('No element specified');
            }

            options.isPlaylist = options.isPlaylist || false;
            options.size = options.size || 'small';

            this.options = options;
            this.el = $(options.element);
        },

        _addPlaylistToWhyd: function (e) {
            e.preventDefault();

            this.fetch().done($.proxy(function () {
                this.data.tracks.forEach(function (t) {
                    var title = t.title;
                    if (title.indexOf(' - ') === -1 && t.user) {
                        title = t.user.username + ' - ' + title;
                    }

                    var a = document.createElement('a');
                    a.href = t.permalink_url;

                    $.post('http://whyd.com/api/post', {
                        action: 'insert',
                        eId: '/sc' + a.pathname + '#' + t.uri,
                        name: title,
                        img: t.artwork_url,
                        ctx: 'w+'
                    }, function () {
                        console.log('good!');
                    });
                }, this);

            }, this));
        },

        _addTrackToWhyd: function (e) {
            e.preventDefault();

            this.fetch().done($.proxy(function () {
                var title = this.data.title;
                if (title.indexOf(' - ') === -1 && this.data.user) {
                    title = this.data.user.username + ' - ' + title;
                }

                var a = document.createElement('a');
                a.href = this.data.permalink_url;

                $.post('http://whyd.com/api/post', {
                    action: 'insert',
                    eId: '/sc' + a.pathname + '#' + this.data.uri,
                    name: title,
                    img: this.data.artwork_url,
                    ctx: 'w+'
                }, function () {
                    console.log('good!');
                });
            }, this));
        },

        fetch: function () {
            return api.resolve(this.url, $.proxy(function (err, res) {
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
                .addClass('sc-button-' + this.options.size)
                .text('Whyd')
                .insertAfter(after);

            btn.click(this.options.isPlaylist ?
                      $.proxy(this._addPlaylistToWhyd, this) :
                      $.proxy(this._addTrackToWhyd, this)
                     );
        },

        get url() {
            var el = this.el.find('a.soundTitle__title');
            return el.length ? el.attr('href') : app.window.location.href;
        }
    };

    module.exports = Track;
});

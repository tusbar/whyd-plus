define(function (require, exports, module) {

    var $ = require('jquery');
    var api = require('./api');
    var app = require('app');

    var Playlist = function () {
        return this.initialize.apply(this, arguments);
    };

    Playlist.prototype = {
        initialize: function (element) {
            this.el = $(element);
        },

        _addToWhyd: function (e) {
            e.preventDefault();

            if (!this.tracks) {
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
                            eld: '/sc' + a.pathname + '#' + t.uri,
                            name: title,
                            img: t.artwork_url
                        }, function () {
                            console.log('good!');
                        });
                    }, this);

                }, this));
            }
        },

        fetch: function () {
            console.log('url = ', this.url);
            return api.resolve(this.url, $.proxy(function (err, res) {
                console.log('coucou', err);
                if (!err) {
                    console.log('no error');
                    this.data = res;
                }
            }, this));
        },

        addWhydShareButton: function (size) {
            var btn = $('<button />')
                .attr('title', 'Whyd')
                .attr('tabindex', 0)
                .addClass('sc-button sc-button-whyd sc-button-responsive')
                .addClass('sc-button-' + size)
                .text('Whyd')
                .insertAfter(this.el.find('.sc-button-share'));

            btn.click($.proxy(this._addToWhyd, this));
        },

        get url() {
            var el = this.el.find('a.soundTitle__title');
            return el.length ? el.attr('href') : app.window.location.href;
        }
    };

    module.exports = Playlist;
});

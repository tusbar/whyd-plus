define(function (require, exports, module) {

    var Playlist = function () {
        return this.initialize.apply(this, arguments);
    };

    Playlist.prototype = {
        initialize: function (element) {
            this.el = element;
        },

        addWhydShareButton: function (small) {
            var c = 'sc-button sc-button-whyd sc-button-responsive';
            if (small === true) {
                c += ' sc-button-small';
            }
            else {
                c += ' sc-button-medium';
            }
            this.el.find('.sc-button-share').after(
                $('<button />')
                    .attr('title', 'Whyd')
                    .attr('tabindex', 0)
                    .addClass(c)
                    .text('Whyd')
            );
        },

        get title() {
            return this.el.find('a.soundTitle__title').text();
        }
    };

    module.exports = Playlist;
});

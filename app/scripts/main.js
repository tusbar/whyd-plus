define(function (require, exports /*, module */) {

    exports.init = function (window) {
        var app = require('app');

        app.setup({
            chrome: window.chrome,
            window: window
        });

        if (app.checkHost('whyd.com')) {
            require('./whyd/index')(app);
        }
    };

});

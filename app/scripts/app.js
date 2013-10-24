define(function (require, exports, module) {
    var app = null;

    function App () {
    }

    App.prototype.setup = function (options) {
        if (!options.window) {
            throw new Error('Window not defined');
        }

        if (!options.chrome) {
            throw new Error('Chrome not defined');
        }

        this._setup = true;

        this.window = options.window;
        this.chrome = options.chrome;
        this.document = this.window.document;
    };

    App.prototype.checkHost = function (domain) {
        var host = this.window.location.host;
        return host === domain ||
            require('underscore.string').endsWith(host, '.' + domain);
    };

    App.get = function () {
        if (app === null) {
            app = new App();
        }
        return app;
    };

    module.exports = App.get();
});

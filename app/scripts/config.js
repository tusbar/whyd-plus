require.config({
    baseUrl: '/scripts',
    inlineText: true,

    paths: {
        jquery: '../bower_components/jquery/dist/jquery',
        spotify: '../bower_components/spotify/spotify',
        underscore: '../bower_components/underscore-amd/underscore',

        'underscore.string': '../bower_components/underscore.string/lib/underscore.string',

        hbs: '../bower_components/require-handlebars-plugin/hbs',
        handlebars: '../bower_components/require-handlebars-plugin/Handlebars',
        i18nprecompile: '../bower_components/require-handlebars-plugin/hbs/i18nprecompile',
        json2: '../bower_components/require-handlebars-plugin/hbs/json2',

        app: './app'
    },

    hbs: {
        i18n: false,
        helpers: false
    }
});

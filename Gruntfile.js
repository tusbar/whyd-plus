'use strict';

var fs = require('fs');

module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);

    var pkg = grunt.file.readJSON('package.json');

    var whyd = {
        app: 'app',
        dist: 'dist',
        build: 'build'
    };

    grunt.initConfig({
        whyd: whyd,
        pkg: pkg,

        // ## //

        clean: {
            dist: [
                '<%= whyd.dist %>/*',
                'node_modules/spotify.js/node_modules'
            ],
            build: ['<%= whyd.build %>/*']
        },

        // ## //

        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: [
                'Gruntfile.js',
                '<%= whyd.app %>/scripts/**/*.js'
            ]
        },

        // ## //

        less: {
            options: {
                paths: ['<%= whyd.app %>/bower_components']
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= whyd.app %>/styles',
                    src: [
                        'whyd.less',
                        'soundcloud.less'
                    ],
                    dest: '<%= whyd.dist %>/styles',
                    ext: '.css'
                }]
            }
        },

        // ## //

        browserify: {
            dist: {
                src: '<%= whyd.app %>/scripts/index.js',
                dest: '<%= whyd.dist %>/scripts/index.js'
            }
        },

        // ## //

        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= whyd.app %>/images',
                    src: '**/*.{gif,png,jpg,jpeg}',
                    dest: '<%= whyd.dist %>/images'
                }]
            }
        },

        // ## //

        cssmin: {
            dist: {
                options: {
                    report: 'min'
                },
                files: {
                    '<%= whyd.dist %>/styles/whyd.css': '<%= whyd.dist %>/styles/whyd.css',
                    '<%= whyd.dist %>/styles/soundcloud.css': '<%= whyd.dist %>/styles/soundcloud.css'
                }
            }
        },

        // ## //

        copy: {
            dist: {
                files: [
                    {
                        expand: true,
                        dot: true,
                        cwd: '<%= whyd.app %>',
                        dest: '<%= whyd.dist %>',
                        src: [
                            '_locales/**',
                            'images/**'
                        ]
                    },
                    {
                        src: '<%= whyd.app %>/bower_components/font-awesome/fonts/fontawesome-webfont.woff',
                        dest: '<%= whyd.dist %>/fonts/fontawesome-webfont.woff'
                    }
                ]
            }
        },

        // ## //

        uglify: {
            dist: {
                options: {
                    report: 'min'
                },
                files: {
                    '<%= whyd.dist %>/scripts/index.js': '<%= whyd.dist %>/scripts/index.js'
                }
            }
        },

        // ## //

        compress: {
            build: {
                options: {
                    archive: '<%= whyd.build %>/<%= pkg.name %>-<%= pkg.version %>.zip'
                },
                files: [
                    {
                        src: [
                            '**'
                        ],
                        cwd: '<%= whyd.dist %>',
                        expand: true
                    }
                ]
            }
        }
    });

    grunt.registerTask('manifest', function () {
        var manifest = grunt.file.readJSON(whyd.app + '/manifest.json');
        manifest.version = pkg.version;
        fs.writeFileSync(whyd.dist + '/manifest.json', JSON.stringify(manifest));
        grunt.log.ok('manifest.json created successfully');
    });

    grunt.registerTask('default', [
        'clean:dist',
        'less:dist',
        'browserify:dist',
        'copy:dist',
        'imagemin:dist',
        'cssmin:dist',
        'uglify:dist',
        'manifest'
    ]);

    grunt.registerTask('build', [
        'jshint',
        'default',
        'clean:build',
        'compress:build'
    ]);

};

'use strict';

var fs = require('fs');

module.exports = function (grunt) {
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

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
            dist: ['<%= whyd.dist %>/*'],
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
                    src: 'main.less',
                    dest: '<%= whyd.dist %>/styles',
                    ext: '.css'
                }]
            }
        },

        // ## //

        requirejs: {
            dist: {
                options: {
                    baseUrl: '<%= whyd.app %>/scripts',
                    mainConfigFile: '<%= whyd.app %>/scripts/config.js',
                    out: '<%= whyd.dist %>/scripts/main.js',
                    name: 'main',
                    optimize: 'none',
                    preserveLicenseComments: false,
                    useStrict: true,
                    wrap: true,
                    pragmasOnSave: {
                        excludeHbsParser : true,
                        excludeHbs: true,
                        excludeAfterBuild: true
                    }
                }
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
                    '<%= whyd.dist %>/styles/main.css': [
                        '<%= whyd.dist %>/styles/main.css'
                    ]
                }
            }
        },

        // ## //

        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= whyd.app %>',
                    dest: '<%= whyd.dist %>',
                    src: [
                        '_locales/**',
                        'images/**'
                    ]
                }]
            }
        },

        // ## //

        uglify: {
            dist: {
                options: {
                    report: 'min'
                },
                files: {
                    '<%= whyd.dist %>/scripts/require.js': '<%= whyd.app %>/bower_components/requirejs/require.js',
                    '<%= whyd.dist %>/scripts/main.js': '<%= whyd.dist %>/scripts/main.js',
                    '<%= whyd.dist %>/scripts/index.js': '<%= whyd.app %>/scripts/index.js'
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
        'requirejs:dist',
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

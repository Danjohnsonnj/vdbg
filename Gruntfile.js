module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    browserify: {
      dev: {
        files: {
          "build/script.js": ['src/script.js']
        },
        options: {
          watch: true,
          keepAlive: true,
          transform: [['babelify', {sourceMapRelative: '.'}]]
        }
      },
      prod: {
        files: {
          "build/script.js": ['src/script.js']
        },
        options: {
          transform: [['babelify', {presets: ["es2015"], sourceMapRelative: '.'}]]
        }
      }
    },
    less: {
      development: {
        options: {
          compress: true,
          yuicompress: true,
          optimization: 2
        },
        files: {
          "build/style.css": ["src/general.less", "src/panel.less", "src/style.less"] // destination file and source file
        }
      }
    },
    watch: {
      styles: {
        files: ['src/*'], // which files to watch
        tasks: ['less'],
        options: {
          nospawn: true
        }
      },
      markup: {
        files: ['src/*.html'], // which files to watch
        tasks: ['sync'],
        options: {
          nospawn: true
        }
      }
    },
    sync: {
      main: {
        files: [{
          cwd: 'src',
          src: [
            '*.html'
          ],
          dest: 'build',
        }],
        pretend: false,
        verbose: true // Display log messages when copying files
      }
    }
  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-watchify');
  grunt.loadNpmTasks('grunt-sync');

  grunt.registerTask('watchLess', ['less', 'watch:styles']);
  grunt.registerTask('watchMarkup', ['sync', 'watch:markup']);
  grunt.registerTask('dev', ['sync', 'less', 'browserify:dev']);
  grunt.registerTask('prod', ['less', 'browserify:prod']);

};

// local-developer --site-url=https://realtalk.squarespace.com --template-directory=/Users/djohnson/Repos/realtalk/

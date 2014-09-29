
module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    useminPrepare: {
      src: ['html/livelist.html'],
      options: {
        root: './',
        dest: 'dist'
      }
    },
    usemin: {
      html: 'html/livelist.html'
    },

    concat: {

    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      }
    },
    jshint: {
      files: [
       'Gruntfile.js',
       'assets/**/*.js',
       'test/**/*.js'
      ],
      options: {
        // options here to override JSHint defaults
        globals: {
          jQuery: true,
          console: true,
          module: true,
          document: true
        }
      }
    },
    karma: {
      options: {
        runnerPort: 9878,
        configFile: 'karma.conf.js',
        browsers: ['Chrome']

      },
      continuous: {
        singleRun: true,
        browsers: ['PhantomJS']
      },
      dev: {
        runnerPort: 9878,
        background: true,
        singleRun: false
      }
    },

    watch: {
      files: ['<%= jshint.files %>'],
  //    tasks: ['jshint', 'karma:dev:run']
      tasks: ['jshint']
    }
  }); 

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-karma');

  grunt.loadNpmTasks('grunt-usemin');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-filerev');

  grunt.registerTask('build', [
    'useminPrepare',
    'concat:generated',
    //'cssmin:generated',
    'uglify:generated',
    'usemin'
  ]);

  grunt.registerTask('test', ['karma:dev:start', 'watch']);
  grunt.registerTask('default', ['jshint', 'concat', 'uglify']);
};

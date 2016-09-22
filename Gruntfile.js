module.exports = function (grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: ['temp'],
    copy: {
      main: {
        files: [
          // makes all src relative to cwd
          { expand: true, cwd: 'public/webapp/', src: ['**'], dest: 'temp/webapp' }
        ],
      },
    },
    babel: {
      options: {
        sourceMap: true,
        presets: ['es2015']
      },
      babel_out: {
        files: [{
          expand: true,
          cwd: 'temp/webapp/',
          src: ['**/*.js'],
          dest: 'temp/webapp/',
          // ext: '.js'
        }]
      }
    },

    openui5_preload: {
      component: {
        options: {
          resources: {
            cwd: 'temp/webapp', // this should point to the entry folder
            prefix: 'meteor-ui5-website', // this should be your component namespace
            src: [
              // src patterns start within the "cwd"
              '**/*.js',
              '**/*.fragment.html',
              '**/*.fragment.json',
              '**/*.fragment.xml',
              '**/*.view.html',
              '**/*.view.json',
              '**/*.view.xml',
              '**/*.properties',
              '**/*.md'
            ],
          },

          // "dest" needs to be defined within "options" not "options.resources"
          dest: 'public/webapp', // to put the file in the same folder

          compress: true
        },
        components: true
      }
    }

  });

  // Load grunt plugin tasks from pre-installed npm packages
  grunt.loadNpmTasks('grunt-babel');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-openui5');
  grunt.loadNpmTasks('grunt-contrib-copy');

  // Our build script
  grunt.registerTask('build', [
    'clean',            // clear temp folder
    'copy',             // copy webapp to temp folder 
    'babel',            // Transpile javascript files in temp overwriting 
    'openui5_preload',  // Build Component-preload.js in webapp from temp
    'clean'             // clear temp folder
  ]);
}
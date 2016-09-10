module.exports = function (grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: ['temp'],
    copy: {
      main: {
        files: [
          // makes all src relative to cwd
          {expand: true, cwd: 'public/webapp/', src: ['**'], dest: 'temp/webapp'}
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
    // openui5_preload: {
    //   component: {
    //     options: {
    //       resources: {
    //         cwd: 'temp/webapp',
    //         prefix: 'webapp'
    //       }
    //     },
    //     components: 'webapp'
    //   }
    // }
  openui5_preload: {

    component: {
      options: {
        resources: {
          cwd: 'temp/webapp',
          prefix: 'webapp'
        },
        dest: 'dist'
      },
      components: 'webapp'
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
    'clean',          // clear temp folder
    'copy',          // copy webapp to temp folder 
    'babel',          // Transpile javascript files in temp overwriting 
    'openui5_preload' // Build Component-preload.js in webapp from temp
  ]);
}
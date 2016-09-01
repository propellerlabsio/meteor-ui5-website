module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    openui5_preload: {
      component: {
        options: {
          resources: {
            cwd: '',
            prefix: '',
            src: [
              'public/webapp/**/*.js',
              'public/webapp/**/*.fragment.html',
              'public/webapp/**/*.fragment.json',
              'public/webapp/**/*.fragment.xml',
              'public/webapp/**/*.view.html',
              'public/webapp/**/*.view.json',
              'public/webapp/**/*.view.xml',
              'public/webapp/**/*.properties'
            ],
            dest: '.'
          },
          compress: true
        },
        components: true
      }
    }
  });

  grunt.loadNpmTasks('grunt-openui5');

  grunt.registerTask('build', ['openui5_preload']);
}
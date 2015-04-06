module.exports = function(grunt) {
  grunt.initConfig({
    //pkg: grunt.file.readJSON('package.json'),
    loopback_sdk_angular: {
      services: {
        options: {
          input: 'server/server.js',
          output: 'client/js/lb-services.js'
        }
      }
    },
    docular: {
      baseUrl: 'http://120.24.54.6:26668/doc/',
      groups: [
        {
          groupTitle: 'LoopBack',
          groupId: 'loopback',
          sections: [
            {
              id: 'lbServices',
              title: 'LoopBack Services',
              scripts: [ 'client/js/lb-services.js' ]
            }
          ]
        }
      ]
    }
  });
 
  // Load the plugin that provides the "loopback-sdk-angular" and "grunt-docular" tasks.
  grunt.loadNpmTasks('grunt-loopback-sdk-angular');
  grunt.loadNpmTasks('grunt-docular');
  // Default task(s).
  grunt.registerTask('default', ['loopback_sdk_angular', 'docular']);
};
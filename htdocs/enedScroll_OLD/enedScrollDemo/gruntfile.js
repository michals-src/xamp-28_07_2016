module.exports = function(grunt){
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		uglify:{
	        dev: {
	            options: {
	                mangle: true
	            },
	            files: {
	                'js/enedScroll-new.min.js': 'js/enedScroll-new.js'
	            }
	        }
		}

	});
};
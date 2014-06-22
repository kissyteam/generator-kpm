module.exports = function(grunt) {
	var task = grunt.task;
    grunt.initConfig({
        // 配置文件，参考package.json配置方式，必须设置项是
        // name, version, author
        // name作为gallery发布后的模块名
        // version是版本，也是发布目录
        // author必须是{name: "xxx", email: "xxx"}格式
        pkg: grunt.file.readJSON('config.json'),
        banner: '/*!build time : <%%= grunt.template.today("yyyy-mm-dd h:MM:ss TT") %>*/\n',

        // 对build目录进行清理
        clean: {
            build: {
                src: './build/*'
			}
        },
        // kmc打包任务，默认情况，入口文件是index.js，可以自行添加入口文件，在files下面
        // 添加
        kmc: {
            options: {
                packages: [
                    {
                        name: '<%%= pkg.name %>',
                        path: '../'
                    }
                ],
                map: [["<%%= pkg.name %>/", "gallery/<%%= pkg.name %>/<%%= pkg.version %>/"]]
            },
            main: {
                files: [
                    {
                        src: "./index.js",
                        dest: "./build/index.js"
                    },
                    {
                        src: "./mini.js",
                        dest: "./build/mini.js"
                    }
                ]
            }
        },
        /**
         * 对JS文件进行压缩
         * @link https://github.com/gruntjs/grunt-contrib-uglify
         */
        uglify: {
            options: {
                compress:{
                    global_defs:{"DEBUG":false},
                    drop_console:true,
                    dead_code:true
                },
                banner: '<%%= banner %>',
                beautify: {
                    ascii_only: true
                }
            },
            page: {
                files: [
                    {
                        expand: true,
                        cwd: './build',
                        src: ['**/*.js', '!**/*-min.js'],
                        dest: './build',
                        ext: '-min.js'
                    }
                ]
            }
        },
        less: {
            options: {
                paths: './'
            },
            main: {
                files: [
                    {
                        expand: true,
						cwd:'./',
                        src: ['**/*.less',
							'!build/**/*.less',   
							'!demo/**/*.less'],
                        dest: './build/',
                        ext: '.less.css'
                    }
                ]
            }
        },
        sass: {
        	dist: {
        		files: [{
        			expand: true,
					cwd:'./',
					src: ['**/*.scss',
						'!build/**/*.scss',
						'!demo/**/*.scss'],
					dest: './build/',
        			ext: '.scss.css'
        		}]
        	}
        },
		// 拷贝 CSS 文件
		copy : {
			main: {
				files:[
					{
						expand:true,
						cwd:'./',
						src: [
							'**/*.css',
							'!build/**/*.css',
							'!demo/**/*.css'
						], 
						dest: './build/', 
						filter: 'isFile'
					}
				]
			}
		},
		// 监听JS、CSS、LESS文件的修改
        watch: {
            'all': {
                files: [
					'./**/*.js',
					'./src/**/*.css',
					'!./build/**/*'
				],
                tasks: [ 'build' ]
            }
		},
        cssmin: {
            scss: {
                files: [
                    {
                        expand: true,
                        cwd: './build',
                        src: ['**/*.scss.css', '!**/*.scss-min.css'],
                        dest: './build',
                        ext: '.scss-min.css'
                    }
                ]
            },
            less: {
                files: [
                    {
                        expand: true,
                        cwd: './build',
                        src: ['**/*.less.css', '!**/*.less-min.css'],
                        dest: './build',
                        ext: '.less-min.css'
                    }
                ]
            },
            main: {
                files: [
                    {
                        expand: true,
                        cwd: './build',
                        src: ['**/*.css', '!**/*-min.css','!**/*.less.css','!**/*.scss.css'],
                        dest: './build',
                        ext: '-min.css'
                    }
                ]
            }
        }<% if(isSupportISV){ %>,
        isv_gallery:{
            default_option:{}
        }
        <% } %>
    });

    // 使用到的任务，可以增加其他任务
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-kmc');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-sass');
	<% if(isSupportISV){ %>
        grunt.loadNpmTasks('grunt-isv-gallery');
    <% } %>


	grunt.registerTask('build', '默认构建任务', function() {
		task.run(['clean:build', 'kmc','uglify', 'copy','less','sass','cssmin']);
	});

    return grunt.registerTask('default', '',function(type){
		if (!type) {
			task.run(['build']);
		}
	});
};

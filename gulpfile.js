//导入工具包 require('node_modules里对应模块')
var gulp = require('gulp'), //本地安装gulp所用到的地方
    less = require('gulp-less'), //less转化为css
    concat = require('gulp-concat'), //合并文件
    uglify = require('gulp-uglify'), // 压缩js代码
    rename = require('gulp-rename'), // 重命名文件
    minifycss = require('gulp-minify-css'), // 压缩css代码
    imagemin = require('gulp-imagemin'), // 优化图片
    header = require('gulp-header'),
    pkg = require('./package.json'),
    moment = require('moment'),
    through2 = require('through2'),
    del = require('del'),
    hash = require('gulp-hash'),
    watch = require('gulp-watch'),
    webpack = require('webpack'),
    livereload = require('gulp-livereload'),
    fileinclude = require('gulp-file-include'),
    eslint = require('gulp-eslint'),
    eslint-plugin-html = require('eslint-plugin-html'),
    banner = '/*! <%= pkg.name %> - git - <%= moment().format("YYYY-MM-DD HH:mm:ss") %> */\r\n',
    banner2 = '/* eslint-disable */'


//定义一个testLess任务（自定义任务名称）
gulp.task('testLess', function () {
    gulp.src('src/less/*.less') //该任务针对的文件
        .pipe(less()) //该任务调用的模块
        .pipe(gulp.dest('src/css')); //将会在src/css下生成index.css
});
gulp.task('less2css',function () {
    gulp.src('less/*.less')
        .pipe(less())
        .pipe(gulp.dest('css'))
})
// gulp-header 测试    给文件加一个头
gulp.task('header', function () {
    gulp.src('src/jsdev/*.js')
        .pipe(header('Hello ${name}\n', { name : 'World'} ))
        .pipe(gulp.dest('js'))
});
gulp.task('newheader',function () {
    gulp.src('src/jsdev/*.js')
        .pipe(header(banner2))
        .pipe(gulp.dest('js'))
});
// del 删除文件／文件夹测试
gulp.task('del', function () {
    del(['src/css/*.css']).then(function () {
        console.log('files have been deleted')
    })
});
// hash测试
gulp.task('hash', function () {
    gulp.src('src/css/*.css')
        .pipe(hash())
        .pipe(gulp.dest('src/css'))
        .pipe(hash.manifest('assets.json', {
            deleteOld: true,
            sourceDir: __dirname + '/public/js'
        })) // Switch to the manifest file
        .pipe(gulp.dest('public')); // Write the manifest file
});
// watch 测试
gulp.task('gulpWatch', function () {
    return watch('src/less/*.less')
        .pipe(gulp.dest('src/css'))

});
// gulp-file-include 测试
gulp.task('file-include',function () {
    gulp.src('src/page/index.html')
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest('dist'))
});
gulp.task('pkg', function () {
    var banner = ['/**',
        ' * <%= pkg.name %> - <%= pkg.description %>',
        ' * @version v<%= pkg.version %>',
        ' * @link <%= pkg.homepage %>',
        ' * @license <%= pkg.license %>',
        ' */',
        ''].join('\n');
    gulp.src('src/jsdev/*.js')
        .pipe(header(banner, { pkg : pkg } ))
        .pipe(gulp.dest('js'))
})
// 合并css
gulp.task('minifycss', ['testLess'], function () {
    gulp.src('./src/css/*.css')
        .pipe(concat('all-in-one.css')) // 合并后的css文件名
        .pipe(minifycss())               // 压缩css代码（去除里面的空格，不可读化）
        .pipe(gulp.dest('dest'))
})
// 控制台打印输出
gulp.task('log', function () {
    console.log('i logged some thing')
});
// 复制文件到另一个目录
gulp.task('copyfiles', function () {
    gulp.src('./src/less/index.less')    //  匹配到的文件
        .pipe(gulp.dest('dist'))         //  复制到dist文件夹下，如果没有这个文件夹就新建
});
//复制图片
gulp.task('copyimg', function () {
    gulp.src('./src/img/*.jpg')
        .pipe(gulp.dest('dist'))
});
// 多个数据文件复制
gulp.task('multidata', function () {
     gulp.src(['./src/css/*.css','./src/img/*.jpg','!./src/img/ditu.jpg'])   // 在前面加感叹号是排除这个文件
         .pipe(gulp.dest('destination'))
});
// 创建依赖任务
gulp.task('build',['multidata'], function () {
    gulp.src('./destination/*')
        .pipe(gulp.dest('store'))
    console.log('编译完成')
});
// 创建监听任务，当文件发生变化，自动执行相应的任务
gulp.task('watch', function () {
    gulp.watch('./src/less/*.less', ['testLess'])
})
//默认任务
gulp.task('default',['testLess']); //定义默认任务

//gulp.task(name[, deps], fn) 定义任务  name：任务名称 deps：依赖任务名称 fn：回调函数
//gulp.src(globs[, options]) 执行任务处理的文件  globs：处理的文件路径(字符串或者字符串数组)
//gulp.dest(path[, options]) 处理完后文件生成路径
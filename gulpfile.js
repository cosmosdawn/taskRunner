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
    eslint = require('gulp-eslint'),                          //gulp-eslint插件
    ephtml = require('eslint-plugin-html'),
    banner = '/*! <%= pkg.name %> - git - <%= moment().format("YYYY-MM-DD HH:mm:ss") %> */\r\n',
    banner2 = '/* eslint-disable */\r\n'


gulp.task('add', function () {
    gulp.src(['src/jsdev/*.js','src/jsdev/**/*.js'])
        .pipe(header(banner2))
        .pipe(gulp.dest('src/jsdev/'))
})

//定义一个testLess任务（自定义任务名称）
gulp.task('testLess', function () {
    gulp.src('src/less/*.less')         //该任务针对的文件
        .pipe(less())                   //该任务调用的模块
        .pipe(gulp.dest('src/css'));    //将会在src/css下生成index.css
});                                     // done
// gulp-header 测试    给文件加一个头
gulp.task('header', function () {
    gulp.src('src/jsdev/*.js')
        .pipe(header('Hello ${name}\n', { name : 'xiaoyu'} ))
        .pipe(gulp.dest('src/js'))
});                                     //done
// del 删除文件／文件夹测试
gulp.task('del', function () {
    del(['src/css/*.css','src/css/*.less']).then(function () {    // del接收一个数组，里面的每一项匹配一个要删除的文件的条件
        console.log('files have been deleted')
    })
});                                     //done
// 有选择的删除
gulp.task('delhashcss', function () {
    del(['src/css/*.css','!src/css/a.css','!src/css/b.css','!src/css/c.css']).then(function () {
        console.log('除了最初的三个css文件其余文件都已经删除了')
    })
})
// hash测试
gulp.task('hash', function () {
    gulp.src('src/css/*.css')
        .pipe(hash())               // 给文件名字追加添加哈希值
        .pipe(gulp.dest('src/css'))
        .pipe(hash.manifest('assets.json', {      // manifest 翻译为'货单'，是生成一个变换前后对应的json文件，文件名称由自己指定
            deleteOld: true                       // 生成新的之前删除旧的
        }))
    .pipe(gulp.dest('public'));                  //done
});
// watch 测试
gulp.task('gulpWatch', function () {
    return watch('src/less/*.less')
        .pipe(less())
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
gulp.task('pkg', function () {        // pkg代表的是package.json配置文件
    var banner = ['/**',
        ' * <%= pkg.name %> - <%= pkg.description %>',
        ' * @version v<%= pkg.version %>',
        ' * @link <%= pkg.homepage %>',
        ' * @license <%= pkg.license %>',
        ' */',
        ''].join('\n');          // 用换行符号链接起来，形成一段注释的字符串
    gulp.src('src/jsdev/*.js')
        .pipe(header(banner, { pkg : pkg } ))   // header 可以在文件头部添加一段由模版产生的文字描述
        .pipe(gulp.dest('js'))
})
// 合并css
gulp.task('minifycss', ['testLess'], function () {
    gulp.src('./src/css/*.css')
        .pipe(concat('all-in-one.css'))  // 合并后的css文件名
        //.pipe(minifycss())               // 压缩css代码（去除里面的空格，不可读化）
        .pipe(gulp.dest('dest'))
})

gulp.task('minifyjs', function() {
    gulp.src(['./src/jsdev/*.js','./src/jsdev/**/*.js'])
        .pipe(concat('all-in-one.js'))
        .pipe(gulp.dest('dest/js'))
});
// 控制台打印输出
gulp.task('log', function () {
    console.log('i logged some thing')
});
// 复制文件到另一个目录
gulp.task('copyfiles', function () {
    gulp.src('./src/less/b.less')    //  匹配到的文件
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






// 这里是分割线
gulp.task('lint',function () {
    // 注意层级
    return gulp.src(['jsdev/*.js','!node_modules/**'])
        .pipe(eslint())
        //输出校验的结果到控制台
        .pipe(eslint.format())
        //出现错误后停止程序的运行并抛出错误对象
        .pipe(eslint.failAfterError());
})
gulp.task('default',['lint'],function () {
        // 这里的代码只有在lint没有出错的前提下才会执行
})
// 创建监听任务，当文件发生变化，自动执行相应的任务
gulp.task('watch', function () {
    gulp.watch('./src/less/*.less', ['testLess'])
})
//默认任务
//gulp.task('default',['testLess']); //定义默认任务

//gulp.task(name[, deps], fn) 定义任务  name：任务名称 deps：依赖任务名称 fn：回调函数
//gulp.src(globs[, options]) 执行任务处理的文件  globs：处理的文件路径(字符串或者字符串数组)
//gulp.dest(path[, options]) 处理完后文件生成路径
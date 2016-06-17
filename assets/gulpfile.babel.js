import gulp from "gulp";
import del from "del";
import browserify from "browserify";
import babelify from "babelify";
import source from "vinyl-source-stream";
import buffer from "vinyl-buffer";
import runSequence from "run-sequence";
import browserSync from "browser-sync";
import gulpLoadPlugins from "gulp-load-plugins";

const $ = gulpLoadPlugins();
const reload = browserSync.reload;

gulp.task("clean", del.bind(null, [".tmp", "dist"]));

gulp.task("fonts", () => {
    gulp.src("app/assets/**/*.{otf,eot,svg,ttf,woff,woff2}")
        .pipe($.size({title: "fonts"}))
        .pipe($.rename({dirname: ""}))
        .pipe(gulp.dest("dist/assets/fonts"));
});

gulp.task("lint", () => {
    gulp.src("app/assets/scripts/**/*.js")
        .pipe($.eslint())
        .pipe($.eslint.format())
        .pipe($.if(!browserSync.active, $.eslint.failOnError()));
});

gulp.task("styles", () => {
    gulp.src("app/assets/styles/**/*.scss")
        .pipe($.sourcemaps.init())
        .pipe($.sass({
            precision: 10
        }).on("error", $.notify.onError({title: "styles"})))
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest(".tmp/assets/styles"))
        .pipe($.autoprefixer({browsers: ["last 2 versions"]}))
        .pipe($.cssnano())
        .pipe(gulp.dest("dist/assets/styles"));
});

gulp.task("scripts", () => {
    browserify("./app/assets/scripts/app.js", {debug: true})
        .transform(babelify)
        .bundle()
        .on("error", $.notify.onError({title: "scripts"}))
        .pipe(source("app.js"))
        .pipe(gulp.dest(".tmp/assets/scripts"))
        .pipe(buffer())
        .pipe($.uglify({preserveComments: "some"}))
        .pipe($.size({title: "scripts"}))
        .pipe(gulp.dest("dist/assets/scripts"));
});

gulp.task("html", () => {
    gulp.src("app/index.html")
        .pipe($.inject(
                gulp.src(["app/assets/styles/**/*.scss"], {read: false})
                    .pipe($.rename({extname: ".css"})),
                {relative: true}
            )
        )
        .pipe(gulp.dest(".tmp"))
        .pipe($.useref())
        // .pipe($.useref())
        .pipe($.htmlmin({
            removeComments: true,
            collapseWhitespace: true,
            collapseBooleanAttributes: true,
            removeAttributeQuotes: true,
            removeRedundantAttributes: true,
            removeEmptyAttributes: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true,
            removeOptionalTags: true
        }))
        .pipe($.size({title: "html"}))
        .pipe(gulp.dest("dist"))
});

gulp.task("serve", ["scripts", "styles", "html"], () => {
    browserSync({notify: false, server: [".tmp", "app"], port: 3000});

    gulp.watch(["app/**/*.html"], ["html", reload]);
    gulp.watch(["app/assets/styles/**/*.scss"], ["styles", "lint", reload]);
    gulp.watch(["app/assets/scripts/**/*.js"], ["scripts", reload]);
});

gulp.task("serve:dist", ["default"], () => {
    browserSync({notify: false, server: "dist", port: 3000});
});

gulp.task("default", ["clean"], callback => {
    runSequence(["styles", "scripts", "html", "fonts"], callback);
});

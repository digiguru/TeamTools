var gulp = require("gulp");
var ts = require("gulp-typescript");
var tsEntry = ts.createProject("Entry/tsconfig.json");
var tsTuckman = ts.createProject("Tuckman/tsconfig.json");
var tsComfortZone = ts.createProject("ComfortZone/tsconfig.json");
var tsReact = ts.createProject("React/tsconfig.json");
var sourcemaps = require('gulp-sourcemaps');

gulp.task("BuildEntry", function () {
    var ts = tsEntry.src()
        .pipe(sourcemaps.init())
        .pipe(tsEntry())
    return ts.js
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest("Entry"));
});
gulp.task("BuildTuckman", function () {
    return tsTuckman.src()
        .pipe(sourcemaps.init())
        .pipe(tsTuckman())
        .js.pipe(sourcemaps.write("."))
        .pipe(gulp.dest("Tuckman"));
});
gulp.task("BuildComfortZone", function () {
    return tsComfortZone.src()
        .pipe(sourcemaps.init())
        .pipe(tsComfortZone())
        .js.pipe(sourcemaps.write("."))
        .pipe(gulp.dest("ComfortZone"));
});
gulp.task("BuildReact", function () {
    return tsReact.src()
        .pipe(sourcemaps.init())
        .pipe(tsReact())
        .js.pipe(sourcemaps.write("."))
        .pipe(gulp.dest("React"));
});
gulp.task('Build', ['BuildReact'/*,'BuildRedux','BuildEntry', 'BuildTuckman', 'BuildComfortZone'*/]);

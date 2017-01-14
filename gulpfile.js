var gulp = require("gulp");
var ts = require("gulp-typescript");
var tsEntry = ts.createProject("Entry/tsconfig.json");
var tsTuckman = ts.createProject("Tuckman/tsconfig.json");
var tsComfortZone = ts.createProject("ComfortZone/tsconfig.json");
var sourcemaps = require('gulp-sourcemaps');


gulp.task("Entry", function () {
    return tsEntry.src()
        .pipe(sourcemaps.init())
        .pipe(tsEntry())
        .js.pipe(sourcemaps.write())
        .pipe(gulp.dest("Entry"));
});
gulp.task("Tuckman", function () {
    return tsTuckman.src()
        .pipe(sourcemaps.init())
        .pipe(tsTuckman())
        .js.pipe(sourcemaps.write())
        .pipe(gulp.dest("Tuckman"));
});
gulp.task("ComfortZone", function () {
    return tsComfortZone.src()
        .pipe(sourcemaps.init())
        .pipe(tsComfortZone())
        .js.pipe(sourcemaps.write())
        .pipe(gulp.dest("ComfortZone"));
});

gulp.task('Build', ['Entry', 'Tuckman', 'ComfortZone']);

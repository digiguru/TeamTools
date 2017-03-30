var gulp = require("gulp");
var ts = require("gulp-typescript");
var tsReact = ts.createProject("React/tsconfig.json");
var sourcemaps = require('gulp-sourcemaps');

gulp.task("BuildReact", function () {
    return tsReact.src()
        .pipe(sourcemaps.init())
        .pipe(tsReact())
        .js.pipe(sourcemaps.write("."))
        .pipe(gulp.dest("React"));
});
gulp.task('Build', ['BuildReact'/*,'BuildRedux','BuildEntry', 'BuildTuckman', 'BuildComfortZone'*/]);

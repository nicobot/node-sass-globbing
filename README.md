# node-sass-globbing

[![Build Status](https://travis-ci.org/nicobot/node-sass-globbing.svg?branch=master)](https://travis-ci.org/nicobot/node-sass-globbing)
[![Dependency Status](https://david-dm.org/nicobot/node-sass-globbing.svg)](https://david-dm.org/nicobot/node-sass-globbing)
[![npm](https://img.shields.io/npm/v/npm.svg)](https://www.npmjs.com/package/node-sass-globbing)

Allows you to use glob syntax in imports (i.e. `@import "dir/*.sass"`). Use as a custom importer for node-sass.

### Example

##### gulpfile.js
```javascript
var nodeSassGlobbing = require('node-sass-globbing');

gulp.task('sass', function () {
	return gulp.src('styles/**/*.{scss,sass}')
			.pipe(sass({importer: nodeSassGlobbing}).on('error', sass.logError)))
			.pipe(gulp.dest('css'))			
}));
	
```

Then you can import globs!

##### foo.sass
```css
@import "variables/**/*.scss";
@import "mixins/**/*.scss";
```

It also works with sourcemaps:
```javascript
var nodeSassGlobbing = require('node-sass-globbing'),
	sourcemaps = require('gulp-sourcemaps');

gulp.task('sass', function () {
	return gulp.src('styles/**/*.{scss,sass}')
			.pipe(sourcemaps.init())
			.pipe(sass({importer: nodeSassGlobbing}).on('error', sass.logError)))
			.pipe(sourcemaps.write('./maps'))
			.pipe(gulp.dest('css'))			
}));

```


### Tests

```
npm test
```

### Tests (Docker)

You can also run the tests through docker. 
Initially the repository would need to install the dependencies, you can do that with:
```
docker run -it --rm --name my-running-script -v "$PWD":/usr/src/app -w /usr/src/app node:4 npm install
```

After dependencies are installed run the tests with:
```
docker run -it --rm --name my-running-script -v "$PWD":/usr/src/app -w /usr/src/app node:4 npm test
```

### License
Available under the [MIT License](LICENSE.md).

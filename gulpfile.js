const { src, dest, watch, parallel } = require('gulp');

// CSS
const sass = require('gulp-sass')(require('sass'));
const plumber = require('gulp-plumber');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps')

// IMAGENES
const cache = require('gulp-cache');
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const avif = require('gulp-avif');

// JavaScript
const terser = require('gulp-terser-js');


function css(callback) {

    src("src/scss/**/*.scss") // Identificar el archivo SASS
        .pipe(sourcemaps.init())
        .pipe(plumber())
        .pipe(sass())        // Compilarlo
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(sourcemaps.write('.'))
        .pipe(dest("build/css")); // Almacenarlo en directorio


    callback(); // callback que avisa a gulp cuando llegamos al final
};

function imagenes(callback) {
    const opc = {
        optimizationLevel: 3
    };

    src('src/img/**/*.{jpg,png}')
        .pipe(cache(imagemin(opc)))
        .pipe(dest('build/img'));

    callback();
}

function versionWebp(callback) {
    const opc = {
        quality: 50
    };

    src('src/img/**/*.{jpg,png}')
        .pipe(webp(opc))
        .pipe(dest('build/img'));

    callback();
}

function versionAvif(callback) {
    const opc = {
        quality: 50
    };

    src('src/img/**/*.{jpg,png}')
        .pipe(avif(opc))
        .pipe(dest('build/img'));

    callback();
}

function javascript(callback) {
    src('src/js/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(terser())
        .pipe(sourcemaps.write('.'))
        .pipe(dest('build/js'));

    callback();
}

function dev(callback) {

    watch("src/scss/**/*.scss", css);
    watch("src/js/**/*.js", javascript);

    callback();
}

exports.css = css;
exports.js = javascript;
exports.imagenes = imagenes;
exports.versionWebp = versionWebp;
exports.dev = parallel(imagenes, versionWebp, versionAvif, javascript, dev);
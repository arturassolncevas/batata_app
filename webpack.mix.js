const mix = require('laravel-mix');
const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.react('resources/js/app.js', 'public/js')
   .less('resources/styles/less/app.less', 'public/css',
      {
         modifyVars: {
            'primary-color': '#0BD37E',
         },
         javascriptEnabled: true,
      }
   );

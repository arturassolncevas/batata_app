### Installation
##### Required
 - [PHP](https://www.php.net/) v7.3.22+
 - [Node.js](https://nodejs.org/) v1.22.4+
 - [Yarn](https://www.npmjs.com/package/yarn) v14.0.0+
 - [Composer](https://getcomposer.org/) v1.9.0+
 - [PostgreSQL](https://www.postgresql.org/) v10.14+
 - [Elasticsearch](https://www.elastic.co/) v7.9.1+
 - [Minio](https://min.io/) from version RELEASE.2020-06-03

Install php dependencies
```sh
$ sudo composer install
```
Migrate database
```sh
$ php artisan migrate
```
Seed database
```sh
$ php artisan db:seed
```
Run passport install
```sh
$ php artisan passport:install
```
Run yarn watch (development)
```sh
$ yarn watch
```
Run development server
```sh
$ php artisan serve
```
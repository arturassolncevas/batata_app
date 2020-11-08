### Installation
##### Required
 - [PHP](https://www.php.net/) v7.3.22+
 - [Node.js](https://nodejs.org/) v1.22.4+
 - [Yarn](https://www.npmjs.com/package/yarn) v14.0.0+
 - [Composer](https://getcomposer.org/) v1.9.0+
 - [PostgreSQL](https://www.postgresql.org/) v10.14+
 - [Elasticsearch](https://www.elastic.co/) v7.9.1+
 - [Minio](https://min.io/) from version RELEASE.2020-06-03

Install php curl & gd
```sh
$ sudo apt-get install php7.x-curl sudo apt-get install php7.x-gd
```
Install php curl
```sh
$ sudo apt-get install php7.x-curl
```
Install php dependencies
```sh
$ sudo composer install
```
Create elasticsearch index
```sh
$ php artisan elasticsearch:create_indexes
```
Make sure your system has following locales: ('da_DK.utf8'). Create collation in database
```sh
CREATE COLLATION da_dk (LOCALE = 'da_DK.utf8')
```
Restart database
```sh
/etc/init.d/postgresql restart
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
Run yarn install
```sh
$ yarn watch
```
Run yarn watch (development)
```sh
$ yarn watch
```
Run development server
```sh
$ php artisan serve
```
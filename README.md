# Landkarte

Premium map based on leaflet and openstreetmap tiles

## Run local development server

```sh
vagrant up
```

Now fire up your browser and open http://localhost:8085

Copy `app/config/config.vagrant.default.php` to `app/config/config.php` as a starting point with working database config.

### Restart all over again

```sh
vagrant destroy --force && vagrant up
```

## configuration

copy config template

```sh
cp ./app/config/config.sample.php ./app/config/config.php
```

edit config vars for mysql connection and collmex api connection

```sh
nano ./app/config/config.php
```

## Run collmex sync

```sh
# Fetch new item from collmex database
php app/cli.php update

# Enrich items with geolocation information
php app/cli.php update geo
```

## Add, list, delete products

```sh
# Add new product
php app/cli.php product add "New beverage name" "Beverage description" collmexId

# List all products
php app/cli.php product list

# Delete existing product
php app/cli.php product delete 5
```

## Installation on ubuntu-server 16.04

## install phalcon framework

```sh
sudo apt-get install -y gcc make re2c libpcre3-dev php-dev build-essential php-zip
```

### Install composer

```sh
sudo curl -sS http://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer
```

### Install zephir

```sh
sudo composer global require "phalcon/zephir:dev-master"
```

### Install phalcon dev tool

```sh
sudo composer require "phalcon/devtools" -d /usr/local/bin/
sudo ln -s /usr/local/bin/vendor/phalcon/devtools/phalcon.php /usr/bin/phalcon
```

### Install phalconphp with php7

```sh
sudo git clone https://github.com/phalcon/cphalcon.git -b 2.1.x --single-branch
cd cphalcon/
sudo ~/.composer/vendor/bin/zephir build --backend=ZendEngine3
sudo echo "extension=phalcon.so" >> /etc/php/7.0/fpm/conf.d/20-phalcon.ini
sudo echo "extension=phalcon.so" >> /etc/php/7.0/cli/conf.d/20-phalcon.ini
```

### restart php-fpm

```sh
sudo service php7.0-fpm restart
```

## Install npm dependencies

```sh
composer install
```

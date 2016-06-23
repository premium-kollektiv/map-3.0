# map-3.0

Premium map based on leaflet and openstreetmap tiles

## demo

development demo: http://premium.geldfrei.net/

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

## Install nodejs

```sh
sudo apt-get install nodejs npm
```

## Install npm dependencies

```sh
npm install
```

## build

```sh
NODE_ENV=production webpack
```

## point host to public folder..

## take an outside walk in the park

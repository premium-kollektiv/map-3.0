# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|
  # The most common configuration options are documented and commented below.
  # For a complete reference, please see the online documentation at
  # https://docs.vagrantup.com.

  # all available versions: https://app.vagrantup.com/ubuntu
  config.vm.box = "ubuntu/bionic64"
  config.vm.network "forwarded_port", guest: 80, host: 8085, host_ip: "127.0.0.1"
  config.vm.network "forwarded_port", guest: 3306, host: 3316, host_ip: "127.0.0.1"

  # Create a public network, which generally matched to bridged network.
  # Bridged networks make the machine appear as another physical device on
  # your network.
  # config.vm.network "public_network"

  # Share an additional folder to the guest VM. The first argument is
  # the path on the host to the actual folder. The second argument is
  # the path on the guest to mount the folder. And the optional third
  # argument is a set of non-required options.
  config.vm.synced_folder ".", "/var/www/html"
  config.vm.synced_folder ".", "/vagrant"
  
  config.vm.provision "shell", inline: <<-SHELL
    set -e # Exit immediately if a simple command exits with a non-zero status
    set -x # Print the command before executing it

    curl -s https://packagecloud.io/install/repositories/phalcon/stable/script.deb.sh | sudo bash

    echo "mysql-server-5.6 mysql-server/root_password password r00tme" | sudo debconf-set-selections
    echo "mysql-server-5.6 mysql-server/root_password_again password r00tme" | sudo debconf-set-selections

    sudo apt-get update
    sudo apt-get install -y php7.2-cli php7.2-common php7.2-curl php7.2-dev php7.2-fpm php7.2-json php7.2-mysql php7.2-phalcon=3.4.0-5+php7.2 php7.2-zip apache2 mysql-server
    sudo cp /vagrant/apache2-default /etc/apache2/sites-enabled/000-default.conf
    sudo a2enmod alias rewrite proxy proxy_fcgi
    sudo a2enconf php7.2-fpm
    sudo phpenmod phalcon
    sudo systemctl restart apache2 php7.2-fpm

    mysqladmin create --show-warnings=false cola -pr00tme
    mysql -u root -pr00tme cola < /vagrant/docs/database/schema.sql

    sudo curl -sS http://getcomposer.org/installer | php
    sudo mv composer.phar /usr/local/bin/composer
  SHELL

end

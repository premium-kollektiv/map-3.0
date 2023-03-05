# Docker image to use with Vagrant
# Aims to be as similar to normal Vagrant usage as possible
# Adds SSH daemon, Systemd
# Adapted from https://github.com/BashtonLtd/docker-vagrant-images/blob/master/ubuntu1404/Dockerfile

# Adapted from https://betterprogramming.pub/managing-virtual-machines-under-vagrant-on-a-mac-m1-aebc650bc12c
# and https://dev.to/taybenlor/running-vagrant-on-an-m1-apple-silicon-using-docker-3fh4

FROM ubuntu:22.04
ENV container docker
RUN apt-get update -y && apt-get dist-upgrade -y

# Install system dependencies, you may not need all of these
RUN apt-get install -y --no-install-recommends ssh sudo libffi-dev systemd openssh-client

# Needed to run the Vagrant provisioning script
RUN apt-get install -y curl gnupg apt-transport-https

# Add vagrant user and key for SSH
RUN useradd --create-home -s /bin/bash vagrant
RUN echo -n 'vagrant:vagrant' | chpasswd
RUN echo 'vagrant ALL = NOPASSWD: ALL' > /etc/sudoers.d/vagrant
RUN chmod 440 /etc/sudoers.d/vagrant
RUN mkdir -p /home/vagrant/.ssh
RUN chmod 700 /home/vagrant/.ssh
ADD https://raw.githubusercontent.com/hashicorp/vagrant/master/keys/vagrant.pub /home/vagrant/.ssh/authorized_keys
RUN chmod 600 /home/vagrant/.ssh/authorized_keys
RUN chown -R vagrant:vagrant /home/vagrant/.ssh

# Start SSH
RUN mkdir /var/run/sshd
EXPOSE 22
RUN /usr/sbin/sshd

# Start Systemd (systemctl)
CMD ["/lib/systemd/systemd"]

#! /bin/bash

installSoftware() {
    apt -qq -y install nginx
}

installSTE() {
    curl -Lo /var/www/ste/build/bundle.js https://github.com/sunshineplan/SimpleTextEncryption/releases/download/v1.0/bundle.js --create-dirs
    cd /var/www/ste
    curl -LO https://raw.githubusercontent.com/sunshineplan/ste/main/public/style.css
    curl -LO https://raw.githubusercontent.com/sunshineplan/ste/main/public/index.html
    curl -LO https://raw.githubusercontent.com/sunshineplan/ste/main/scripts/ste.conf
}

writeLogrotateScrip() {
    if [ ! -f '/etc/logrotate.d/app' ]; then
	cat >/etc/logrotate.d/app <<-EOF
		/var/log/app/*.log {
		    copytruncate
		    rotate 12
		    compress
		    delaycompress
		    missingok
		    notifempty
		}
		EOF
    fi
}

setupNGINX() {
    cp -s /var/www/ste/ste.conf /etc/nginx/conf.d
    sed -i "s/\$domain/$domain/" /var/www/ste/ste.conf
    service nginx reload
}

main() {
    read -p 'Please enter domain:' domain
    installSoftware
    installSTE
    writeLogrotateScrip
    setupNGINX
}

main

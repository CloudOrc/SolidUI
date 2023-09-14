#!/usr/bin/env bash
#
# Licensed to the Apache Software Foundation (ASF) under one or more
# contributor license agreements.  See the NOTICE file distributed with
# this work for additional information regarding copyright ownership.
# The ASF licenses this file to You under the Apache License, Version 2.0
# (the "License"); you may not use this file except in compliance with
# the License.  You may obtain a copy of the License at
# http://www.apache.org/licenses/LICENSE-2.0
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

#current directory
workDir=$(cd `dirname $0`; pwd)


echo "solidui frontend deployment script"

source $workDir/config.sh
# frontend directory,decompression directory by default

input_port=$1

re='^[0-9]+$'
if  [[ $input_port =~ $re ]] ; then
   echo "try to use special frontend port：${input_port}"
   solidui_port=$input_port
fi

solidui_basepath=$workDir

#To be compatible with MacOS and Linux
if [[ "$OSTYPE" == "darwin"* ]]; then
    # Mac OSX
    echo "solidui install not support Mac OSX operating system"
    exit 1
elif [[ "$OSTYPE" == "linux-gnu" ]]; then
    # linux
    echo "linux"
elif [[ "$OSTYPE" == "cygwin" ]]; then
    # POSIX compatibility layer and Linux environment emulation for Windows
    echo "solidui not support Windows operating system"
    exit 1
elif [[ "$OSTYPE" == "msys" ]]; then
    # Lightweight shell and GNU utilities compiled for Windows (part of MinGW)
    echo "solidui not support Windows operating system"
    exit 1
elif [[ "$OSTYPE" == "win32" ]]; then
    echo "solidui not support Windows operating system"
    exit 1
elif [[ "$OSTYPE" == "freebsd"* ]]; then
    # ...
    echo "freebsd"
else
    # Unknown.
    echo "Operating system unknown, please tell us(submit issue) for better service"
    exit 1
fi

# distinguish version
version=`cat /etc/redhat-release|sed -r 's/.* ([0-9]+)\..*/\1/'`

echo "================================== print config info begin =================================="

echo "frontend port：${solidui_port}"
echo "backend address：${solidui_url}"
echo "models backend address：${solidui_url_models}"
echo "kernel backend address：${solidui_url_kernel}"
echo "static file directory：${solidui_basepath}/dist"
echo "current directory：${workDir}"
echo "local ip：${solidui_ipaddr}"

echo "================================== print config info end =================================="
echo ""

portIsOccupy=false
checkPort(){
    pid=`sudo lsof -nP -iTCP:$solidui_port -sTCP:LISTEN`
    if [ "$pid" != "" ];then
      echo "$solidui_port already used"
      portIsOccupy=true
    fi
}

#create nginx conf file
soliduiConf(){

	  s_host='$host'
    s_remote_addr='$remote_addr'
    s_proxy_add_x_forwarded_for='$proxy_add_x_forwarded_for'
    s_http_upgrade='$http_upgrade'
    echo "
			server {
				listen       $solidui_port;#access port
				server_name  localhost;

				location / {
					root   ${solidui_basepath}/dist; #static directory
					index  index.html index.html;
				}

				location /solidui {
					proxy_pass $solidui_url; # solidui backend address
					proxy_set_header Host $s_host;
					proxy_set_header X-Real-IP $s_remote_addr;
					proxy_set_header x_real_ipP $s_remote_addr;
					proxy_set_header remote_addr $s_remote_addr;
					proxy_set_header X-Forwarded-For $s_proxy_add_x_forwarded_for;
					proxy_http_version 1.1;
					proxy_connect_timeout 4s;
					proxy_read_timeout 600s;
					proxy_send_timeout 12s;
					proxy_set_header Upgrade $s_http_upgrade;
					proxy_set_header Connection upgrade;
				}

				location /solidui/models {
					proxy_pass $solidui_url_models; #Solidui backend address
					proxy_set_header Host $s_host;
					proxy_set_header X-Real-IP $s_remote_addr;
					proxy_set_header x_real_ipP $s_remote_addr;
					proxy_set_header remote_addr $s_remote_addr;
					proxy_set_header X-Forwarded-For $s_proxy_add_x_forwarded_for;
					proxy_http_version 1.1;
					proxy_connect_timeout 4s;
					proxy_read_timeout 600s;
					proxy_send_timeout 12s;
					proxy_set_header Upgrade $s_http_upgrade;
					proxy_set_header Connection upgrade;
        }

				location /solidui/kernel {
					proxy_pass $solidui_url_kernel; #Solidui backend address
					proxy_set_header Host $s_host;
					proxy_set_header X-Real-IP $s_remote_addr;
					proxy_set_header x_real_ipP $s_remote_addr;
					proxy_set_header remote_addr $s_remote_addr;
					proxy_set_header X-Forwarded-For $s_proxy_add_x_forwarded_for;
					proxy_http_version 1.1;
					proxy_connect_timeout 4s;
					proxy_read_timeout 600s;
					proxy_send_timeout 12s;
					proxy_set_header Upgrade $s_http_upgrade;
					proxy_set_header Connection upgrade;
				}


				error_page   500 502 503 504  /50x.html;
					location = /50x.html {
					root   /usr/share/nginx/html;
				}
			}
    " > /etc/nginx/conf.d/solidui.conf

}


centos7(){
	# to install nginx
	#sudo rpm -Uvh http://nginx.org/packages/centos/7/noarch/RPMS/nginx-release-centos-7-0.el7.ngx.noarch.rpm
	sudo yum install -y nginx
	echo "install nginx success"

	# config inginx
	soliduiConf

	# fix 0.0.0.0:8888 problem
	yum -y install policycoreutils-python
	semanage port -a -t http_port_t -p tcp $solidui_port

	# Open front-end access port
	firewall-cmd --zone=public --add-port=$solidui_port/tcp --permanent

	# restart firewall
	firewall-cmd --reload

	# start nginx
	systemctl restart nginx

	# adjust SELinux parameter
	sed -i "s/SELINUX=enforcing/SELINUX=disabled/g" /etc/selinux/config
	# take effect temporarily
	setenforce 0
}

centos6(){
	# yum
	S_basearch='$basearch'
	S_releasever='$releasever'
	echo "
	[nginx]
	name=nginx repo
	baseurl=http://nginx.org/packages/centos/$E_releasever/$S_basearch/
	gpgcheck=0
	enabled=1
	" >> /etc/yum.repos.d/nginx.repo

	# install nginx
	yum install nginx -y

	# config inginx
	soliduiConf

	# firewall
	S_iptables=`sudo lsof -i:$solidui_port | wc -l`
	if [ "$S_iptables" -gt "0" ];then
		# allow to access port,restart firewall
		service iptables restart
	else
		# not allow to access port,add port rule,restart firewall
		iptables -I INPUT 5 -i eth0 -p tcp --dport $solidui_port -m state --state NEW,ESTABLISHED -j ACCEPT
		service iptables save
		service iptables restart
	fi

	# start nginx
	sudo /etc/init.d/nginx start

		# adjust SELinux parameter
	sed -i "s/SELINUX=enforcing/SELINUX=disabled/g" /etc/selinux/config

	# take effect temporarily
	setenforce 0
}

checkPort
if [ "$portIsOccupy" = true ];then
  echo "The port is already in use, please check before installing"
  exit 1
fi

if [ -e /var/run/nginx.pid ]; then
echo "Nginx is already running! Will try to reload nginx config";
# config inginx
soliduiConf

sudo nginx -s reload

else

	echo "Starting install nginx and try to starting..."

  # centos 6
  if [[ $version -eq 6 ]]; then
      centos6
  fi

  # centos 7
  if [[ $version -eq 7 ]]; then
      centos7
  fi

fi

echo "Please open the link in the browser：http://${solidui_ipaddr}:${solidui_port}"

import os
from docker_digitalocean_common import *

def copy_api_src_to_remote_host(ssh_con_str):
	pwd = run_local_command("pwd").rstrip()
	local_dir = pwd + "/../*"
	print "Copying web-api src (" + local_dir + ") to remote host."
	rsync_cmd = "rsync -azP --delete --exclude '*/node_modules' " + local_dir + " " + ssh_con_str + ":/root/apps/alexa/air/dev/web/api"
	print "rsync command: " + rsync_cmd
	os.system(rsync_cmd)
	print "Copying web-api src to remote host finished."

def build_api_continer_in_remote_host(ssh):
	print "Building alexa-air-dev/web-api image in remote host."
	result = ssh("docker build -t alexa-air-dev/web-api /root/apps/alexa/air/dev/web/api")
	print "Building alexa-air-dev/web-api image in remote host result: "
	print result

def run_api_container(ssh):
	print "Starting alexa-air-dev-web-api container in remote host."
	result = ssh("docker run --name alexa-air-dev-web-api --link alexa-air-dev-web-db:air-db -d alexa-air-dev/web-api")
	print "Starting alexa-air-dev-web-api container in remote host result: "
	print result

